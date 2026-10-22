from rest_framework import serializers

from apps.learning.models import EducationLevel, Material, Subject


class EducationLevelSerializer(serializers.ModelSerializer):
    subject_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = EducationLevel
        fields = ["id", "code", "name", "order", "subject_count"]


class SubjectSerializer(serializers.ModelSerializer):
    level = serializers.CharField(source="level.code", read_only=True)
    level_name = serializers.CharField(source="level.name", read_only=True)
    material_count = serializers.IntegerField(read_only=True, default=0)
    lives = serializers.SerializerMethodField()
    max_lives = serializers.SerializerMethodField()
    next_life_at = serializers.SerializerMethodField()
    seconds_to_next_life = serializers.SerializerMethodField()

    class Meta:
        model = Subject
        fields = [
            "id",
            "name",
            "slug",
            "icon",
            "level",
            "level_name",
            "material_count",
            "lives",
            "max_lives",
            "next_life_at",
            "seconds_to_next_life",
        ]

    def _life(self, obj) -> dict:
        return self.context.get("lives_map", {}).get(obj.pk, {})

    def get_lives(self, obj) -> int:
        return self._life(obj).get("lives", 3)

    def get_max_lives(self, obj) -> int:
        return self._life(obj).get("max_lives", 3)

    def get_next_life_at(self, obj):
        return self._life(obj).get("next_life_at")

    def get_seconds_to_next_life(self, obj):
        return self._life(obj).get("seconds_to_next_life")


class MaterialListSerializer(serializers.ModelSerializer):
    subject = serializers.CharField(source="subject.name", read_only=True)
    subject_id = serializers.IntegerField(read_only=True)
    level = serializers.CharField(source="subject.level.code", read_only=True)
    is_completed = serializers.SerializerMethodField()

    class Meta:
        model = Material
        fields = [
            "id",
            "title",
            "slug",
            "topic",
            "summary",
            "subject",
            "subject_id",
            "level",
            "estimated_minutes",
            "is_completed",
        ]

    def get_is_completed(self, obj) -> bool:
        completed_ids = self.context.get("completed_ids", set())
        return obj.pk in completed_ids


class MaterialPrerequisiteSerializer(serializers.ModelSerializer):
    subject = serializers.CharField(source="subject.name", read_only=True)
    level = serializers.CharField(source="subject.level.code", read_only=True)

    class Meta:
        model = Material
        fields = ["id", "title", "topic", "subject", "level"]


class MaterialDetailSerializer(MaterialListSerializer):
    content_html = serializers.CharField(read_only=True)
    prerequisites = MaterialPrerequisiteSerializer(many=True, read_only=True)
    status = serializers.CharField(read_only=True)
    source = serializers.CharField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)
    subject_lives = serializers.SerializerMethodField()

    class Meta(MaterialListSerializer.Meta):
        fields = MaterialListSerializer.Meta.fields + [
            "content_html",
            "prerequisites",
            "status",
            "source",
            "updated_at",
            "subject_lives",
        ]

    def get_subject_lives(self, obj):
        return self.context.get("subject_lives")


class StartQuizSerializer(serializers.Serializer):
    material_id = serializers.IntegerField()
    difficulty = serializers.IntegerField(min_value=1, max_value=3, required=False, allow_null=True)


class AnswerQuestionSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    option = serializers.CharField(max_length=4, trim_whitespace=True)


class QuestionReportSerializer(serializers.Serializer):
    reason = serializers.ChoiceField(
        choices=[
            ("wrong_key", "Kunci jawaban diduga salah"),
            ("unclear", "Soal atau opsi tidak jelas"),
            ("typo", "Salah ketik"),
            ("off_topic", "Tidak sesuai materi"),
            ("other", "Lainnya"),
        ],
        default="other",
    )
    note = serializers.CharField(max_length=2000, required=False, allow_blank=True)


class QuizAttemptHistorySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    material = serializers.SerializerMethodField()
    status = serializers.CharField()
    target_difficulty = serializers.IntegerField()
    total_questions = serializers.IntegerField()
    correct_count = serializers.IntegerField()
    percent = serializers.FloatField()
    xp_gained = serializers.IntegerField()
    submitted_at = serializers.DateTimeField(allow_null=True)
    started_at = serializers.DateTimeField()

    def get_material(self, obj):
        if not obj.material_id:
            return None
        return {"id": obj.material_id, "title": obj.material.title}
