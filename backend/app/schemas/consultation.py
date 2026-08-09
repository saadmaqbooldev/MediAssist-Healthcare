from pydantic import BaseModel
from typing import List, Optional


class ConsultationCreate(BaseModel):
    patient_id: int
    symptoms: List[str]
    severity: str
    duration_days: int
    notes: Optional[str] = None


class ConsultationResponse(BaseModel):
    id: int
    patient_id: int
    symptoms: List[str]
    severity: str
    duration_days: int
    notes: Optional[str] = None

    class Config:
        from_attributes = True