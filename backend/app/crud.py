from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app import models, schemas


# ═══════════════════════════════════════════════════════════════
# OWNER
# ═══════════════════════════════════════════════════════════════

def get_owner(db: Session):
    return db.query(models.Owner).first()


def create_owner(db: Session, name: str, email: str, description: str = None):
    owner = models.Owner(name=name, email=email, description=description)
    db.add(owner)
    db.commit()
    db.refresh(owner)
    return owner


# ═══════════════════════════════════════════════════════════════
# EVENT TYPES
# ═══════════════════════════════════════════════════════════════

def get_event_types(db: Session):
    return db.query(models.EventType).all()


def get_event_type(db: Session, event_type_id: str):
    return db.query(models.EventType).filter(models.EventType.id == event_type_id).first()


def create_event_type(db: Session, event_type: schemas.EventTypeCreate):
    db_event_type = models.EventType(
        name=event_type.name,
        description=event_type.description,
        duration_minutes=event_type.duration_minutes,
    )
    db.add(db_event_type)
    db.commit()
    db.refresh(db_event_type)
    return db_event_type


def update_event_type(db: Session, event_type_id: str, event_type: schemas.EventTypeUpdate):
    db_event_type = get_event_type(db, event_type_id)
    if not db_event_type:
        return None
    update_data = event_type.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_event_type, field, value)
    db.commit()
    db.refresh(db_event_type)
    return db_event_type


def delete_event_type(db: Session, event_type_id: str):
    db_event_type = get_event_type(db, event_type_id)
    if db_event_type:
        db.delete(db_event_type)
        db.commit()
    return db_event_type


# ═══════════════════════════════════════════════════════════════
# SLOTS
# ═══════════════════════════════════════════════════════════════

def get_slots_for_date(db: Session, event_type_id: str, date: datetime.date):
    """Генерирует слоты для типа события на указанную дату.
    Слоты с 09:00 до 18:00 с шагом duration_minutes.
    """
    event_type = get_event_type(db, event_type_id)
    if not event_type:
        return None

    duration = event_type.duration_minutes
    slots = []

    # Генерируем слоты с 09:00 до 18:00
    start_hour, start_minute = 9, 0
    end_hour, end_minute = 18, 0

    current = datetime.combine(date, datetime.min.time().replace(hour=start_hour, minute=start_minute), tzinfo=timezone.utc)
    day_end = datetime.combine(date, datetime.min.time().replace(hour=end_hour, minute=end_minute), tzinfo=timezone.utc)

    # Получаем все бронирования на эту дату (любого типа события)
    day_start = datetime.combine(date, datetime.min.time(), tzinfo=timezone.utc)
    day_end_dt = datetime.combine(date, datetime.max.time().replace(microsecond=0), tzinfo=timezone.utc)

    existing_bookings = db.query(models.Booking).filter(
        and_(
            models.Booking.start_time >= day_start,
            models.Booking.start_time < day_end_dt,
        )
    ).all()

    now = datetime.now(timezone.utc)

    while current + timedelta(minutes=duration) <= day_end:
        slot_end = current + timedelta(minutes=duration)

        # Пропускаем слоты, которые уже закончились
        if slot_end <= now:
            current = slot_end
            continue

        # Проверяем, не пересекается ли слот с существующими бронированиями
        available = True
        for booking in existing_bookings:
            if current < booking.end_time and slot_end > booking.start_time:
                available = False
                break

        slots.append(schemas.Slot(
            date=date.isoformat(),
            start_time=current.strftime("%H:%M"),
            end_time=slot_end.strftime("%H:%M"),
            available=available,
        ))

        current = slot_end

    return slots


# ═══════════════════════════════════════════════════════════════
# BOOKINGS
# ═══════════════════════════════════════════════════════════════

def get_bookings(db: Session):
    return db.query(models.Booking).order_by(models.Booking.start_time).all()


def get_booking(db: Session, booking_id: str):
    return db.query(models.Booking).filter(models.Booking.id == booking_id).first()


def create_booking(db: Session, booking: schemas.BookingCreate):
    event_type = get_event_type(db, booking.event_type_id)
    if not event_type:
        return None, "event_type_not_found"

    # Проверяем, что время в пределах 14 дней
    now = datetime.now(timezone.utc)
    max_date = now + timedelta(days=14)
    if booking.start_time < now or booking.start_time > max_date:
        return None, "out_of_booking_window"

    # Вычисляем end_time
    end_time = booking.start_time + timedelta(minutes=event_type.duration_minutes)

    # Проверяем, не занят ли слот (любым типом события)
    existing = db.query(models.Booking).filter(
        and_(
            models.Booking.start_time < end_time,
            models.Booking.end_time > booking.start_time,
        )
    ).first()

    if existing:
        return None, "slot_occupied"

    db_booking = models.Booking(
        event_type_id=booking.event_type_id,
        event_type_name=event_type.name,
        start_time=booking.start_time,
        end_time=end_time,
        guest_name=booking.guest_name,
        guest_email=booking.guest_email,
        guest_notes=booking.guest_notes,
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking, None


def delete_booking(db: Session, booking_id: str):
    db_booking = get_booking(db, booking_id)
    if db_booking:
        db.delete(db_booking)
        db.commit()
    return db_booking
