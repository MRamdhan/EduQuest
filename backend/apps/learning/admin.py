from pathlib import Path
from urllib.parse import quote

from django import forms
from django.contrib import admin, messages
from django.core.exceptions import PermissionDenied
from django.http import HttpResponse, HttpResponseRedirect
from django.template.response import TemplateResponse
from django.urls import path, reverse
from django.utils.html import format_html
from django.utils.text import slugify

from apps.learning.management.commands.import_materials import parse_material_text
from apps.learning.models import (
    EducationLevel,
    Material,
    MaterialPrerequisite,
    Question,
    QuestionGeneration,
    QuestionReport,
    QuizAttempt,
    QuizQuestion,
    Subject,
)
from apps.learning.services.question_import import (
    CSV_COLUMNS,
    OPTION_KEYS,
    build_options,
    csv_template,
    import_questions_csv,
    new_source_id,
)
from eduquest_logic.question_selector import ALLOWED_STATUS

MAX_MATERIAL_UPLOAD_BYTES = 500_000


def quiz_question_count(material: Material) -> int:
    """Jumlah soal siap pakai yang akan muncul di kuis materi ini."""
    if not material.topic_code:
        return 0
    return Question.objects.filter(
        subject_id=material.subject_id,
        topic_code=material.topic_code,
        is_active=True,
        review_status__in=ALLOWED_STATUS,
    ).count()


class MaterialPrerequisiteInline(admin.TabularInline):
    model = MaterialPrerequisite
    fk_name = "material"
    extra = 0


@admin.register(EducationLevel)
class EducationLevelAdmin(admin.ModelAdmin):
    list_display = ["code", "name", "order"]
    ordering = ["order"]


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ["name", "level", "slug", "icon"]
    list_filter = ["level"]
    search_fields = ["name"]


class MaterialAdminForm(forms.ModelForm):
    """Form materi dengan opsi upload file Markdown.

    Jika file diunggah, judul, kelas, topik, kode topik, ringkasan, sumber, dan
    isi dibaca dari file (metadata yang sudah diisi manual tidak ditimpa, kecuali
    isi materi yang selalu mengikuti file).
    """

    markdown_file = forms.FileField(
        required=False,
        label="Upload file materi (.md)",
        help_text=(
            "Opsional. Format sama dengan folder content/materi: judul '# ...', "
            "baris **ID Topik:**, **Kelas:**, **Referensi:**, lalu '---' dan isi. "
            "Jika diisi, kolom Isi di bawah akan diganti isi file."
        ),
    )

    class Meta:
        model = Material
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Boleh kosong di form bila datang dari file; divalidasi di clean().
        for name in ("title", "slug", "content"):
            self.fields[name].required = False

    def clean(self):
        cleaned = super().clean()
        upload = cleaned.get("markdown_file")
        parsed: dict = {}

        if upload:
            if not upload.name.lower().endswith((".md", ".markdown", ".txt")):
                self.add_error("markdown_file", "File harus berekstensi .md, .markdown, atau .txt.")
            elif upload.size > MAX_MATERIAL_UPLOAD_BYTES:
                self.add_error("markdown_file", "File terlalu besar (maksimal 500 KB).")
            else:
                try:
                    text = upload.read().decode("utf-8-sig")
                except UnicodeDecodeError:
                    self.add_error("markdown_file", "File harus berkode UTF-8.")
                else:
                    parsed = parse_material_text(text, Path(upload.name).stem)

        if parsed:
            for key in ("title", "kelas", "topic", "topic_code", "summary", "source"):
                if not cleaned.get(key):
                    cleaned[key] = parsed[key]
            if cleaned.get("estimated_minutes") == 10:
                cleaned["estimated_minutes"] = parsed["estimated_minutes"]
            if not cleaned.get("order"):
                cleaned["order"] = parsed["order"]
            cleaned["content"] = parsed["content"]
            if not cleaned["content"]:
                self.add_error("markdown_file", "File tidak memiliki isi materi.")

        if not cleaned.get("title") and "title" not in self.errors:
            self.add_error("title", "Judul wajib diisi (atau unggah file yang memuat judul '# ...').")
        if not cleaned.get("content") and "content" not in self.errors and "markdown_file" not in self.errors:
            self.add_error("content", "Isi materi wajib diisi (atau unggah file).")

        if not cleaned.get("slug") and cleaned.get("title"):
            subject = cleaned.get("subject")
            prefix = f"{subject.level.code}-{subject.name}-" if subject else ""
            base = slugify(f"{prefix}{cleaned['title']}")[:200] or "materi"
            slug, n = base, 2
            while Material.objects.filter(slug=slug).exclude(pk=self.instance.pk).exists():
                slug = f"{base}-{n}"
                n += 1
            cleaned["slug"] = slug
        return cleaned


@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    form = MaterialAdminForm
    change_form_template = "admin/learning/material/change_form.html"
    list_display = [
        "title",
        "subject",
        "kelas",
        "topic_code",
        "quiz_questions",
        "status",
        "order",
        "updated_at",
    ]
    list_filter = ["status", "subject__level", "subject", "kelas"]
    search_fields = ["title", "topic", "topic_code", "content"]
    prepopulated_fields = {"slug": ("title",)}
    inlines = [MaterialPrerequisiteInline]
    actions = ["publish_materials", "draft_materials"]
    fieldsets = [
        ("Upload cepat", {"fields": ["markdown_file"]}),
        (
            "Informasi materi",
            {
                "fields": [
                    "subject",
                    "title",
                    "slug",
                    "kelas",
                    "topic",
                    "topic_code",
                    "status",
                    "order",
                    "estimated_minutes",
                ]
            },
        ),
        ("Isi", {"fields": ["summary", "content", "source"]}),
    ]

    @admin.display(description="Soal kuis")
    def quiz_questions(self, obj):
        if not obj.topic_code:
            return format_html(
                '<span style="color:#b45309">Kode topik kosong</span>'
            )
        count = quiz_question_count(obj)
        url = reverse("admin:learning_question_changelist") + f"?q={quote(obj.topic_code)}"
        return format_html('<a href="{}">{} soal</a>', url, count)

    def change_view(self, request, object_id, form_url="", extra_context=None):
        extra_context = extra_context or {}
        material = self.get_queryset(request).filter(pk=object_id).first()
        if material is not None:
            extra_context["quiz_question_count"] = quiz_question_count(material)
        return super().change_view(request, object_id, form_url, extra_context)

    @admin.action(description="Terbitkan materi terpilih")
    def publish_materials(self, request, queryset):
        count = queryset.update(status=Material.Status.PUBLISHED)
        self.message_user(request, f"{count} materi diterbitkan.", messages.SUCCESS)

    @admin.action(description="Jadikan draf (sembunyikan dari siswa)")
    def draft_materials(self, request, queryset):
        count = queryset.update(status=Material.Status.DRAFT)
        self.message_user(request, f"{count} materi dijadikan draf.", messages.SUCCESS)


@admin.register(MaterialPrerequisite)
class MaterialPrerequisiteAdmin(admin.ModelAdmin):
    list_display = ["material", "prerequisite"]


class QuestionAdminForm(forms.ModelForm):
    """Form soal dengan kolom opsi A-E (tanpa menulis JSON)."""

    from_material = forms.ModelChoiceField(
        queryset=Material.objects.all(),
        required=False,
        label="Ambil mapel, kelas, dan topik dari materi",
        help_text=(
            "Opsional. Mengisi mapel/kelas/topik/kode topik yang masih kosong. "
            "Kode topik yang sama dengan materi membuat soal muncul di kuis materi itu."
        ),
    )
    option_a = forms.CharField(label="Opsi A", widget=forms.Textarea(attrs={"rows": 2}), required=False)
    option_b = forms.CharField(label="Opsi B", widget=forms.Textarea(attrs={"rows": 2}), required=False)
    option_c = forms.CharField(label="Opsi C", widget=forms.Textarea(attrs={"rows": 2}), required=False)
    option_d = forms.CharField(label="Opsi D", widget=forms.Textarea(attrs={"rows": 2}), required=False)
    option_e = forms.CharField(label="Opsi E (opsional)", widget=forms.Textarea(attrs={"rows": 2}), required=False)
    correct = forms.ChoiceField(label="Kunci jawaban", choices=[(k, k) for k in OPTION_KEYS])

    class Meta:
        model = Question
        fields = [
            "subject",
            "kelas",
            "topic",
            "topic_code",
            "difficulty",
            "question_text",
            "explanation",
            "hint",
            "review_status",
            "is_active",
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["subject"].required = False
        if self.instance.pk:
            for option in self.instance.options or []:
                key = str(option.get("key", "")).strip().upper()
                if key in OPTION_KEYS:
                    self.initial[f"option_{key.lower()}"] = option.get("text", "")
            self.initial["correct"] = (self.instance.correct_option or "").strip().upper()
        else:
            # Soal buatan admin dianggap sudah ditinjau pembuatnya.
            self.fields["review_status"].initial = Question.ReviewStatus.REVIEWED

    def clean(self):
        cleaned = super().clean()
        material = cleaned.get("from_material")
        subject = cleaned.get("subject") or (material.subject if material else None)
        if subject is None:
            self.add_error("subject", "Pilih mapel, atau pilih materi di bagian atas.")
        else:
            cleaned["subject"] = subject
        if material:
            for name, value in (
                ("kelas", material.kelas),
                ("topic", material.topic),
                ("topic_code", material.topic_code),
            ):
                if not cleaned.get(name):
                    cleaned[name] = value

        options = build_options({k: cleaned.get(f"option_{k.lower()}") or "" for k in OPTION_KEYS})
        if len(options) < 2:
            self.add_error("option_b", "Isi minimal dua opsi.")
        correct = cleaned.get("correct")
        if correct and correct not in [o["key"] for o in options]:
            self.add_error("correct", f"Opsi {correct} masih kosong; pilih kunci dari opsi yang terisi.")

        if subject is not None:
            self.instance.level = subject.level
        self.instance.options = options
        self.instance.correct_option = correct or ""
        if not self.instance.source_id:
            self.instance.source_id = new_source_id()
        return cleaned


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    form = QuestionAdminForm
    change_list_template = "admin/learning/question/change_list.html"
    list_display = [
        "id",
        "short_text",
        "subject",
        "kelas",
        "topic_code",
        "difficulty",
        "review_status",
        "is_active",
    ]
    list_filter = ["review_status", "subject__level", "subject", "kelas", "difficulty", "is_active"]
    search_fields = ["question_text", "source_id", "topic", "topic_code", "hint"]
    readonly_fields = ["created_at", "updated_at"]
    actions = ["mark_reviewed", "mark_published", "mark_rejected"]
    fieldsets = [
        ("Konteks", {"fields": ["from_material", "subject", "kelas", "topic", "topic_code", "difficulty"]}),
        ("Soal", {"fields": ["question_text"]}),
        ("Opsi jawaban", {"fields": ["option_a", "option_b", "option_c", "option_d", "option_e", "correct"]}),
        ("Pembahasan", {"fields": ["explanation", "hint"]}),
        ("Status", {"fields": ["review_status", "is_active"]}),
    ]

    @admin.display(description="Soal")
    def short_text(self, obj):
        return obj.question_text[:80]

    def get_changeform_initial_data(self, request):
        """Prefill form saat admin menekan "Buat soal" dari halaman materi."""
        initial = super().get_changeform_initial_data(request)
        material_id = request.GET.get("material")
        if not material_id:
            return initial
        material = (
            Material.objects.select_related("subject")
            .filter(pk=material_id)
            .first()
        )
        if material is None:
            return initial
        initial.setdefault("from_material", material.pk)
        initial.setdefault("subject", material.subject_id)
        if material.kelas:
            initial.setdefault("kelas", material.kelas)
        if material.topic:
            initial.setdefault("topic", material.topic)
        if material.topic_code:
            initial.setdefault("topic_code", material.topic_code)
        return initial

    def save_model(self, request, obj, form, change):
        if not change:
            obj.source_dataset = "admin"
            if obj.difficulty:
                obj.difficulty_source = "admin"
        super().save_model(request, obj, form, change)

    def _set_status(self, request, queryset, status, label):
        count = queryset.update(review_status=status)
        self.message_user(request, f"{count} soal ditandai {label}.", messages.SUCCESS)

    @admin.action(description="Tandai ditinjau (reviewed)")
    def mark_reviewed(self, request, queryset):
        self._set_status(request, queryset, Question.ReviewStatus.REVIEWED, "ditinjau")

    @admin.action(description="Tandai terbit (published)")
    def mark_published(self, request, queryset):
        self._set_status(request, queryset, Question.ReviewStatus.PUBLISHED, "terbit")

    @admin.action(description="Tolak soal (tidak dipakai di kuis)")
    def mark_rejected(self, request, queryset):
        self._set_status(request, queryset, Question.ReviewStatus.REJECTED, "ditolak")

    def get_urls(self):
        custom = [
            path(
                "import-csv/",
                self.admin_site.admin_view(self.import_csv_view),
                name="learning_question_import_csv",
            ),
        ]
        return custom + super().get_urls()

    def import_csv_view(self, request):
        if not self.has_add_permission(request):
            raise PermissionDenied

        material_id = request.POST.get("material") or request.GET.get("material")
        material = (
            Material.objects.select_related("subject__level")
            .filter(pk=material_id)
            .first()
            if material_id
            else None
        )

        if request.GET.get("template"):
            response = HttpResponse(
                csv_template(material=material),
                content_type="text/csv; charset=utf-8",
            )
            filename = "template_soal.csv"
            if material is not None:
                filename = f"template_soal_materi_{material.pk}.csv"
            response["Content-Disposition"] = f'attachment; filename="{filename}"'
            return response

        status_choices = [
            (Question.ReviewStatus.REVIEWED, "Ditinjau - langsung muncul di kuis"),
            (Question.ReviewStatus.VALIDATED, "Tervalidasi - muncul di kuis"),
            (Question.ReviewStatus.IMPORTED, "Diimpor (draf) - belum muncul di kuis"),
        ]
        valid_status = {value for value, _ in status_choices}
        result = None
        if request.method == "POST":
            upload = request.FILES.get("csv_file")
            status = request.POST.get("review_status")
            if status not in valid_status:
                status = Question.ReviewStatus.REVIEWED
            if upload is None:
                messages.error(request, "Pilih file CSV terlebih dahulu.")
            else:
                result = import_questions_csv(
                    upload.read(),
                    default_status=status,
                    material=material,
                )
                if result.ok:
                    self.message_user(
                        request,
                        f"{result.created} soal berhasil diimpor.",
                        messages.SUCCESS,
                    )
                    changelist = reverse("admin:learning_question_changelist")
                    if material is not None and material.topic_code:
                        changelist += f"?q={quote(material.topic_code)}"
                    return HttpResponseRedirect(changelist)

        context = {
            **self.admin_site.each_context(request),
            "opts": self.model._meta,
            "title": "Impor soal dari CSV",
            "result": result,
            "columns": CSV_COLUMNS,
            "status_choices": status_choices,
            "material": material,
            "material_id": material.pk if material is not None else "",
        }
        return TemplateResponse(request, "admin/learning/question/import_csv.html", context)


@admin.register(QuestionReport)
class QuestionReportAdmin(admin.ModelAdmin):
    list_display = ["id", "question", "user", "reason", "status", "created_at"]
    list_filter = ["status", "reason"]
    search_fields = ["question__question_text", "note"]
    readonly_fields = ["created_at"]


@admin.register(QuestionGeneration)
class QuestionGenerationAdmin(admin.ModelAdmin):
    list_display = ["id", "material", "provider", "model_name", "status", "created_at"]
    list_filter = ["status", "provider"]
    readonly_fields = ["created_at"]


class QuizQuestionInline(admin.TabularInline):
    model = QuizQuestion
    extra = 0
    readonly_fields = [
        "question",
        "order",
        "difficulty",
        "selected_option",
        "is_correct",
        "is_resolved",
        "attempts",
        "hint_used",
        "hint_source",
        "answered_at",
    ]
    can_delete = False


@admin.register(QuizAttempt)
class QuizAttemptAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "user",
        "material",
        "status",
        "target_difficulty",
        "correct_count",
        "total_questions",
        "percent",
        "started_at",
    ]
    list_filter = ["status", "target_difficulty"]
    search_fields = ["user__username", "material__title"]
    readonly_fields = ["started_at", "submitted_at"]
    inlines = [QuizQuestionInline]
