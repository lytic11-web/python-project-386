from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, EmailStr, ConfigDict


def to_camel(s: str) -> str:
    parts = s.split("_")
    return parts[0] + "".join(p.capitalize() for p in parts[1:])


class ApiError(BaseModel):
    status: int
    code: str
    message: str


class Owner(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,
        alias_generator=to_camel,
        populate_by_name=True,
    )

    id: str
    name: str
    email: str
    description: Optional[str] = None


class EventTypeBase(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
    )

    name: str = Field(..., max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    duration_minutes: int = Field(..., ge=15, le=480, alias="durationMinutes")


class EventTypeCreate(EventTypeBase):
    pass


class EventTypeUpdate(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
    )

    name: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    duration_minutes: Optional[int] = Field(None, ge=15, le=480, alias="durationMinutes")


class EventType(EventTypeBase):
    model_config = ConfigDict(
        from_attributes=True,
        alias_generator=to_camel,
        populate_by_name=True,
    )

    id: str


class Slot(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
    )

    date: str  # YYYY-MM-DD
    start_time: str = Field(alias="startTime")  # HH:MM
    end_time: str = Field(alias="endTime")  # HH:MM
    available: bool


class BookingBase(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
    )

    event_type_id: str = Field(alias="eventTypeId")
    start_time: datetime = Field(alias="startTime")
    guest_name: str = Field(..., max_length=100, alias="guestName")
    guest_email: EmailStr = Field(alias="guestEmail")
    guest_notes: Optional[str] = Field(None, max_length=1000, alias="guestNotes")


class BookingCreate(BookingBase):
    pass


class Booking(BookingBase):
    model_config = ConfigDict(
        from_attributes=True,
        alias_generator=to_camel,
        populate_by_name=True,
    )

    id: str
    event_type_name: str = Field(alias="eventTypeName")
    end_time: datetime = Field(alias="endTime")
    created_at: datetime = Field(alias="createdAt")
