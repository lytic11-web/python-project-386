from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import crud, schemas

router = APIRouter(prefix="/owner", tags=["Owner"])


@router.get("", response_model=schemas.Owner)
def get_owner(db: Session = Depends(get_db)):
    owner = crud.get_owner(db)
    if not owner:
        # Создаём дефолтного владельца при первом запросе
        owner = crud.create_owner(
            db,
            name="Администратор",
            email="admin@example.com",
            description="Владелец календаря",
        )
    return owner
