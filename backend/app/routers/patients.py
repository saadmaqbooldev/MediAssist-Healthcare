from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.patient import Patient
from app.models.doctor import Doctor
from app.schemas.patient import (
    PatientCreate,
    PatientUpdate,
    PatientResponse
)
from app.utils.auth import get_current_doctor


router = APIRouter(
    prefix="/api/patients",
    tags=["Patients"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=PatientResponse)
def create_patient(
    patient: PatientCreate,
    db: Session = Depends(get_db),
    current_doctor: Doctor = Depends(get_current_doctor)
):
    new_patient = Patient(
        name=patient.name,
        age=patient.age,
        gender=patient.gender,
        phone=patient.phone,
        doctor_id=current_doctor.id
    )

    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)

    return new_patient


@router.get("/", response_model=list[PatientResponse])
def get_patients(
    db: Session = Depends(get_db),
    current_doctor: Doctor = Depends(get_current_doctor)
):
    patients = (
        db.query(Patient)
        .filter(Patient.doctor_id == current_doctor.id)
        .all()
    )

    return patients


@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_doctor: Doctor = Depends(get_current_doctor)
):
    patient = (
        db.query(Patient)
        .filter(
            Patient.id == patient_id,
            Patient.doctor_id == current_doctor.id
        )
        .first()
    )

    if patient is None:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    return patient


@router.put("/{patient_id}", response_model=PatientResponse)
def update_patient(
    patient_id: int,
    patient_data: PatientUpdate,
    db: Session = Depends(get_db),
    current_doctor: Doctor = Depends(get_current_doctor)
):
    patient = (
        db.query(Patient)
        .filter(
            Patient.id == patient_id,
            Patient.doctor_id == current_doctor.id
        )
        .first()
    )

    if patient is None:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    update_data = patient_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(patient, field, value)

    db.commit()
    db.refresh(patient)

    return patient


@router.delete("/{patient_id}")
def delete_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_doctor: Doctor = Depends(get_current_doctor)
):
    patient = (
        db.query(Patient)
        .filter(
            Patient.id == patient_id,
            Patient.doctor_id == current_doctor.id
        )
        .first()
    )

    if patient is None:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    db.delete(patient)
    db.commit()

    return {
        "message": "Patient deleted successfully"
    }