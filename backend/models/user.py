from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field, field_validator
from bson import ObjectId


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, handler=None):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, _field_schema: Dict[str, Any]) -> Dict[str, Any]:
        return {"type": "string", "format": "objectid"}


class UserData(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    phone_number: str
    name: Optional[str] = None
    email: Optional[str] = None
    current_step: str = "inicio"
    conversation_data: dict = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class ConversationMessage(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    phone_number: str
    message: str
    sender: str  # "user" o "bot"
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    expires_at: Optional[datetime] = None

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class Appointment(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    phone_number: str
    customer_name: str
    customer_email: Optional[str] = None
    additional_contact: Optional[str] = None
    preferred_date: datetime
    preferred_time: str
    vehicle_interest: Optional[str] = None
    budget_range: Optional[str] = None
    comments: Optional[str] = None
    status: str = "pendiente"  # pendiente, confirmada, cancelada
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


class VehicleInfo(BaseModel):
    model: str
    year: int
    price_range: str
    description: str
    image_url: Optional[str] = None
    features: List[str] = Field(default_factory=list)
