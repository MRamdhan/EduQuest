from django.shortcuts import get_object_or_404
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from apps.learning.models import Material
from apps.tutor.services.tutor_service import ask_tutor


class AskTutorSerializer(serializers.Serializer):
    material_id = serializers.IntegerField()
    question = serializers.CharField(max_length=1000, trim_whitespace=True)


class TutorAskView(APIView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "tutor"

    def post(self, request):
        serializer = AskTutorSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        material = get_object_or_404(
            Material,
            pk=serializer.validated_data["material_id"],
            status=Material.Status.PUBLISHED,
        )
        result = ask_tutor(request.user, material, serializer.validated_data["question"])
        return Response(
            {**result, "material_id": material.pk},
            status=status.HTTP_200_OK,
        )
