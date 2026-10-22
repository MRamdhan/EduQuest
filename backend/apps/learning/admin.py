from django.contrib import admin

from apps.learning.models import (
    EducationLevel,
    Material,
    MaterialPrerequisite,
    Question,
    QuestionGeneration,
    QuestionReport,
    QuizAttempt,
    QuizQuestion,
    Subject,
)


class MaterialPrerequisiteInline(admin.TabularInline):
    model = MaterialPrerequisite
    fk_name = "material"
    extra = 0


@admin.register(EducationLevel)
class EducationLevelAdmin(admin.ModelAdmin):
    list_display = ["code", "name", "order"]
    ordering = ["order"]


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ["name", "level", "slug", "icon"]
    list_filter = ["level"]
    search_fields = ["name"]


@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    list_display = ["title", "subject", "topic_code", "status", "order", "updated_at"]
    list_filter = ["status", "subject__level", "subject"]
    search_fields = ["title", "topic", "topic_code", "content"]
    prepopulated_fields = {"slug": ("title",)}
    inlines = [MaterialPrerequisiteInline]


@admin.register(MaterialPrerequisite)
class MaterialPrerequisiteAdmin(admin.ModelAdmin):
    list_display = ["material", "prerequisite"]


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ["id", "short_text", "subject", "difficulty", "review_status", "is_active"]
    list_filter = ["review_status", "subject__level", "subject", "difficulty", "is_active"]
    search_fields = ["question_text", "source_id", "topic", "hint"]
    readonly_fields = ["created_at", "updated_at"]

    @admin.display(description="Soal")
    def short_text(self, obj):
        return obj.question_text[:80]


@admin.register(QuestionReport)
class QuestionReportAdmin(admin.ModelAdmin):
    list_display = ["id", "question", "user", "reason", "status", "created_at"]
    list_filter = ["status", "reason"]
    search_fields = ["question__question_text", "note"]
    readonly_fields = ["created_at"]


@admin.register(QuestionGeneration)
class QuestionGenerationAdmin(admin.ModelAdmin):
    list_display = ["id", "material", "provider", "model_name", "status", "created_at"]
    list_filter = ["status", "provider"]
    readonly_fields = ["created_at"]


class QuizQuestionInline(admin.TabularInline):
    model = QuizQuestion
    extra = 0
    readonly_fields = [
        "question",
        "order",
        "difficulty",
        "selected_option",
        "is_correct",
        "is_resolved",
        "attempts",
        "hint_used",
        "hint_source",
        "answered_at",
    ]
    can_delete = False


@admin.register(QuizAttempt)
class QuizAttemptAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "user",
        "material",
        "status",
        "target_difficulty",
        "correct_count",
        "total_questions",
        "percent",
        "started_at",
    ]
    list_filter = ["status", "target_difficulty"]
    search_fields = ["user__username", "material__title"]
    readonly_fields = ["started_at", "submitted_at"]
    inlines = [QuizQuestionInline]
