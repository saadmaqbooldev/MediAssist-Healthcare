from fastapi import FastAPI
from app.database import engine, Base
from app.models import doctor, patient, consultation
from app.routers import auth

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth.router)


@app.get("/")
def home():
    return {
        "message": "Hello, MediAssist Backend!"
    }