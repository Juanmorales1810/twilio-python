from datetime import datetime
from typing import Dict, Any
from pydantic import BaseModel


class MessageRequest(BaseModel):
    to: str
    message: str


class WhatsAppMessage(BaseModel):
    from_number: str
    body: str
    timestamp: datetime = None

    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = datetime.utcnow()


class BotResponse(BaseModel):
    response_text: str
    next_step: str
    user_data: Dict[str, Any] = {}
    should_save: bool = True
