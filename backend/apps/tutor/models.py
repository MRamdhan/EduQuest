from django.conf import settings
from django.db import models


class TutorConversation(models.Model):
    """Metadata percakapan Tutor.

    Isi percakapan disimpan seminimal mungkin dan harus memiliki kebijakan
    retensi yang jelas sebelum dipakai di produksi.
    """

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="tutor_conversations")
    material = models.ForeignKey(
        "learning.Material",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="tutor_conversations",
    )
    question = models.TextField()
    answer = models.TextField(blank=True)
    provider = models.CharField(max_length=80, blank=True)
    model_name = models.CharField(max_length=120, blank=True)
    is_degraded = models.BooleanField(default=False)
    error_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Percakapan Tutor"
        verbose_name_plural = "Percakapan Tutor"

    def __str__(self) -> str:
        return f"{self.user} — {self.created_at:%d-%m-%Y %H:%M}"
