from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.accounts"
    verbose_name = "Akun"

    def ready(self) -> None:
        # Daftarkan signal pembuatan profil siswa.
        from apps.accounts import signals  # noqa: F401
