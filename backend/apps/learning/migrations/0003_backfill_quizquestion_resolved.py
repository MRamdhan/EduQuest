from django.db import migrations


def backfill_resolved(apps, schema_editor):
    QuizQuestion = apps.get_model("learning", "QuizQuestion")
    QuizQuestion.objects.filter(is_correct__isnull=False).update(
        is_resolved=True,
        attempts=1,
    )


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    dependencies = [
        ("learning", "0002_question_hint_quizquestion_attempts_and_more"),
    ]

    operations = [
        migrations.RunPython(backfill_resolved, noop),
    ]
