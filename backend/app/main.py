from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.models import doctor, patient, consultation
from app.routers import auth, patients, consultations


# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI()


# CORS - Frontend localhost:5173 ko Backend access ki permission
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Routers
app.include_router(auth.router)
app.include_router(patients.router)
app.include_router(consultations.router)


@app.get("/")
def home():
    return {
        "message": "Hello, MediAssist Backend!"
    }