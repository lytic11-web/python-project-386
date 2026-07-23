FROM python:3.11-slim

WORKDIR /app

# Копируем pyproject.toml и устанавливаем зависимости
COPY pyproject.toml ./
RUN pip install --no-cache-dir -e .

# Копируем код приложения
COPY app/ ./app/

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
