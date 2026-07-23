import uuid
from sqlalchemy import Column, String, Integer, DateTime, Text
from sqlalchemy.sql import func
from app.database import Base


def generate_uuid():
    return str(uuid.uuid4())


class Owner(Base):
    __tablename__ = "owners"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    email = Column(String, nullable=False)
    description = Column(Text, nullable=True)


class EventType(Base):
    __tablename__ = "event_types"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    duration_minutes = Column(Integer, nullable=False)


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(String, primary_key=True, default=generate_uuid)
    event_type_id = Column(String, nullable=False)
    event_type_name = Column(String(100), nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    guest_name = Column(String(100), nullable=False)
    guest_email = Column(String, nullable=False)
    guest_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
