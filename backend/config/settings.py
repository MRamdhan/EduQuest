"""Konfigurasi Django EduQuest.

Nilai rahasia dan alamat layanan dibaca dari environment (.env).
Jangan menaruh API key atau SECRET_KEY produksi di file ini.
"""

from pathlib import Path
import os

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(BASE_DIR / ".env")


def env_bool(name: str, default: bool = False) -> bool:
    return os.getenv(name, str(default)).strip().lower() in {"1", "true", "yes", "on"}


def env_list(name: str, default: str = "") -> list[str]:
    return [item.strip() for item in os.getenv(name, default).split(",") if item.strip()]


SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "dev-only-insecure-secret-key-change-me")
DEBUG = env_bool("DJANGO_DEBUG", True)
ALLOWED_HOSTS = env_list("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1,[::1]")

CSRF_TRUSTED_ORIGINS = env_list(
    "DJANGO_CSRF_TRUSTED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173",
)

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "rest_framework.authtoken",
    "corsheaders",
    "apps.core",
    "apps.accounts",
    "apps.learning",
    "apps.progress",
    "apps.tutor",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "data" / "db.sqlite3",
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "id"
TIME_ZONE = "Asia/Jakarta"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# --- API, autentikasi, dan CORS -------------------------------------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.TokenAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.UserRateThrottle",
        "rest_framework.throttling.AnonRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "user": os.getenv("API_USER_RATE", "600/hour"),
        "anon": os.getenv("API_ANON_RATE", "60/hour"),
        "tutor": os.getenv("API_TUTOR_RATE", "30/hour"),
    },
    "DEFAULT_PAGINATION_CLASS": None,
    "EXCEPTION_HANDLER": "apps.core.exceptions.api_exception_handler",
}

CORS_ALLOWED_ORIGINS = env_list(
    "CORS_ALLOWED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173,"
    "http://localhost:5500,http://127.0.0.1:5500,"
    "http://localhost:8080,http://127.0.0.1:8080",
)
CORS_ALLOW_CREDENTIALS = False

# --- AI provider (belum final) --------------------------------------------
AI_PROVIDER = os.getenv("AI_PROVIDER", "")  # contoh: openai-compatible
AI_API_KEY = os.getenv("AI_API_KEY", "")
AI_BASE_URL = os.getenv("AI_BASE_URL", "")
AI_MODEL = os.getenv("AI_MODEL", "")
AI_TIMEOUT_SECONDS = int(os.getenv("AI_TIMEOUT_SECONDS", "20"))
AI_MAX_INPUT_CHARS = int(os.getenv("AI_MAX_INPUT_CHARS", "1000"))
AI_MAX_CONTEXT_CHARS = int(os.getenv("AI_MAX_CONTEXT_CHARS", "4000"))
# Model penalaran (mis. gpt-oss) memakai sebagian token untuk reasoning, jadi
# batas keluaran harus lebih longgar daripada panjang jawaban yang diinginkan.
AI_MAX_OUTPUT_TOKENS = int(os.getenv("AI_MAX_OUTPUT_TOKENS", "1200"))
# Kosongkan untuk provider/model yang tidak mendukung parameter ini.
AI_REASONING_EFFORT = os.getenv("AI_REASONING_EFFORT", "").strip().lower()
# Retry singkat untuk 429/5xx; kuota Groq free tier dihitung per token/menit.
AI_MAX_RETRIES = int(os.getenv("AI_MAX_RETRIES", "2"))
# Hint cukup dua kalimat, jadi lebih hemat token daripada jawaban tutor.
AI_HINT_MAX_OUTPUT_TOKENS = int(os.getenv("AI_HINT_MAX_OUTPUT_TOKENS", "400"))
AI_HINT_MAX_CONTEXT_CHARS = int(os.getenv("AI_HINT_MAX_CONTEXT_CHARS", "2000"))

# --- Aturan gamifikasi & konten -------------------------------------------
QUIZ_QUESTIONS_PER_SESSION = int(os.getenv("QUIZ_QUESTIONS_PER_SESSION", "5"))
QUIZ_RECENT_QUESTION_WINDOW = int(os.getenv("QUIZ_RECENT_QUESTION_WINDOW", "30"))
# Ambang skor relevansi soal terhadap materi (0..1). Soal di bawah ambang tetap
# dipakai jika stok soal yang relevan tidak cukup.
QUIZ_MIN_RELEVANCE = float(os.getenv("QUIZ_MIN_RELEVANCE", "0.30"))
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "simple": {"format": "{levelname} {asctime} {name}: {message}", "style": "{"},
    },
    "handlers": {
        "console": {"class": "logging.StreamHandler", "formatter": "simple"},
    },
    "root": {"handlers": ["console"], "level": os.getenv("LOG_LEVEL", "INFO")},
}
