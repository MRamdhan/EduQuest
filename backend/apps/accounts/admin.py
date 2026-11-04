from django.contrib import admin

from apps.accounts.models import StudentProfile


@admin.register(StudentProfile)
class StudentProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "education_level", "kelas", "updated_at"]
    list_select_related = ["user", "education_level"]
    search_fields = ["user__username", "user__email", "user__first_name"]
    list_filter = ["education_level", "kelas"]
    autocomplete_fields = ["user"]
