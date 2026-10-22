from django.urls import path

from apps.tutor.views import TutorAskView

urlpatterns = [
    path("tutor/ask/", TutorAskView.as_view(), name="tutor-ask"),
]
