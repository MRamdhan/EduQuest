from django.db.models import Count, Q
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.learning.models import EducationLevel, Material, Question, QuestionReport, QuizAttempt, Subject
from apps.learning.serializers import (
    AnswerQuestionSerializer,
    EducationLevelSerializer,
    MaterialDetailSerializer,
    MaterialListSerializer,
    QuestionReportSerializer,
    QuizAttemptHistorySerializer,
    StartQuizSerializer,
    SubjectSerializer,
)
from apps.learning.services import quiz_service
from apps.progress.models import UserMaterialProgress
from apps.progress.serializers import UserProgressSerializer
from apps.progress.services import complete_material, subject_lives_map


class EducationLevelListView(APIView):
    def get(self, request):
        levels = EducationLevel.objects.annotate(
            subject_count=Count("subjects", distinct=True)
        ).order_by("order", "code")
        return Response(EducationLevelSerializer(levels, many=True).data)


class SubjectListView(APIView):
    def get(self, request):
        subjects = (
            Subject.objects.select_related("level")
            .annotate(
                material_count=Count(
                    "materials",
                    filter=Q(materials__status=Material.Status.PUBLISHED),
                    distinct=True,
                )
            )
            .order_by("level__order", "name")
        )
        level = request.query_params.get("level")
        if level:
            subjects = subjects.filter(
                Q(level__code__iexact=level) | Q(level_id=level if level.isdigit() else None)
            )
        subject_list = list(subjects)
        return Response(
            SubjectSerializer(
                subject_list,
                many=True,
                context={"lives_map": subject_lives_map(request.user, subject_list)},
            ).data
        )


def _completed_ids(user) -> set[int]:
    return set(
        UserMaterialProgress.objects.filter(
            user=user,
            status=UserMaterialProgress.Status.COMPLETED,
        ).values_list("material_id", flat=True)
    )


class MaterialListView(APIView):
    def get(self, request):
        materials = Material.objects.filter(
            status=Material.Status.PUBLISHED
        ).select_related("subject__level")

        level = request.query_params.get("level")
        if level:
            materials = materials.filter(subject__level__code__iexact=level)

        subject = request.query_params.get("subject")
        if subject:
            if not subject.isdigit():
                return Response(
                    {"detail": "Parameter subject harus berupa ID."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            materials = materials.filter(subject_id=int(subject))

        search = request.query_params.get("search")
        if search:
            materials = materials.filter(
                Q(title__icontains=search)
                | Q(topic__icontains=search)
                | Q(summary__icontains=search)
            )

        serializer = MaterialListSerializer(
            materials,
            many=True,
            context={"completed_ids": _completed_ids(request.user)},
        )
        return Response(serializer.data)


class MaterialDetailView(APIView):
    def get(self, request, pk: int):
        material = get_object_or_404(
            Material.objects.select_related("subject__level").prefetch_related(
                "prerequisites__subject__level"
            ),
            pk=pk,
            status=Material.Status.PUBLISHED,
        )
        serializer = MaterialDetailSerializer(
            material,
            context={
                "completed_ids": _completed_ids(request.user),
                "subject_lives": subject_lives_map(
                    request.user,
                    [material.subject],
                ).get(material.subject_id),
            },
        )
        return Response(serializer.data)


class MaterialCompleteView(APIView):
    def post(self, request, pk: int):
        material = get_object_or_404(
            Material,
            pk=pk,
            status=Material.Status.PUBLISHED,
        )
        result = complete_material(request.user, material)
        return Response(
            {
                "already_completed": result["already_completed"],
                "xp_gained": result["xp_gained"],
                "progress": UserProgressSerializer(result["progress"]).data,
            }
        )


class StartQuizView(APIView):
    def post(self, request):
        serializer = StartQuizSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        material = get_object_or_404(
            Material.objects.select_related("subject__level"),
            pk=serializer.validated_data["material_id"],
            status=Material.Status.PUBLISHED,
        )
        result = quiz_service.start_quiz(
            request.user,
            material,
            requested_difficulty=serializer.validated_data.get("difficulty"),
        )
        return Response(result, status=status.HTTP_201_CREATED)


class QuizAttemptDetailView(APIView):
    def get(self, request, pk: int):
        return Response(quiz_service.attempt_payload(request.user, pk))


class AnswerQuestionView(APIView):
    def post(self, request, pk: int):
        serializer = AnswerQuestionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = quiz_service.answer_question(
            request.user,
            pk,
            serializer.validated_data["question_id"],
            serializer.validated_data["option"],
        )
        return Response(result)


class QuizHistoryView(APIView):
    def get(self, request):
        attempts = (
            QuizAttempt.objects.filter(user=request.user)
            .select_related("material")
            .order_by("-started_at")[:20]
        )
        return Response(QuizAttemptHistorySerializer(attempts, many=True).data)


class QuestionReportView(APIView):
    def post(self, request, pk: int):
        question = get_object_or_404(Question, pk=pk, is_active=True)
        serializer = QuestionReportSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        report = QuestionReport.objects.create(
            question=question,
            user=request.user,
            reason=serializer.validated_data["reason"],
            note=serializer.validated_data.get("note", ""),
        )
        return Response(
            {"id": report.pk, "status": report.status, "question_id": question.pk},
            status=status.HTTP_201_CREATED,
        )
