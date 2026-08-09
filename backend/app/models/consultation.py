from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship

from app.database import Base


class Consultation(Base):
    __tablename__ = "consultations"

    id = Column(Integer, primary_key=True, index=True)

    patient_id = Column(
        Integer,
        ForeignKey("patients.id"),
        nullable=False
    )

    symptoms = Column(JSON, nullable=False, default=list)

    severity = Column(
        String(50),
        nullable=False
    )

    duration_days = Column(
        Integer,
        nullable=False
    )

    notes = Column(
        Text,
        nullable=True
    )

    patient = relationship(
        "Patient",
        back_populates="consultations"
    )