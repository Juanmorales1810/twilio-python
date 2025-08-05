from pydantic import BaseModel

class MessageRequest(BaseModel):
    to: str
    message: str


class AppointmentStatusRequest(BaseModel):
    appointment_id: str
    status: str  # "confirmada", "cancelada"
