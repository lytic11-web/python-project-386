from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import crud, schemas

router = APIRouter(prefix="/event-types", tags=["EventTypes"])


@router.get("", response_model=list[schemas.EventType])
def list_event_types(db: Session = Depends(get_db)):
    return crud.get_event_types(db)


@router.post("", response_model=schemas.EventType, status_code=201)
def create_event_type(
    event_type: schemas.EventTypeCreate,
    db: Session = Depends(get_db),
):
    return crud.create_event_type(db, event_type)


@router.get("/{event_type_id}", response_model=schemas.EventType)
def get_event_type(event_type_id: str, db: Session = Depends(get_db)):
    event_type = crud.get_event_type(db, event_type_id)
    if not event_type:
        raise HTTPException(status_code=404, detail="Тип события не найден")
    return event_type


@router.patch("/{event_type_id}", response_model=schemas.EventType)
def update_event_type(
    event_type_id: str,
    event_type: schemas.EventTypeUpdate,
    db: Session = Depends(get_db),
):
    updated = crud.update_event_type(db, event_type_id, event_type)
    if not updated:
        raise HTTPException(status_code=404, detail="Тип события не найден")
    return updated


@router.delete("/{event_type_id}", status_code=204)
def delete_event_type(event_type_id: str, db: Session = Depends(get_db)):
    deleted = crud.delete_event_type(db, event_type_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Тип события не найден")
    return None
