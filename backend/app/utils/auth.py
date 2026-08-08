import bcrypt
from datetime import datetime, timedelta

from jose import jwt, JWTError
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.doctor import Doctor


SECRET_KEY = "mysecretkey123"
ALGORITHM = "HS256"


# -------------------------
# Password Hashing
# -------------------------

def hash_password(password: str):
    password_bytes = password.encode("utf-8")

    hashed = bcrypt.hashpw(
        password_bytes,
        bcrypt.gensalt()
    )

    return hashed.decode("utf-8")


def verify_password(password: str, hashed_password: str):
    password_bytes = password.encode("utf-8")
    hashed_bytes = hashed_password.encode("utf-8")

    return bcrypt.checkpw(
        password_bytes,
        hashed_bytes
    )


# -------------------------
# JWT Token
# -------------------------

def create_token(data: dict):
    token_data = data.copy()

    expire = datetime.utcnow() + timedelta(hours=24)

    token_data.update({
        "exp": expire
    })

    return jwt.encode(
        token_data,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


# -------------------------
# Database Dependency
# -------------------------

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# -------------------------
# JWT Authentication
# -------------------------

bearer_scheme = HTTPBearer()


def get_current_doctor(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        doctor_id = payload.get("doctor_id")

        if doctor_id is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    doctor = (
        db.query(Doctor)
        .filter(Doctor.id == doctor_id)
        .first()
    )

    if doctor is None:
        raise HTTPException(
            status_code=404,
            detail="Doctor not found"
        )

    return doctor