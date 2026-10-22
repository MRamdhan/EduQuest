"""Kesalahan domain yang tidak bergantung pada DRF."""


class DomainError(Exception):
    status_code = 400
    code = "domain_error"

    def __init__(self, message: str, *, code: str | None = None, status_code: int | None = None):
        super().__init__(message)
        if code:
            self.code = code
        if status_code:
            self.status_code = status_code


class NotFoundError(DomainError):
    status_code = 404
    code = "not_found"


class NoQuestionsAvailable(DomainError):
    status_code = 409
    code = "no_questions_available"


class QuizAlreadySubmitted(DomainError):
    status_code = 409
    code = "quiz_already_submitted"


class QuizNotInProgress(DomainError):
    status_code = 409
    code = "quiz_not_in_progress"


class InvalidAnswerPayload(DomainError):
    status_code = 400
    code = "invalid_answer_payload"


class QuestionAlreadyResolved(DomainError):
    status_code = 409
    code = "question_already_resolved"


class LevelLocked(DomainError):
    status_code = 403
    code = "level_locked"


class NoLivesAvailable(DomainError):
    status_code = 409
    code = "no_lives_available"


class ProviderUnavailable(DomainError):
    status_code = 503
    code = "ai_provider_unavailable"
