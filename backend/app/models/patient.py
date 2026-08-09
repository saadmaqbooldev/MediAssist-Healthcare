from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base
from sqlalchemy.orm import relationship

class Patient(Base):
    __tablename__ = "patients"

    consultations = relationship(
    "Consultation",
    back_populates="patient",
    cascade="all, delete-orphan"
)

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    age = Column(Integer)
    gender = Column(String)
    phone = Column(String)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=False)