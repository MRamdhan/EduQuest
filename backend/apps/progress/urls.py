from django.urls import path

from apps.progress.views import LearningStatsView, ProgressView, RankListView

urlpatterns = [
    path("progress/", ProgressView.as_view(), name="progress"),
    path("progress/stats/", LearningStatsView.as_view(), name="progress-stats"),
    path("ranks/", RankListView.as_view(), name="ranks"),
]
