from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


def create_missing_profiles(apps, schema_editor):
    """Buat profil untuk akun yang sudah ada sebelum fitur jenjang dirilis."""
    User = apps.get_model(*settings.AUTH_USER_MODEL.split("."))
    StudentProfile = apps.get_model("accounts", "StudentProfile")

    existing_user_ids = set(
        StudentProfile.objects.values_list("user_id", flat=True)
    )
    StudentProfile.objects.bulk_create(
        [
            StudentProfile(user_id=user_id)
            for user_id in User.objects.values_list("pk", flat=True)
            if user_id not in existing_user_ids
        ]
    )


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("learning", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="StudentProfile",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "education_level",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="students",
                        to="learning.educationlevel",
                        verbose_name="Jenjang",
                    ),
                ),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="student_profile",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name": "Profil siswa",
                "verbose_name_plural": "Profil siswa",
            },
        ),
        migrations.RunPython(create_missing_profiles, migrations.RunPython.noop),
    ]
