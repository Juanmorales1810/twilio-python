"""
Servicio para manejar diferentes tipos de mensajes de WhatsApp con Twilio
Incluye texto, imágenes, botones interactivos, listas y multimedia
"""

import os
import json
from typing import Dict, List, Optional, Any
from twilio.rest import Client
from twilio.twiml.messaging_response import MessagingResponse
from config.connections import client
from models.modelConversation import ConversationState

class WhatsAppMessageService:
    """Servicio para enviar diferentes tipos de mensajes por WhatsApp"""
    
    def __init__(self):
        self.twilio_client = client
        self.from_number = f"whatsapp:{os.getenv('TWILIO_PHONE_NUMBER', '+14155238886')}"
    
    def send_text_message(self, to: str, message: str) -> MessagingResponse:
        """Enviar mensaje de texto simple"""
        response = MessagingResponse()
        msg = response.message()
        msg.body(message)
        return response
    
    def send_interactive_buttons(self, to: str, body: str, buttons: List[Dict[str, str]], header: Optional[str] = None) -> Dict[str, Any]:
        """
        Enviar mensaje con botones interactivos
        
        Args:
            to: Número de destino (ej: "whatsapp:+56912345678")
            body: Texto principal del mensaje
            buttons: Lista de botones [{"id": "btn1", "title": "Opción 1"}, ...]
            header: Texto del header (opcional)
        """
        
        # Construir mensaje interactivo
        interactive_content = {
            "type": "button",
            "body": {"text": body}
        }
        
        if header:
            interactive_content["header"] = {"type": "text", "text": header}
        
        # Máximo 3 botones según WhatsApp API
        button_list = []
        for i, button in enumerate(buttons[:3]):
            button_list.append({
                "type": "reply",
                "reply": {
                    "id": button.get("id", f"btn_{i}"),
                    "title": button.get("title", f"Opción {i+1}")
                }
            })
        
        interactive_content["action"] = {"buttons": button_list}
        
        try:
            # Enviar usando la API de WhatsApp Business de Twilio
            message = self.twilio_client.messages.create(
                from_=self.from_number,
                to=to,
                body="",  # Vacío para mensajes interactivos
                # content_variables=json.dumps(interactive_content)  # Para templates
            )
            
            return {
                "success": True,
                "message_sid": message.sid,
                "interactive_content": interactive_content
            }
            
        except Exception as e:
            # Fallback a mensaje de texto con opciones numeradas
            fallback_text = f"{header}\n\n{body}\n\n"
            for i, button in enumerate(buttons, 1):
                fallback_text += f"{i}. {button['title']}\n"
            fallback_text += "\nResponde con el número de tu opción."
            
            return {
                "success": False,
                "error": str(e),
                "fallback": self.send_text_message(to, fallback_text)
            }
    
    def send_list_message(self, to: str, header: str, body: str, button_text: str, sections: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Enviar mensaje con lista interactiva
        
        Args:
            to: Número de destino
            header: Texto del header
            body: Texto del cuerpo
            button_text: Texto del botón para mostrar lista
            sections: Lista de secciones con opciones
        """
        
        interactive_content = {
            "type": "list",
            "header": {"type": "text", "text": header},
            "body": {"text": body},
            "action": {
                "button": button_text,
                "sections": sections
            }
        }
        
        try:
            # Enviar usando la API de WhatsApp Business
            message = self.twilio_client.messages.create(
                from_=self.from_number,
                to=to,
                body="",  # Vacío para mensajes interactivos
                # content_variables=json.dumps(interactive_content)  # Para templates
            )
            
            return {
                "success": True,
                "message_sid": message.sid,
                "interactive_content": interactive_content
            }
            
        except Exception as e:
            # Fallback a mensaje de texto con opciones numeradas
            fallback_text = f"{header}\n\n{body}\n\n"
            
            option_num = 1
            for section in sections:
                if section.get("title"):
                    fallback_text += f"**{section['title']}:**\n"
                
                for row in section.get("rows", []):
                    fallback_text += f"{option_num}. {row['title']}\n"
                    option_num += 1
                fallback_text += "\n"
            
            fallback_text += "Responde con el número de tu opción."
            
            return {
                "success": False,
                "error": str(e),
                "fallback": self.send_text_message(to, fallback_text)
            }
    
    def send_media_message(self, to: str, message: str, media_url: str, media_type: str = "image") -> MessagingResponse:
        """
        Enviar mensaje con multimedia (imagen, video, audio, documento)
        
        Args:
            to: Número de destino
            message: Texto del mensaje
            media_url: URL del archivo multimedia
            media_type: Tipo de media (image, video, audio, document)
        """
        response = MessagingResponse()
        msg = response.message()
        msg.body(message)
        msg.media(media_url)
        return response
    
    def create_appointment_confirmation_buttons(self, appointment_summary: str) -> Dict[str, Any]:
        """Crear botones de confirmación para citas"""
        buttons = [
            {"id": "confirm_yes", "title": "✅ Confirmar"},
            {"id": "confirm_no", "title": "❌ Cancelar"},
            {"id": "modify", "title": "✏️ Modificar"}
        ]
        
        return {
            "body": appointment_summary,
            "buttons": buttons,
            "header": "📋 Confirmar Cita"
        }
    
    def create_date_selection_list(self) -> Dict[str, Any]:
        """Crear lista de opciones de fecha"""
        sections = [
            {
                "title": "📅 Fechas Rápidas",
                "rows": [
                    {"id": "tomorrow_morning", "title": "🌅 Mañana - Mañana (9:00-12:00)"},
                    {"id": "tomorrow_afternoon", "title": "🌆 Mañana - Tarde (14:00-18:00)"},
                    {"id": "next_monday", "title": "📅 Lunes Próximo (9:00-18:00)"},
                    {"id": "next_week", "title": "📈 Próxima Semana"}
                ]
            },
            {
                "title": "⏰ Horarios Específicos",
                "rows": [
                    {"id": "custom_date", "title": "📝 Fecha Específica"},
                    {"id": "view_availability", "title": "👀 Ver Disponibilidad"}
                ]
            }
        ]
        
        return {
            "header": "📅 Selecciona Fecha y Hora",
            "body": "¿Cuándo te gustaría agendar tu cita?",
            "button_text": "Ver Opciones 📋",
            "sections": sections
        }
    
    def create_service_selection_list(self) -> Dict[str, Any]:
        """Crear lista de tipos de servicio"""
        sections = [
            {
                "title": "🏥 Servicios Médicos",
                "rows": [
                    {"id": "general_consultation", "title": "👩‍⚕️ Consulta General"},
                    {"id": "medical_checkup", "title": "🔍 Chequeo Médico"},
                    {"id": "follow_up", "title": "📋 Control/Seguimiento"},
                    {"id": "specialist", "title": "🩺 Consulta Especialista"}
                ]
            },
            {
                "title": "💼 Otros Servicios",
                "rows": [
                    {"id": "consultation", "title": "💬 Consulta/Asesoría"},
                    {"id": "procedure", "title": "⚕️ Procedimiento"},
                    {"id": "therapy", "title": "🧘‍♀️ Terapia"},
                    {"id": "other", "title": "📝 Otro (Especificar)"}
                ]
            }
        ]
        
        return {
            "header": "📋 Tipo de Cita",
            "body": "¿Qué tipo de servicio necesitas?",
            "button_text": "Seleccionar Servicio 🎯",
            "sections": sections
        }
    
    def create_main_menu_buttons(self) -> Dict[str, Any]:
        """Crear botones del menú principal"""
        buttons = [
            {"id": "new_appointment", "title": "📅 Nueva Cita"},
            {"id": "my_appointments", "title": "👀 Mis Citas"},
            {"id": "help", "title": "❓ Ayuda"}
        ]
        
        return {
            "header": "🏥 Asistente de Citas",
            "body": "👋 ¡Hola! Soy tu asistente virtual para gestionar citas médicas.\n\n¿En qué puedo ayudarte hoy?",
            "buttons": buttons
        }
    
    def handle_interactive_response(self, response_id: str, phone_number: str) -> str:
        """
        Manejar respuesta de elementos interactivos
        
        Args:
            response_id: ID de la respuesta seleccionada
            phone_number: Número de teléfono del usuario
            
        Returns:
            Mensaje de respuesta apropiado
        """
        
        # Mapear respuestas de botones principales
        main_responses = {
            "new_appointment": "Quiero una cita",
            "my_appointments": "Ver mis citas",
            "help": "Necesito ayuda"
        }
        
        # Mapear respuestas de confirmación
        confirmation_responses = {
            "confirm_yes": "sí",
            "confirm_no": "no",
            "modify": "cambiar"
        }
        
        # Mapear respuestas de fechas rápidas
        date_responses = {
            "tomorrow_morning": "mañana a las 10:00",
            "tomorrow_afternoon": "mañana a las 15:00",
            "next_monday": "el lunes a las 10:00",
            "next_week": "la próxima semana",
            "custom_date": "fecha específica",
            "view_availability": "ver disponibilidad"
        }
        
        # Mapear respuestas de servicios
        service_responses = {
            "general_consultation": "consulta general",
            "medical_checkup": "chequeo médico",
            "follow_up": "control",
            "specialist": "consulta especialista",
            "consultation": "consulta",
            "procedure": "procedimiento",
            "therapy": "terapia",
            "other": "otro servicio"
        }
        
        # Buscar en todos los mapeos
        all_responses = {**main_responses, **confirmation_responses, **date_responses, **service_responses}
        
        return all_responses.get(response_id, response_id)


# Instancia global del servicio
whatsapp_service = WhatsAppMessageService()