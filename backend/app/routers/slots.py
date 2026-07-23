from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import crud

router = APIRouter(tags=["Slots"])


@router.get("/event-types/{event_type_id}/slots")
def list_slots(
    event_type_id: str,
    date: str,  # YYYY-MM-DD
    db: Session = Depends(get_db),
):
    try:
        parsed_date = datetime.strptime(date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Неверный формат даты. Используйте YYYY-MM-DD")

    # Проверяем, что дата в пределах 14 дней
    from datetime import date as dt_date, timedelta
    today = dt_date.today()
    max_date = today + timedelta(days=14)
    if parsed_date < today or parsed_date > max_date:
        raise HTTPException(status_code=400, detail="Дата вне окна бронирования (14 дней)")

    slots = crud.get_slots_for_date(db, event_type_id, parsed_date)
    if slots is None:
        raise HTTPException(status_code=404, detail="Тип события не найден")
    return slots
