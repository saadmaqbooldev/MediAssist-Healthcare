from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.models import doctor, patient, consultation
from app.routers import auth, patients


Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS - Frontend (localhost:5173) ko Backend access karne ki permission
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(patients.router)


@app.get("/")
def home():
    return {
        "message": "Hello, MediAssist Backend!"
    }