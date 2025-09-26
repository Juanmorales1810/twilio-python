from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from bson import ObjectId

class User(BaseModel):
    """Modelo para representar un usuario en el sistema de citas"""
    id: Optional[str] = Field(default=None, alias="_id")
    phone_number: str = Field(..., description="Número de teléfono del usuario")
    name: str = Field(..., description="Nombre completo del usuario")
    email: Optional[str] = Field(default=None, description="Email del usuario (opcional)")
    created_at: datetime = Field(default_factory=datetime.now, description="Fecha de creación")
    is_active: bool = Field(default=True, description="Estado del usuario")

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

class UserCreate(BaseModel):
    """Modelo para crear un nuevo usuario"""
    phone_number: str = Field(..., description="Número de teléfono del usuario")
    name: str = Field(..., description="Nombre completo del usuario")
    email: Optional[str] = Field(default=None, description="Email del usuario (opcional)")

class UserUpdate(BaseModel):
    """Modelo para actualizar datos de un usuario"""
    name: Optional[str] = Field(default=None, description="Nuevo nombre del usuario")
    email: Optional[str] = Field(default=None, description="Nuevo email del usuario")
    is_active: Optional[bool] = Field(default=None, description="Nuevo estado del usuario")