from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import crud, schemas

router = APIRouter(prefix="/bookings", tags=["Bookings"])


@router.get("", response_model=list[schemas.Booking])
def list_bookings(db: Session = Depends(get_db)):
    return crud.get_bookings(db)


@router.post("", response_model=schemas.Booking, status_code=201)
def create_booking(
    booking: schemas.BookingCreate,
    db: Session = Depends(get_db),
):
    result, error = crud.create_booking(db, booking)
    if error == "event_type_not_found":
        raise HTTPException(status_code=404, detail="Тип события не найден")
    if error == "out_of_booking_window":
        raise HTTPException(status_code=422, detail="Слот вне окна бронирования (14 дней)")
    if error == "slot_occupied":
        raise HTTPException(status_code=409, detail="Слот уже занят")
    return result


@router.get("/{booking_id}", response_model=schemas.Booking)
def get_booking(booking_id: str, db: Session = Depends(get_db)):
    booking = crud.get_booking(db, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Бронирование не найдено")
    return booking


@router.delete("/{booking_id}", status_code=204)
def delete_booking(booking_id: str, db: Session = Depends(get_db)):
    booking = crud.delete_booking(db, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Бронирование не найдено")
    return None
