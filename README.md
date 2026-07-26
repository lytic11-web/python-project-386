### Hexlet tests and linter status:
[![Actions Status](https://github.com/lytic11-web/python-project-386/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/lytic11-web/python-project-386/actions)

# Booking Calendar

Сервис для записи на звонки/встречи. Администратор создаёт типы событий, гость выбирает слот и бронирует время.

## Технологии

- **Backend**: Python 3.12, FastAPI, SQLAlchemy, SQLite
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, TanStack Query
- **Тесты**: Playwright (e2e)

## Быстрый старт

```bash
# Backend
cd backend
pip install fastapi uvicorn[standard] sqlalchemy pydantic python-multipart email-validator
uvicorn app.main:app --host 0.0.0.0 --port 8000

# Frontend (в другом терминале)
cd frontend
npm install
npm run dev
```

Приложение будет доступно на `http://localhost:5173`.

## E2E тесты

```bash
cd frontend
npm run test:e2e
```

## API

Документация API — `http://localhost:8000/docs` (Swagger UI).

## Деплой

Приложение развёрнуто на Render: [https://python-project-386.onrender.com](https://python-project-386.onrender.com)

## CI

GitHub Actions: запуск e2e-тестов на каждый push в main.