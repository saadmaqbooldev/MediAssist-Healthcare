from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.utils.auth import get_current_doctor

from app.database import SessionLocal
from app.models.doctor import Doctor
from app.schemas.doctor import DoctorCreate, DoctorLogin, DoctorResponse
from app.utils.auth import hash_password, verify_password, create_token


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/register")
def register(
    doctor: DoctorCreate,
    db: Session = Depends(get_db)
):

    existing = db.query(Doctor).filter(
        Doctor.email == doctor.email
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_doctor = Doctor(
        name=doctor.name,
        email=doctor.email,
        specialization=doctor.specialization,
        password=hash_password(doctor.password)
    )

    db.add(new_doctor)
    db.commit()
    db.refresh(new_doctor)

    return {
        "message": "Doctor registered successfully",
        "doctor_id": new_doctor.id
    }


@router.post("/login")
def login(
    doctor: DoctorLogin,
    db: Session = Depends(get_db)
):

    user = db.query(Doctor).filter(
        Doctor.email == doctor.email
    ).first()

    if not user or not verify_password(
        doctor.password,
        user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    token = create_token(
        {"doctor_id": user.id}
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }
@router.get("/me")
def get_me(
    current_doctor: Doctor = Depends(get_current_doctor)
):

    return {
        "id": current_doctor.id,
        "name": current_doctor.name,
        "email": current_doctor.email,
        "specialization": current_doctor.specialization
    }