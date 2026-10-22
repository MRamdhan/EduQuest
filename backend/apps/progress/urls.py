from django.urls import path

from apps.progress.views import ProgressView, RankListView

urlpatterns = [
    path("progress/", ProgressView.as_view(), name="progress"),
    path("ranks/", RankListView.as_view(), name="ranks"),
]
