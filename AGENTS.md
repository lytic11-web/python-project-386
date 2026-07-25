# Commands
- **Backend**: `cd backend && uv run uvicorn app.main:app --host 0.0.0.0 --port 8000`
- **Frontend**: `cd frontend && npm run dev`
- **E2E tests**: `cd frontend && npm run test:e2e`
- **Lint (backend)**: `python -m py_compile backend/app/*.py`

# Conventional Commits
Все коммиты должны следовать спецификации Conventional Commits:
- `feat: ...` — новая функциональность
- `fix: ...` — исправление бага
- `chore: ...` — обслуживание (CI, зависимости, конфиги)
- `docs: ...` — документация
- `refactor: ...` — рефакторинг без изменения поведения
- `test: ...` — добавление или правка тестов
- `style: ...` — форматирование, стили

Формат: `<type>(<scope>): <описание>`
Примеры:
- `feat(api): add event type CRUD endpoints`
- `fix(backend): handle timezone-aware datetime comparison`
- `test(e2e): add booking flow playwright tests`
- `chore(ci): add release-please workflow`
