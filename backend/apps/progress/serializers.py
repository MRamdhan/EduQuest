from rest_framework import serializers

from apps.learning.serializers import QuizAttemptHistorySerializer
from apps.progress.models import Rank, UserProgress


class RankSerializer(serializers.Serializer):
    code = serializers.CharField()
    name = serializers.CharField()
    order = serializers.IntegerField()
    min_xp = serializers.IntegerField()
    unlocked_difficulty = serializers.IntegerField()
    icon = serializers.CharField(allow_blank=True)
    description = serializers.CharField(allow_blank=True)


class SubjectLivesSerializer(serializers.Serializer):
    subject_id = serializers.IntegerField()
    subject = serializers.CharField()
    subject_slug = serializers.CharField()
    lives = serializers.IntegerField()
    max_lives = serializers.IntegerField()
    life_regen_started_at = serializers.DateTimeField(allow_null=True)
    next_life_at = serializers.DateTimeField(allow_null=True)
    seconds_to_next_life = serializers.IntegerField(allow_null=True)


class UserProgressSerializer(serializers.ModelSerializer):
    level = serializers.IntegerField(read_only=True)
    xp_into_level = serializers.IntegerField(read_only=True)
    xp_for_next_level = serializers.IntegerField(read_only=True)
    xp_to_next_level = serializers.IntegerField(read_only=True)
    rank = serializers.SerializerMethodField()
    next_rank = serializers.SerializerMethodField()
    xp_to_next_rank = serializers.IntegerField(read_only=True, allow_null=True)

    class Meta:
        model = UserProgress
        fields = [
            "xp",
            "level",
            "rank",
            "next_rank",
            "xp_to_next_rank",
            "xp_into_level",
            "xp_for_next_level",
            "xp_to_next_level",
            "updated_at",
        ]

    def get_rank(self, obj):
        rank = obj.rank
        return rank.to_payload() if isinstance(rank, Rank) else None

    def get_next_rank(self, obj):
        rank = obj.next_rank
        return rank.to_payload() if isinstance(rank, Rank) else None


class UserAchievementSerializer(serializers.Serializer):
    code = serializers.CharField(source="achievement.code")
    title = serializers.CharField(source="achievement.title")
    description = serializers.CharField(source="achievement.description")
    unlocked_at = serializers.DateTimeField()


class ProgressSummarySerializer(serializers.Serializer):
    xp = serializers.IntegerField()
    level = serializers.IntegerField()
    rank = RankSerializer(allow_null=True)
    next_rank = RankSerializer(allow_null=True)
    xp_to_next_rank = serializers.IntegerField(allow_null=True)
    xp_into_level = serializers.IntegerField()
    xp_for_next_level = serializers.IntegerField()
    xp_to_next_level = serializers.IntegerField()
    subject_lives = SubjectLivesSerializer(many=True)
    materials_completed = serializers.IntegerField()
    quizzes_submitted = serializers.IntegerField()
    recent_attempts = QuizAttemptHistorySerializer(many=True)
    achievements = UserAchievementSerializer(many=True)
