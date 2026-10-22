from rest_framework.response import Response
from rest_framework.views import APIView

from apps.progress.models import Rank
from apps.progress.serializers import ProgressSummarySerializer, RankSerializer
from apps.progress.services import progress_payload


class ProgressView(APIView):
    def get(self, request):
        payload = progress_payload(request.user)
        return Response(ProgressSummarySerializer(payload).data)


class RankListView(APIView):
    def get(self, request):
        ranks = Rank.objects.filter(is_active=True).order_by("order")
        return Response(RankSerializer(ranks, many=True).data)
