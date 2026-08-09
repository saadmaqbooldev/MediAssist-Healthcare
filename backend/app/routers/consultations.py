from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.consultation import Consultation
from app.models.patient import Patient
from app.schemas.consultation import (
    ConsultationCreate,
    ConsultationResponse,
)

router = APIRouter(
    prefix="/api/consultations",
    tags=["Consultations"]
)


COMMON_SYMPTOMS = [
    "Fever",
    "Headache",
    "Chest Pain",
    "Cough",
    "Cold",
    "Sore Throat",
    "Shortness of Breath",
    "Fatigue",
    "Nausea",
    "Vomiting",
    "Diarrhea",
    "Abdominal Pain",
    "Back Pain",
    "Dizziness",
    "Body Pain",
    "Joint Pain",
    "Loss of Appetite",
]


@router.get("/symptoms")
def get_symptoms():
    return COMMON_SYMPTOMS


@router.post(
    "/",
    response_model=ConsultationResponse
)
def create_consultation(
    consultation: ConsultationCreate,
    db: Session = Depends(get_db)
):
    patient = (
        db.query(Patient)
        .filter(Patient.id == consultation.patient_id)
        .first()
    )

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    new_consultation = Consultation(
        patient_id=consultation.patient_id,
        symptoms=consultation.symptoms,
        severity=consultation.severity,
        duration_days=consultation.duration_days,
        notes=consultation.notes,
    )

    db.add(new_consultation)
    db.commit()
    db.refresh(new_consultation)

    return new_consultation


@router.get(
    "/patient/{patient_id}",
    response_model=list[ConsultationResponse]
)
def get_patient_consultations(
    patient_id: int,
    db: Session = Depends(get_db)
):
    patient = (
        db.query(Patient)
        .filter(Patient.id == patient_id)
        .first()
    )

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    consultations = (
        db.query(Consultation)
        .filter(
            Consultation.patient_id == patient_id
        )
        .order_by(Consultation.id.desc())
        .all()
    )

    return consultations