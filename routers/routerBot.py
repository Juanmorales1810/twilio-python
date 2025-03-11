import os

from dotenv import load_dotenv
from fastapi import APIRouter, Form, Request
from fastapi.responses import Response
from pydantic import BaseModel
from twilio.rest import Client

from querys.queryBot import handle_whatsapp_message, manejar_mensaje_con_ia

load_dotenv()


client = Client(os.getenv("TWILIO_ACCOUNT_SID"), os.getenv("TWILIO_AUTH_TOKEN"))

routerBotWhatsApp = APIRouter(prefix="/bot", tags=["bot"])

@routerBotWhatsApp.post("/whatsapp", response_class=Response)
def whatsapp_webhook(
    request: Request,
    From: str = Form(...),  # Número del usuario
    Body: str = Form(...)   # Mensaje recibido
):
    # Llama a la función handle_whatsapp_message para procesar el mensaje
    response_text = manejar_mensaje_con_ia(From, Body)
    #response_text = handle_whatsapp_message(From, Body)
    return Response(content=response_text, media_type='application/xml')

class MessageRequest(BaseModel):
    to: str
    message: str

@routerBotWhatsApp.post("/send-message")
async def send_custom_message(request: MessageRequest):
    try:
        message = client.messages.create(
            body=request.message,
            from_=f'whatsapp:{os.getenv("TWILIO_PHONE_NUMBER")}',
            to=f'whatsapp:{request.to}'
        )
        return {"status": "success", "sid": message.sid}
    except Exception as e:
        return {"status": "error", "message": str(e)}