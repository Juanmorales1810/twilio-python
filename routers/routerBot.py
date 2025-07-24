import os

from dotenv import load_dotenv
from fastapi import APIRouter, Form, Request
from fastapi.responses import Response
from pydantic import BaseModel
from twilio.rest import Client
from twilio.twiml.messaging_response import MessagingResponse

from services.chatbot_service import ToyotaChatbotService

load_dotenv()


client = Client(os.getenv("TWILIO_ACCOUNT_SID"), os.getenv("TWILIO_AUTH_TOKEN"))
chatbot_service = ToyotaChatbotService()

routerBotWhatsApp = APIRouter(prefix="/bot", tags=["bot"])

@routerBotWhatsApp.post("/whatsapp", response_class=Response)
def whatsapp_webhook(
    request: Request,
    From: str = Form(...),  # Número del usuario
    Body: str = Form(...)   # Mensaje recibido
):
    try:
        # Extraer solo el número de teléfono (remover "whatsapp:")
        phone_number = From.replace("whatsapp:", "")
        
        # Procesar mensaje con el servicio del chatbot
        response_text = chatbot_service.process_message(phone_number, Body)
        
        # Crear respuesta TwiML
        response = MessagingResponse()
        message = response.message()
        message.body(response_text)
        
        return Response(content=str(response), media_type='application/xml')
        
    except Exception as e:
        # Respuesta de error genérica
        response = MessagingResponse()
        message = response.message()
        message.body("Disculpa, ocurrió un error. Por favor intenta de nuevo más tarde.")
        
        return Response(content=str(response), media_type='application/xml')

class MessageRequest(BaseModel):
    to: str
    message: str


class AppointmentStatusRequest(BaseModel):
    appointment_id: str
    status: str  # "confirmada", "cancelada"


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


@routerBotWhatsApp.get("/appointments/{phone_number}")
async def get_user_appointments(phone_number: str):
    """Obtiene las citas de un usuario"""
    try:
        appointments = chatbot_service.db.get_user_appointments(phone_number)
        return {
            "status": "success", 
            "appointments": [
                {
                    "id": str(app.id),
                    "customer_name": app.customer_name,
                    "date": app.preferred_date.isoformat(),
                    "time": app.preferred_time,
                    "vehicle_interest": app.vehicle_interest,
                    "status": app.status
                }
                for app in appointments
            ]
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}


@routerBotWhatsApp.put("/appointments/status")
async def update_appointment_status(request: AppointmentStatusRequest):
    """Actualiza el estado de una cita"""
    try:
        success = chatbot_service.db.update_appointment_status(
            request.appointment_id, 
            request.status
        )
        
        if success:
            return {"status": "success", "message": "Estado actualizado correctamente"}
        else:
            return {"status": "error", "message": "No se pudo actualizar la cita"}
            
    except Exception as e:
        return {"status": "error", "message": str(e)}


@routerBotWhatsApp.delete("/conversation/{phone_number}")
async def reset_user_conversation(phone_number: str):
    """Resetea la conversación de un usuario"""
    try:
        chatbot_service.db.reset_user_conversation(phone_number)
        return {"status": "success", "message": "Conversación reseteada"}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@routerBotWhatsApp.post("/cleanup")
async def cleanup_expired_data():
    """Limpia datos expirados de la base de datos"""
    try:
        chatbot_service.db.cleanup_expired_data()
        return {"status": "success", "message": "Datos expirados eliminados"}
    except Exception as e:
        return {"status": "error", "message": str(e)}