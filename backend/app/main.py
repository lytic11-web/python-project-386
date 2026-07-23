from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import owner, event_types, slots, bookings

# Создаём таблицы
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Запись на звонок — API",
    version="1.0.0",
    description="API-контракт для сервиса бронирования времени",
)

# CORS — разрешаем запросы с фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутеры
app.include_router(owner.router)
app.include_router(event_types.router)
app.include_router(slots.router)
app.include_router(bookings.router)


@app.get("/")
def root():
    return {"message": "Запись на звонок API", "docs": "/docs"}
