from rest_framework.response import Response
from rest_framework.views import APIView

from apps.progress.models import Rank
from apps.progress.serializers import ProgressSummarySerializer, RankSerializer
from apps.progress.services import calculate_learning_stats, progress_payload


class ProgressView(APIView):
    def get(self, request):
        payload = progress_payload(request.user)
        return Response(ProgressSummarySerializer(payload).data)


class LearningStatsView(APIView):
    """Menyajikan statistik pembelajaran dan analisis penguasaan per mapel."""

    def get(self, request):
        stats = calculate_learning_stats(request.user)
        return Response(stats)


class RankListView(APIView):
    def get(self, request):
        ranks = Rank.objects.filter(is_active=True).order_by("order")
        return Response(RankSerializer(ranks, many=True).data)
