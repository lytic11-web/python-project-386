import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database import engine, Base
from app.routers import owner, event_types, slots, bookings

# Создаём таблицы
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Запись на звонок — API",
    version="1.0.0",
    description="API-контракт для сервиса бронирования времени",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутеры с префиксом /api
app.include_router(owner.router, prefix="/api")
app.include_router(event_types.router, prefix="/api")
app.include_router(slots.router, prefix="/api")
app.include_router(bookings.router, prefix="/api")


@app.get("/api")
def root():
    return {"message": "Запись на звонок API", "docs": "/docs"}


# Раздаём статику фронтенда (в проде — из папки static)
static_dir = os.path.join(os.path.dirname(__file__), "..", "static")
if os.path.isdir(static_dir):
    app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")
