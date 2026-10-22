from django.contrib import admin

from apps.progress.models import (
    Achievement,
    AdaptationEvent,
    Rank,
    SubjectProgress,
    UserAchievement,
    UserMaterialProgress,
    UserProgress,
    XPTransaction,
)


@admin.register(Rank)
class RankAdmin(admin.ModelAdmin):
    list_display = ["order", "name", "code", "min_xp", "unlocked_difficulty", "is_active"]
    list_editable = ["name", "min_xp", "unlocked_difficulty", "is_active"]
    ordering = ["order"]
    search_fields = ["name", "code"]


@admin.register(UserProgress)
class UserProgressAdmin(admin.ModelAdmin):
    list_display = ["user", "xp", "level_display", "rank_display", "updated_at"]
    search_fields = ["user__username"]

    @admin.display(description="Level")
    def level_display(self, obj):
        return obj.level

    @admin.display(description="Rank")
    def rank_display(self, obj):
        rank = obj.rank
        return rank.name if rank else "-"


@admin.register(SubjectProgress)
class SubjectProgressAdmin(admin.ModelAdmin):
    list_display = ["user", "subject", "lives", "life_regen_started_at", "updated_at"]
    list_filter = ["subject__level", "subject"]
    search_fields = ["user__username", "subject__name"]


@admin.register(XPTransaction)
class XPTransactionAdmin(admin.ModelAdmin):
    list_display = ["user", "amount", "reason", "reference", "created_at"]
    list_filter = ["reason"]
    search_fields = ["user__username", "reference", "idempotency_key"]
    readonly_fields = ["created_at"]


@admin.register(UserMaterialProgress)
class UserMaterialProgressAdmin(admin.ModelAdmin):
    list_display = ["user", "material", "status", "completed_at", "updated_at"]
    list_filter = ["status"]
    search_fields = ["user__username", "material__title"]


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ["code", "title", "xp_reward", "is_active"]
    search_fields = ["code", "title"]


@admin.register(UserAchievement)
class UserAchievementAdmin(admin.ModelAdmin):
    list_display = ["user", "achievement", "unlocked_at"]
    search_fields = ["user__username", "achievement__title"]


@admin.register(AdaptationEvent)
class AdaptationEventAdmin(admin.ModelAdmin):
    list_display = [
        "user",
        "material",
        "action",
        "previous_difficulty",
        "next_difficulty",
        "rule_name",
        "created_at",
    ]
    list_filter = ["action", "rule_name"]
    search_fields = ["user__username", "material__title", "reason"]
    readonly_fields = ["created_at", "config"]
