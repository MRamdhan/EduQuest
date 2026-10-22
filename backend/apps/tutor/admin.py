from django.contrib import admin

from apps.tutor.models import TutorConversation


@admin.register(TutorConversation)
class TutorConversationAdmin(admin.ModelAdmin):
    list_display = ["id", "user", "material", "provider", "is_degraded", "created_at"]
    list_filter = ["is_degraded", "provider"]
    search_fields = ["user__username", "question", "answer"]
    readonly_fields = ["created_at"]
