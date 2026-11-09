from django.urls import path

from apps.tutor.views import TutorAskView, TutorRecommendationView

urlpatterns = [
    path("tutor/ask/", TutorAskView.as_view(), name="tutor-ask"),
    path("tutor/recommendations/", TutorRecommendationView.as_view(), name="tutor-recommendations"),
]
