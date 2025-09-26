import os
import json

from config.connections import client
from fastapi import APIRouter, Form, Request, HTTPException
from fastapi.responses import Response
from models.modelMsg import MessageRequest
from queries.queryBot import manejar_mensaje_con_ia, process_ai_query
from queries.queryAppointments import appointment_agent
from services.conversational_service import conversational_service
from services.whatsapp_service import whatsapp_service
from twilio.twiml.messaging_response import MessagingResponse


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


@routerBotWhatsApp.post("/whatsapp/citas", response_class=Response)
def whatsapp_citas_webhook(
    request: Request,
    From: str = Form(...),  # Número del usuario
    Body: str = Form(None),   # Mensaje recibido (puede ser None para interactivos)
    ButtonResponse: str = Form(None),  # Respuesta de botón interactivo
    ListResponse: str = Form(None),    # Respuesta de lista interactiva
    MediaUrl0: str = Form(None)        # URL de media si hay archivo adjunto
):
    """Endpoint específico para el asistente de citas vía WhatsApp con conversación secuencial e interactiva"""
    phone_number = From.replace("whatsapp:", "")
    
    try:
        # Determinar el mensaje a procesar
        message_text = ""
        
        # Prioridad: ButtonResponse > ListResponse > Body
        if ButtonResponse:
            # El usuario presionó un botón
            message_text = whatsapp_service.handle_interactive_response(ButtonResponse, phone_number)
        elif ListResponse:
            # El usuario seleccionó de una lista
            list_data = json.loads(ListResponse) if ListResponse.startswith('{') else {"id": ListResponse}
            message_text = whatsapp_service.handle_interactive_response(list_data.get("id", ListResponse), phone_number)
        else:
            # Mensaje de texto normal
            message_text = Body.strip() if Body else ""
        
        if not message_text:
            # Si no hay mensaje, enviar menú principal
            menu_config = whatsapp_service.create_main_menu_buttons()
            response = MessagingResponse()
            message = response.message()
            message.body(menu_config["body"])
            return Response(content=str(response), media_type='application/xml')
        
        # Procesar mensaje con el servicio conversacional
        result = conversational_service.process_message(phone_number, message_text)
        
        # Crear respuesta según el estado y contenido
        response = MessagingResponse()
        message = response.message()
        
        # Determinar si usar mensaje interactivo o texto simple
        if result.suggested_actions and len(result.suggested_actions) <= 3:
            # Intentar enviar botones interactivos
            buttons = []
            for i, action in enumerate(result.suggested_actions):
                action_id = action.lower().replace(" ", "_").replace("📅", "").replace("👀", "").replace("❓", "").replace("✅", "confirm").replace("❌", "cancel").replace("✏️", "modify").strip()
                buttons.append({"id": action_id, "title": action})
            
            # Por ahora enviar como texto hasta configurar templates
            message.body(result.message + "\n\nOpciones rápidas:\n" + "\n".join([f"• {action}" for action in result.suggested_actions]))
        else:
            # Mensaje de texto normal
            message.body(result.message)
        
        # Agregar media si hay archivo adjunto en la respuesta
        if MediaUrl0:
            # El usuario envió un archivo, podrías procesarlo aquí
            pass
        
        return Response(content=str(response), media_type='application/xml')
        
    except Exception as e:
        # Respuesta de error
        response = MessagingResponse()
        message = response.message()
        message.body(f"❌ Lo siento, ocurrió un error al procesar tu solicitud. Por favor intenta nuevamente.\n\nError: {str(e)}")
        
        return Response(content=str(response), media_type='application/xml')


@routerBotWhatsApp.post("/whatsapp/citas-ai", response_class=Response)
def whatsapp_citas_ai_webhook(
    request: Request,
    From: str = Form(...),  # Número del usuario
    Body: str = Form(...)   # Mensaje recibido
):
    """Endpoint para el asistente de citas vía WhatsApp con IA (versión original)"""
    incoming_msg = Body.strip()
    phone_number = From.replace("whatsapp:", "")
    
    # Procesar el mensaje con el agente de citas
    try:
        result = appointment_agent.run_sync(incoming_msg)
        response_text = result.data
        
        # Crear respuesta de WhatsApp
        response = MessagingResponse()
        message = response.message()
        message.body(response_text)
        
        return Response(content=str(response), media_type='application/xml')
        
    except Exception as e:
        # Respuesta de error
        response = MessagingResponse()
        message = response.message()
        message.body(f"Lo siento, ocurrió un error al procesar tu solicitud. Por favor intenta nuevamente.")
        
        return Response(content=str(response), media_type='application/xml')


@routerBotWhatsApp.post("/test-ai")
def testAI(msg: str):
    message=  process_ai_query(msg)

    return message


@routerBotWhatsApp.post("/test-citas")
def test_appointment_ai(msg: str):
    """Endpoint de prueba para el asistente de citas (IA original)"""
    try:
        result = appointment_agent.run_sync(msg)
        return {
            "message": result.data,
            "success": True,
            "all_messages": [str(m) for m in result.all_messages()[-3:]]  # Últimos 3 mensajes para debug
        }
    except Exception as e:
        return {
            "error": str(e),
            "success": False
        }


@routerBotWhatsApp.post("/send-interactive")
def send_interactive_message(
    to: str,
    message_type: str,  # "buttons", "list", "text"
    content: dict
):
    """Endpoint para enviar mensajes interactivos por WhatsApp"""
    try:
        whatsapp_to = f"whatsapp:{to}" if not to.startswith("whatsapp:") else to
        
        if message_type == "buttons":
            result = whatsapp_service.send_interactive_buttons(
                to=whatsapp_to,
                body=content.get("body", ""),
                buttons=content.get("buttons", []),
                header=content.get("header")
            )
        elif message_type == "list":
            result = whatsapp_service.send_list_message(
                to=whatsapp_to,
                header=content.get("header", ""),
                body=content.get("body", ""),
                button_text=content.get("button_text", "Ver opciones"),
                sections=content.get("sections", [])
            )
        elif message_type == "text":
            result = whatsapp_service.send_text_message(
                to=whatsapp_to,
                message=content.get("message", "")
            )
        else:
            raise HTTPException(status_code=400, detail="Tipo de mensaje no soportado")
        
        return {"success": True, "result": result}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error enviando mensaje: {str(e)}")


@routerBotWhatsApp.get("/interactive-templates")
def get_interactive_templates():
    """Obtener templates predefinidos de mensajes interactivos"""
    return {
        "main_menu": whatsapp_service.create_main_menu_buttons(),
        "date_selection": whatsapp_service.create_date_selection_list(),
        "service_selection": whatsapp_service.create_service_selection_list(),
        "appointment_confirmation": whatsapp_service.create_appointment_confirmation_buttons("Ejemplo de resumen de cita")
    }


@routerBotWhatsApp.post("/test-conversational")
def test_conversational_assistant(phone: str, msg: str):
    """Endpoint de prueba para el asistente conversacional secuencial"""
    try:
        result = conversational_service.process_message(phone, msg)
        return {
            "message": result.message,
            "state": result.state,
            "requires_input": result.requires_input,
            "appointment_created": result.appointment_created,
            "appointment_id": result.appointment_id,
            "success": True,
            "suggested_actions": result.suggested_actions
        }
    except Exception as e:
        return {
            "error": str(e),
            "success": False
        }