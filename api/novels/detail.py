import json
from http import HTTPStatus

from backend.novels import NovelParseError, get_novel


def _json_response(payload, status=HTTPStatus.OK):
    return (
        json.dumps(payload, ensure_ascii=False),
        status,
        {"Content-Type": "application/json; charset=utf-8"},
    )


def handler(request):
    slug = request.args.get("slug") if hasattr(request, "args") else None

    if not slug:
        return _json_response({"error": "Missing required query parameter 'slug'."}, HTTPStatus.BAD_REQUEST)

    try:
        novel = get_novel(slug)
        return _json_response({"novel": novel})
    except (FileNotFoundError, NovelParseError) as exc:
        return _json_response({"error": str(exc)}, HTTPStatus.NOT_FOUND)
    except ValueError as exc:
        return _json_response({"error": str(exc)}, HTTPStatus.BAD_REQUEST)
    except Exception as exc:  # pragma: no cover - defensive
        return _json_response({"error": str(exc)}, HTTPStatus.INTERNAL_SERVER_ERROR)

