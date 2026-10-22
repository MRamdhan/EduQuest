from django.contrib import admin
from django.urls import include, path

from apps.core.views import HealthView

admin.site.site_header = "EduQuest Admin"
admin.site.site_title = "EduQuest"
admin.site.index_title = "Pengelolaan konten dan pengguna"

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", HealthView.as_view(), name="health"),
    path("api/auth/", include("apps.accounts.urls")),
    path("api/", include("apps.learning.urls")),
    path("api/", include("apps.progress.urls")),
    path("api/", include("apps.tutor.urls")),
]
