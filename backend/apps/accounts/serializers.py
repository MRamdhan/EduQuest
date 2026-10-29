from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from apps.accounts.models import StudentProfile
from apps.learning.models import EducationLevel

User = get_user_model()


class EducationLevelChoiceField(serializers.Field):
    """Jenjang yang bisa dikirim sebagai kode (SD/SMP/SMA) atau id angka."""

    default_error_messages = {
        "blank": "Jenjang wajib dipilih.",
        "invalid": "Jenjang harus berupa kode (SD/SMP/SMA) atau id angka.",
        "not_found": "Jenjang '{value}' tidak dikenal.",
    }

    def to_internal_value(self, data):
        if isinstance(data, bool):
            self.fail("invalid")

        level = None
        if isinstance(data, int):
            level = EducationLevel.objects.filter(pk=data).first()
        elif isinstance(data, str):
            value = data.strip()
            if not value:
                self.fail("blank")
            if value.isdigit():
                level = EducationLevel.objects.filter(pk=int(value)).first()
            else:
                level = (
                    EducationLevel.objects.filter(code__iexact=value).first()
                    or EducationLevel.objects.filter(name__iexact=value).first()
                )
        else:
            self.fail("invalid")

        if level is None:
            self.fail("not_found", value=data)
        return level

    def to_representation(self, value):
        if value is None:
            return None
        return {"id": value.pk, "code": value.code, "name": value.name}


class UserSerializer(serializers.ModelSerializer):
    education_level = EducationLevelChoiceField(
        source="student_profile.education_level",
        required=False,
        allow_null=True,
    )

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "date_joined",
            "education_level",
        ]
        read_only_fields = ["id", "username", "date_joined"]

    def update(self, instance, validated_data):
        profile_data = validated_data.pop("student_profile", None)
        user = super().update(instance, validated_data)

        if profile_data and "education_level" in profile_data:
            profile, _ = StudentProfile.objects.get_or_create(user=user)
            profile.education_level = profile_data["education_level"]
            profile.save(update_fields=["education_level", "updated_at"])
            # Segarkan cache one-to-one supaya respons PATCH langsung benar.
            user.student_profile = profile
        return user


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField(required=False, allow_blank=True)
    first_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    education_level = EducationLevelChoiceField(
        error_messages={"required": "Jenjang wajib dipilih."}
    )
    password = serializers.CharField(write_only=True, trim_whitespace=False)
    password_confirm = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("Nama pengguna sudah dipakai.")
        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError({"password_confirm": "Konfirmasi kata sandi tidak sama."})
        # Validator Django memakai atribut user sementara agar mirip username.
        candidate = User(username=attrs.get("username", ""), email=attrs.get("email", ""))
        validate_password(attrs["password"], user=candidate)
        return attrs

    def create(self, validated_data):
        validated_data.pop("password_confirm")
        password = validated_data.pop("password")
        education_level = validated_data.pop("education_level")
        user = User.objects.create_user(password=password, **validated_data)

        # Profil sudah dibuat oleh signal; isi jenjang yang dipilih saat daftar.
        profile, _ = StudentProfile.objects.get_or_create(user=user)
        profile.education_level = education_level
        profile.save(update_fields=["education_level", "updated_at"])
        # Segarkan cache one-to-one agar respons registrasi memuat jenjang.
        user.student_profile = profile

        # Progres awal dibuat oleh service (hindari import melingkar di sini).
        from apps.progress.services import get_or_create_progress

        get_or_create_progress(user)
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate(self, attrs):
        user = authenticate(
            request=self.context.get("request"),
            username=attrs["username"],
            password=attrs["password"],
        )
        if user is None:
            raise serializers.ValidationError("Nama pengguna atau kata sandi salah.")
        if not user.is_active:
            raise serializers.ValidationError("Akun ini tidak aktif.")
        attrs["user"] = user
        return attrs
