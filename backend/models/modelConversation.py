from datetime import datetime
from typing import Optional, Dict, Any, List
from enum import Enum
from pydantic import BaseModel, Field
from bson import ObjectId

class ConversationState(str, Enum):
    """Estados posibles de una conversación para agendar citas"""
    GREETING = "greeting"
    WAITING_NAME = "waiting_name"
    WAITING_DATE = "waiting_date"
    WAITING_DESCRIPTION = "waiting_description"
    CONFIRMING_APPOINTMENT = "confirming_appointment"
    COMPLETED = "completed"
    IDLE = "idle"

class ConversationContext(BaseModel):
    """Modelo para mantener el contexto de la conversación"""
    id: Optional[str] = Field(default=None, alias="_id")
    phone_number: str = Field(..., description="Número de teléfono del usuario")
    state: ConversationState = Field(default=ConversationState.GREETING, description="Estado actual de la conversación")
    user_name: Optional[str] = Field(default=None, description="Nombre del usuario recopilado")
    preferred_date: Optional[str] = Field(default=None, description="Fecha preferida en texto natural")
    parsed_date: Optional[str] = Field(default=None, description="Fecha parseada como string ISO")
    description: Optional[str] = Field(default=None, description="Descripción de la cita")
    duration_minutes: int = Field(default=60, description="Duración en minutos")
    last_message: Optional[str] = Field(default=None, description="Último mensaje del usuario")
    created_at: datetime = Field(default_factory=datetime.now, description="Fecha de creación del contexto")
    updated_at: datetime = Field(default_factory=datetime.now, description="Última actualización")
    temp_data: Dict[str, Any] = Field(default_factory=dict, description="Datos temporales adicionales")
    
    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

class ConversationResponse(BaseModel):
    """Modelo para las respuestas del asistente conversacional"""
    message: str = Field(..., description="Mensaje de respuesta")
    state: ConversationState = Field(..., description="Nuevo estado de la conversación")
    requires_input: bool = Field(default=True, description="Si requiere más input del usuario")
    appointment_created: bool = Field(default=False, description="Si se creó una cita")
    appointment_id: Optional[str] = Field(default=None, description="ID de la cita creada")
    suggested_actions: Optional[List[str]] = Field(default=None, description="Acciones sugeridas para botones interactivos")
    interactive_type: Optional[str] = Field(default=None, description="Tipo de interacción sugerida: buttons, list, text")
    media_url: Optional[str] = Field(default=None, description="URL de media para adjuntar")