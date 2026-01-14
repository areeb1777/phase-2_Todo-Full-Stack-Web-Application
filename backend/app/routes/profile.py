"""Profile routes for the Todo API"""

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import UserResponse
from app.auth import get_current_user
import uuid
import os
from typing import Optional
import base64
from io import BytesIO
from PIL import Image

router = APIRouter(prefix="/profile", tags=["profile"])

@router.get("/me", response_model=UserResponse)
def get_profile(current_user = Depends(get_current_user)):
    """Get current user's profile information"""
    return current_user

@router.put("/picture", response_model=UserResponse)
def upload_profile_picture(
    profile_picture: UploadFile = File(...),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload a profile picture for the current user"""

    # Validate file type
    allowed_types = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
    if profile_picture.content_type.lower() not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed."
        )

    # Read the file content
    image_content = profile_picture.file.read()

    # Limit file size (5MB)
    if len(image_content) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File too large. Maximum size is 5MB."
        )

    # Validate that it's a valid image
    try:
        img = Image.open(BytesIO(image_content))
        img.verify()  # Verify it's a valid image
        # Reset image to beginning to read again
        img = Image.open(BytesIO(image_content))
    except Exception as e:
        print(f"Image validation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image file."
        )

    # Convert image to base64 string for storage
    profile_picture_data = base64.b64encode(image_content).decode('utf-8')
    data_url = f"data:{profile_picture.content_type};base64,{profile_picture_data}"

    # Update user's profile picture in the database
    current_user.profile_picture = data_url
    db.commit()
    db.refresh(current_user)

    return current_user

@router.patch("/update", response_model=UserResponse)
def update_profile(
    email: Optional[str] = None,
    profile_picture: Optional[str] = None,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile information"""

    if email is not None:
        # Check if email is already taken by another user
        existing_user = db.query(User).filter(
            User.email == email,
            User.id != current_user.id
        ).first()

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered by another user"
            )

        current_user.email = email

    if profile_picture is not None:
        current_user.profile_picture = profile_picture

    db.commit()
    db.refresh(current_user)

    return current_user