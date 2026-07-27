from pydantic import BaseModel


class DoctorCreate(BaseModel):
    name: str
    email: str
    password: str
    specialization: str


class DoctorLogin(BaseModel):
    email: str
    password: str


class DoctorResponse(BaseModel):
    id: int
    name: str
    email: str
    specialization: str

    class Config:
        from_attributes = True