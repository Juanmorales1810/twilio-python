from datetime import datetime
from typing import Optional
from enum import Enum
from pydantic import BaseModel, Field, validator
from bson import ObjectId

class AppointmentStatus(str, Enum):
    """Estados posibles de una cita"""
    PENDING = "pendiente"
    CONFIRMED = "confirmada"
    CANCELLED = "cancelada"
    COMPLETED = "completada"
    NO_SHOW = "no_asistio"

class Appointment(BaseModel):
    """Modelo para representar una cita en el sistema"""
    id: Optional[str] = Field(default=None, alias="_id")
    user_phone: str = Field(..., description="Número de teléfono del usuario que solicita la cita")
    user_name: str = Field(..., description="Nombre del usuario")
    date: datetime = Field(..., description="Fecha y hora de la cita")
    description: str = Field(..., description="Descripción o motivo de la cita")
    status: AppointmentStatus = Field(default=AppointmentStatus.PENDING, description="Estado de la cita")
    notes: Optional[str] = Field(default=None, description="Notas adicionales sobre la cita")
    created_at: datetime = Field(default_factory=datetime.now, description="Fecha de creación de la solicitud")
    updated_at: Optional[datetime] = Field(default=None, description="Fecha de última actualización")
    duration_minutes: int = Field(default=60, description="Duración estimada de la cita en minutos")

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

    @validator('date')
    def validate_future_date(cls, v):
        """Validar que la fecha de la cita sea en el futuro"""
        if v <= datetime.now():
            raise ValueError('La fecha de la cita debe ser en el futuro')
        return v

class AppointmentCreate(BaseModel):
    """Modelo para crear una nueva cita"""
    user_phone: str = Field(..., description="Número de teléfono del usuario")
    user_name: str = Field(..., description="Nombre del usuario")
    date: datetime = Field(..., description="Fecha y hora deseada para la cita")
    description: str = Field(..., description="Descripción o motivo de la cita")
    duration_minutes: int = Field(default=60, description="Duración estimada en minutos")
    
    @validator('date')
    def validate_future_date(cls, v):
        """Validar que la fecha de la cita sea en el futuro"""
        if v <= datetime.now():
            raise ValueError('La fecha de la cita debe ser en el futuro')
        return v

class AppointmentUpdate(BaseModel):
    """Modelo para actualizar una cita existente"""
    date: Optional[datetime] = Field(default=None, description="Nueva fecha y hora")
    description: Optional[str] = Field(default=None, description="Nueva descripción")
    status: Optional[AppointmentStatus] = Field(default=None, description="Nuevo estado")
    notes: Optional[str] = Field(default=None, description="Nuevas notas")
    duration_minutes: Optional[int] = Field(default=None, description="Nueva duración en minutos")

class AppointmentResponse(BaseModel):
    """Modelo para respuesta del agente sobre citas"""
    message: str = Field(..., description="Mensaje de respuesta al usuario")
    appointment_created: bool = Field(default=False, description="Si se creó una nueva cita")
    appointment_id: Optional[str] = Field(default=None, description="ID de la cita si aplica")
    next_steps: Optional[str] = Field(default=None, description="Próximos pasos sugeridos")