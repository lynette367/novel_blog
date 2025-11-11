import json
from http import HTTPStatus

from backend.novels import list_novels


def _json_response(payload, status=HTTPStatus.OK):
    return (
        json.dumps(payload, ensure_ascii=False),
        status,
        {"Content-Type": "application/json; charset=utf-8"},
    )


def handler(request):
    try:
        novels = list_novels()
        return _json_response(
            {
                "count": len(novels),
                "novels": novels,
            }
        )
    except FileNotFoundError as exc:
        return _json_response({"error": str(exc)}, HTTPStatus.NOT_FOUND)
    except Exception as exc:  # pragma: no cover - defensive
        return _json_response({"error": str(exc)}, HTTPStatus.INTERNAL_SERVER_ERROR)

