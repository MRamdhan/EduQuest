from rest_framework.response import Response
from rest_framework.views import exception_handler

from apps.core.errors import DomainError


def api_exception_handler(exc, context):
    """Mengubah DomainError menjadi respons JSON yang konsisten."""
    if isinstance(exc, DomainError):
        return Response(
            {"detail": str(exc), "code": exc.code},
            status=exc.status_code,
        )

    response = exception_handler(exc, context)
    if response is not None and isinstance(response.data, dict):
        response.data.setdefault("code", getattr(exc, "default_code", "error"))
    return response
