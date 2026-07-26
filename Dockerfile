# Stage 1: сборка фронтенда
FROM node:20-alpine AS frontend
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: бекенд + раздача статики
FROM python:3.11-slim
WORKDIR /app

COPY backend/pyproject.toml ./
RUN pip install --no-cache-dir -e .

COPY backend/app/ ./app/

COPY --from=frontend /app/dist ./static

EXPOSE 8000

CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
