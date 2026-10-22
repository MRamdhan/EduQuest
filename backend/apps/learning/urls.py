from django.urls import path

from apps.learning.views import (
    AnswerQuestionView,
    EducationLevelListView,
    MaterialCompleteView,
    MaterialDetailView,
    MaterialListView,
    QuestionReportView,
    QuizAttemptDetailView,
    QuizHistoryView,
    StartQuizView,
    SubjectListView,
)

urlpatterns = [
    path("levels/", EducationLevelListView.as_view(), name="levels"),
    path("subjects/", SubjectListView.as_view(), name="subjects"),
    path("materials/", MaterialListView.as_view(), name="materials"),
    path("materials/<int:pk>/", MaterialDetailView.as_view(), name="material-detail"),
    path("materials/<int:pk>/complete/", MaterialCompleteView.as_view(), name="material-complete"),
    path("quizzes/", StartQuizView.as_view(), name="quiz-start"),
    path("quizzes/history/", QuizHistoryView.as_view(), name="quiz-history"),
    path("quizzes/<int:pk>/", QuizAttemptDetailView.as_view(), name="quiz-detail"),
    path("quizzes/<int:pk>/answer/", AnswerQuestionView.as_view(), name="quiz-answer"),
    path("questions/<int:pk>/report/", QuestionReportView.as_view(), name="question-report"),
]
