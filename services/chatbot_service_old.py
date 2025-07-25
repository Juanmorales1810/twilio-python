import os
from datetime import datetime
from typing import Optional, Dict, Any
from pydantic_ai import Agent
from pydantic_ai.models.gemini import GeminiModel
from database.connection import DatabaseManager
from models.user import UserData, Appointment
from models.message import BotResponse
from services.toyota_service import ToyotaVehicleService
from utils.validators import validate_date, validate_time, validate_email


class ToyotaChatbotService:
    """Servicio principal del chatbot de Toyota San Juan"""
    
    def __init__(self):
        self.db = DatabaseManager()
        self.toyota_service = ToyotaVehicleService()
        
        # Configurar el agente de IA
        model = GeminiModel(os.getenv("GEMINI_MODEL", "gemini-pro"), api_key=os.getenv("GEMINI_API_KEY"))
        self.agent = Agent(
            model=model,
            system_prompt=self._get_system_prompt()
        )

    def _get_system_prompt(self) -> str:
        return """Eres un asistente virtual especializado para la agencia Toyota San Juan en Argentina. 

TU PERSONALIDAD:
- Conversacional y natural (evita respuestas muy estructuradas)
- Amable y profesional pero relajado
- Entusiasta sobre los vehículos Toyota
- Ayudas de forma proactiva

TUS OBJETIVOS:
1. Ayudar con información sobre vehículos Toyota
2. Guiar naturalmente hacia agendar citas
3. Responder preguntas sobre modelos, precios y características
4. Crear una experiencia conversacional fluida

INFORMACIÓN DE LA AGENCIA:
- Toyota San Juan, Argentina
- Teléfono: (787) 555-0123
- Email: contacto@toyota-sanjuan.com
- Horarios: Lun-Vie 9:00-18:00, Sáb 9:00-14:00
- Dirección: Av. Principal 123, San Juan, AR 00901

MODELOS DISPONIBLES:
- Corolla 2024: $23,000-$28,000 (sedán compacto, confiable, eficiente)
- Camry 2024: $26,000-$35,000 (sedán mediano, premium, espacioso)
- RAV4 2024: $29,000-$38,000 (SUV compacta, versátil, adventure-ready)
- Highlander 2024: $36,000-$48,000 (SUV familiar, 3 filas, espacioso)
- Prius 2024: $28,000-$33,000 (híbrido, eco-friendly, innovador)
- Tacoma 2024: $32,000-$45,000 (pickup, resistente, trabajo/aventura)

INSTRUCCIONES IMPORTANTES:
- Responde SIEMPRE en español
- Sé natural en la conversación, no uses listas numeradas a menos que sea necesario
- Si no sabes algo específico, ofrece conectar con un representante
- Cuando mencionen pruebas de manejo o citas, ayúdalos a agendar
- Si preguntan por otras marcas, redirige amablemente a Toyota
- Usa emojis moderadamente para ser más amigable
- Adapta tu respuesta al contexto de la conversación anterior"""

    def process_message(self, phone_number: str, message: str) -> str:
        """Procesa un mensaje del usuario y devuelve la respuesta"""
        
        # Guardar mensaje del usuario
        self.db.save_message(phone_number, message, "user")
        
        # Obtener o crear datos del usuario
        user_data = self.db.get_user_data(phone_number)
        if not user_data:
            user_data = UserData(phone_number=phone_number)
        
        # Obtener historial de conversación para contexto
        conversation_history = self.db.get_conversation_history(phone_number, limit=10)
        
        # Procesar según el paso actual
        response = self._handle_conversation_flow(user_data, message, conversation_history)
        
        # Guardar respuesta del bot
        self.db.save_message(phone_number, response.response_text, "bot")
        
        # Actualizar datos del usuario si es necesario
        if response.should_save:
            user_data.current_step = response.next_step
            user_data.conversation_data.update(response.user_data)
            self.db.save_user_data(user_data)
        
        return response.response_text

    def _handle_conversation_flow(self, user_data: UserData, message: str, conversation_history: list) -> BotResponse:
        """Maneja el flujo de conversación usando IA para respuestas más naturales"""
        
        current_step = user_data.current_step
        message_lower = message.lower().strip()
        
        # Preparar contexto para la IA
        context = self._prepare_ai_context(user_data, message, conversation_history)
        
        # Casos especiales donde necesitamos validación específica
        if current_step == "solicitar_email":
            return self._handle_email_input(user_data, message)
        elif current_step == "solicitar_fecha":
            return self._handle_date_input(user_data, message)
        elif current_step == "solicitar_hora":
            return self._handle_time_input(user_data, message)
        elif current_step == "confirmar_cita":
            return self._handle_appointment_confirmation(user_data, message)
        
        # Para el resto de casos, usar IA con contexto
        return self._generate_ai_response(user_data, message, context)

    def _prepare_ai_context(self, user_data: UserData, message: str, conversation_history: list) -> str:
        """Prepara el contexto para la IA"""
        
        context_parts = []
        
        # Estado actual del usuario
        if user_data.current_step:
            context_parts.append(f"Estado actual: {user_data.current_step}")
        
        # Datos del usuario recopilados
        if user_data.conversation_data:
            context_parts.append(f"Datos del usuario: {user_data.conversation_data}")
        
        # Historial reciente de conversación
        if conversation_history:
            context_parts.append("Conversación reciente:")
            for msg in conversation_history[-6:]:  # Últimos 6 mensajes
                role = "Usuario" if msg.sender == "user" else "Bot"
                context_parts.append(f"{role}: {msg.content}")
        
        # Mensaje actual
        context_parts.append(f"Mensaje actual del usuario: {message}")
        
        return "\n".join(context_parts)

    def _generate_ai_response(self, user_data: UserData, message: str, context: str) -> BotResponse:
        """Genera una respuesta usando IA con el contexto proporcionado"""
        
        try:
            # Crear prompt específico según la situación
            prompt = f"""
CONTEXTO DE LA CONVERSACIÓN:
{context}

INSTRUCCIONES ESPECÍFICAS:
- Si es el primer mensaje o saludo, da la bienvenida y pregunta cómo puedes ayudar de forma natural
- Si preguntan sobre vehículos, proporciona información específica y ofrece agendar prueba de manejo
- Si quieren agendar cita y no tienes su nombre, pregunta por él naturalmente
- Si tienes el nombre pero no email, pide el email
- Si tienes nombre y email pero no fecha, sugiere fechas disponibles
- Si tienes nombre, email y fecha pero no hora, sugiere horarios
- Si necesitas saber qué vehículo les interesa para la cita, pregúntalo
- Mantén la conversación fluida y natural

RESPONDE DE FORMA NATURAL Y CONVERSACIONAL AL ÚLTIMO MENSAJE DEL USUARIO.
"""
            
            # Generar respuesta con IA
            ai_response = self.agent.run_sync(prompt)
            response_text = str(ai_response.data)
            
            # Determinar el siguiente paso basado en el contenido y contexto
            next_step = self._determine_next_step(user_data, message, response_text)
            
            # Extraer datos del usuario si los menciona
            extracted_data = self._extract_user_data(message, user_data.current_step)
            
            return BotResponse(
                response_text=response_text,
                next_step=next_step,
                user_data=extracted_data,
                should_save=bool(extracted_data or next_step != user_data.current_step)
            )
            
        except Exception as e:
            # Fallback en caso de error con la IA
            return self._fallback_response(user_data, message)

    def _determine_next_step(self, user_data: UserData, message: str, ai_response: str) -> str:
        """Determina el siguiente paso en la conversación"""
        
        current_step = user_data.current_step
        message_lower = message.lower()
        response_lower = ai_response.lower()
        
        # Si el usuario quiere agendar y no tenemos nombre
        if any(word in message_lower for word in ["agendar", "cita", "prueba", "manejo"]) and not user_data.conversation_data.get("nombre"):
            return "solicitar_nombre"
        
        # Si tenemos nombre pero no email
        if user_data.conversation_data.get("nombre") and not user_data.conversation_data.get("email"):
            if "email" in response_lower or "correo" in response_lower:
                return "solicitar_email"
        
        # Si tenemos nombre y email pero no fecha
        if (user_data.conversation_data.get("nombre") and 
            user_data.conversation_data.get("email") and 
            not user_data.conversation_data.get("fecha")):
            if "fecha" in response_lower or "día" in response_lower:
                return "solicitar_fecha"
        
        # Si tenemos datos básicos pero no hora
        if (user_data.conversation_data.get("nombre") and 
            user_data.conversation_data.get("email") and 
            user_data.conversation_data.get("fecha") and 
            not user_data.conversation_data.get("hora")):
            if "hora" in response_lower or "horario" in response_lower:
                return "solicitar_hora"
        
        # Si estamos recopilando datos de cita
        if current_step in ["solicitar_nombre", "solicitar_email", "solicitar_fecha", "solicitar_hora"]:
            return current_step
        
        # Si preguntamos sobre vehículos
        if any(word in message_lower for word in ["vehiculo", "auto", "carro", "modelo", "corolla", "camry", "rav4"]):
            return "consulta_vehiculos"
        
        # Por defecto, conversación general
        return "conversacion_general"

    def _extract_user_data(self, message: str, current_step: str) -> Dict[str, Any]:
        """Extrae datos del usuario del mensaje"""
        
        extracted_data = {}
        
        # Si estamos pidiendo nombre y parece ser un nombre
        if current_step == "solicitar_nombre":
            name = message.strip()
            if len(name) > 2 and not any(char.isdigit() for char in name):
                extracted_data["nombre"] = name
        
        # Si mencionan un vehículo específico
        vehicles = ["corolla", "camry", "rav4", "highlander", "prius", "tacoma"]
        for vehicle in vehicles:
            if vehicle in message.lower():
                extracted_data["vehiculo_interes"] = vehicle.title()
                break
        
        return extracted_data

    def _fallback_response(self, user_data: UserData, message: str) -> BotResponse:
        """Respuesta de respaldo cuando falla la IA"""
        
        if not user_data.current_step or user_data.current_step == "inicio":
            response_text = "¡Hola! Soy tu asistente de Toyota San Juan. ¿En qué puedo ayudarte hoy? ¿Te interesa conocer nuestros vehículos o agendar una cita?"
            next_step = "conversacion_general"
        else:
            response_text = "Disculpa, podrías repetir eso? Estoy aquí para ayudarte con información sobre Toyota o agendar tu cita."
            next_step = user_data.current_step
        
        return BotResponse(
            response_text=response_text,
            next_step=next_step
        )

    # MÉTODOS ESPECÍFICOS QUE REQUIEREN VALIDACIÓN

    def _handle_email_input(self, user_data: UserData, message: str) -> BotResponse:
        """Maneja la entrada del email con validación"""
        
        email = message.strip()
        
        if not validate_email(email):
            response_text = "❌ El formato del correo no es válido. Por favor, ingresa un correo válido (ejemplo: usuario@dominio.com)"
            return BotResponse(
                response_text=response_text,
                next_step="solicitar_email"
            )
        
        # Usar IA para respuesta natural después de validar
        try:
            prompt = f"""
El usuario acaba de proporcionar su email: {email}
Ya tenemos su nombre: {user_data.conversation_data.get('nombre', 'N/A')}

Responde de forma natural confirmando el email y pidiendo la fecha preferida para la cita.
Sugiere fechas disponibles de forma conversacional.
"""
            ai_response = self.agent.run_sync(prompt)
            response_text = str(ai_response.data)
        except:
            # Fallback
            response_text = f"Perfecto! Ya tengo tu email: {email} 📅\n\n¿Qué fecha te gustaría para tu cita? Tengo disponibilidad de lunes a sábado."
        
        return BotResponse(
            response_text=response_text,
            next_step="solicitar_fecha",
            user_data={"email": email}
        )

    def _handle_date_input(self, user_data: UserData, message: str) -> BotResponse:
        """Maneja la entrada de fecha con validación"""
        
        date_str = message.strip()
        
        if not validate_date(date_str):
            response_text = "❌ Formato de fecha no válido. Por favor usa el formato DD/MM/YYYY (ejemplo: 25/12/2024)"
            return BotResponse(
                response_text=response_text,
                next_step="solicitar_fecha"
            )
        
        # Usar IA para respuesta natural después de validar
        try:
            prompt = f"""
El usuario eligió la fecha: {date_str}
Ya tenemos: nombre: {user_data.conversation_data.get('nombre')}, email: {user_data.conversation_data.get('email')}

Responde de forma natural confirmando la fecha y preguntando por el horario preferido.
Sugiere horarios disponibles (9:00 AM - 6:00 PM de lunes a viernes, 9:00 AM - 2:00 PM sábados).
"""
            ai_response = self.agent.run_sync(prompt)
            response_text = str(ai_response.data)
        except:
            # Fallback
            response_text = f"Excelente! La fecha {date_str} está disponible ⏰\n\n¿A qué hora prefieres? Tengo disponibilidad:\n• Lunes a Viernes: 9:00 AM - 6:00 PM\n• Sábados: 9:00 AM - 2:00 PM"
        
        return BotResponse(
            response_text=response_text,
            next_step="solicitar_hora",
            user_data={"fecha": date_str}
        )

    def _handle_time_input(self, user_data: UserData, message: str) -> BotResponse:
        """Maneja la entrada de hora con validación"""
        
        time_str = message.strip()
        message_lower = message.lower()
        
        # Verificar si quiere agendar (para casos donde viene de consulta de vehículos)
        if any(word in message_lower for word in ["agendar", "cita", "prueba", "manejo"]):
            return self._generate_ai_response(user_data, message, f"El usuario quiere agendar una cita. Datos actuales: {user_data.conversation_data}")
        
        if not validate_time(time_str):
            response_text = "❌ Formato de hora no válido. Por favor usa formato HH:MM (ejemplo: 14:30 o 2:30 PM)"
            return BotResponse(
                response_text=response_text,
                next_step="solicitar_hora"
            )
        
        # Si no hay vehículo de interés, preguntar
        if not user_data.conversation_data.get("vehiculo_interes") and not user_data.conversation_data.get("vehiculo_consultado"):
            try:
                prompt = f"""
El usuario eligió la hora: {time_str}
Tenemos todos los datos básicos de la cita pero necesitamos saber qué vehículo le interesa.

Responde de forma natural confirmando la hora y preguntando qué modelo Toyota le gustaría ver o probar.
Menciona nuestros modelos disponibles de forma conversacional.
"""
                ai_response = self.agent.run_sync(prompt)
                response_text = str(ai_response.data)
            except:
                response_text = f"Perfecto! La hora {time_str} funciona bien 🚗\n\n¿Qué modelo Toyota te interesa? Tenemos Corolla, Camry, RAV4, Highlander, Prius y Tacoma disponibles."
            
            return BotResponse(
                response_text=response_text,
                next_step="solicitar_vehiculo_interes",
                user_data={"hora": time_str}
            )
        
        # Si ya tenemos todo, proceder a confirmación
        vehicle = user_data.conversation_data.get("vehiculo_interes") or user_data.conversation_data.get("vehiculo_consultado")
        
        try:
            prompt = f"""
Tenemos todos los datos para la cita:
- Nombre: {user_data.conversation_data.get('nombre')}
- Email: {user_data.conversation_data.get('email')}
- Fecha: {user_data.conversation_data.get('fecha')}
- Hora: {time_str}
- Vehículo: {vehicle}

Crea un resumen natural de la cita y pide confirmación de forma amigable.
"""
            ai_response = self.agent.run_sync(prompt)
            response_text = str(ai_response.data)
        except:
            response_text = f"¡Perfecto! He agendado tu cita:\n\n� Fecha: {user_data.conversation_data.get('fecha')}\n⏰ Hora: {time_str}\n🚗 Vehículo: {vehicle}\n\n¿Confirmas estos datos?"
        
        return BotResponse(
            response_text=response_text,
            next_step="confirmar_cita",
            user_data={"hora": time_str}
        )

    def _handle_appointment_confirmation(self, user_data: UserData, message: str) -> BotResponse:
        """Maneja la confirmación de la cita"""
        
        message_lower = message.lower()
        
        if any(word in message_lower for word in ["si", "sí", "confirmo", "ok", "vale", "perfecto", "correcto"]):
            # Crear la cita
            appointment_data = {
                "name": user_data.conversation_data.get("nombre"),
                "email": user_data.conversation_data.get("email"),
                "date": user_data.conversation_data.get("fecha"),
                "time": user_data.conversation_data.get("hora"),
                "vehicle_interest": user_data.conversation_data.get("vehiculo_interes") or user_data.conversation_data.get("vehiculo_consultado"),
                "phone": user_data.phone_number
            }
            
            appointment = Appointment(**appointment_data)
            self.db.save_appointment(appointment)
            
            # Usar IA para mensaje de confirmación natural
            try:
                prompt = f"""
La cita ha sido confirmada exitosamente. Datos:
- Nombre: {appointment.name}
- Fecha: {appointment.date}
- Hora: {appointment.time}
- Vehículo: {appointment.vehicle_interest}

Crea un mensaje de confirmación natural y amigable. 
Incluye información de contacto de la agencia y agradece la preferencia.
Información de contacto: (787) 555-0123, Av. Principal 123, San Juan, PR
"""
                ai_response = self.agent.run_sync(prompt)
                response_text = str(ai_response.data)
            except:
                response_text = f"""✅ ¡Cita confirmada exitosamente!

📋 Resumen:
• Nombre: {appointment.name}
• Fecha: {appointment.date}
• Hora: {appointment.time}
• Vehículo: {appointment.vehicle_interest}

📍 Te esperamos en Toyota San Juan
Av. Principal 123, San Juan, PR
📞 (787) 555-0123

¡Gracias por elegir Toyota! 🚗"""
            
            # Reset user conversation
            self.db.reset_user_conversation(user_data.phone_number)
            
            return BotResponse(
                response_text=response_text,
                next_step="inicio",
                should_save=False
            )
        
        else:
            # Usar IA para manejar modificaciones
            try:
                prompt = f"""
El usuario no confirmó la cita o quiere hacer cambios.
Su mensaje: {message}
Datos actuales: {user_data.conversation_data}

Responde de forma natural preguntando qué le gustaría cambiar y cómo ayudarle.
"""
                ai_response = self.agent.run_sync(prompt)
                response_text = str(ai_response.data)
            except:
                response_text = "Entiendo que quieres hacer algún cambio. ¿Qué te gustaría modificar de la cita? Puedo ayudarte a ajustar la fecha, hora o cualquier otro detalle."
            
            return BotResponse(
                response_text=response_text,
                next_step="solicitar_fecha"  # Restart appointment process
            )
        
        if not validate_email(email):
            response_text = "❌ El formato del correo no es válido. Por favor, ingresa un correo válido (ejemplo: usuario@dominio.com):"
            return BotResponse(
                response_text=response_text,
                next_step="solicitar_email",
                should_save=False
            )
        
        response_text = """📅 ¿Para qué fecha te gustaría agendar la cita?

Por favor ingresa la fecha en formato DD/MM/AAAA
Ejemplo: 25/12/2024"""
        
        return BotResponse(
            response_text=response_text,
            next_step="solicitar_fecha",
            user_data={"email": email}
        )

    def _handle_date_input(self, user_data: UserData, message: str) -> BotResponse:
        """Maneja la entrada de la fecha"""
        
        date_str = message.strip()
        parsed_date = validate_date(date_str)
        
        if not parsed_date:
            response_text = """❌ Formato de fecha inválido. 

Por favor ingresa la fecha en formato DD/MM/AAAA
Ejemplo: 25/12/2024"""
            return BotResponse(
                response_text=response_text,
                next_step="solicitar_fecha",
                should_save=False
            )
        
        response_text = """🕒 ¿A qué hora prefieres la cita?

Horarios disponibles:
• 09:00 - 12:00 (Mañana)
• 14:00 - 17:00 (Tarde)

Por favor ingresa la hora en formato HH:MM
Ejemplo: 10:30"""
        
        return BotResponse(
            response_text=response_text,
            next_step="solicitar_hora",
            user_data={"fecha_preferida": parsed_date.isoformat()}
        )

    def _handle_time_input(self, user_data: UserData, message: str) -> BotResponse:
        """Maneja la entrada de la hora"""
        
        time_str = message.strip()
        parsed_time = validate_time(time_str)
        
        if not parsed_time:
            response_text = """❌ Formato de hora inválido.

Por favor ingresa la hora en formato HH:MM
Ejemplo: 10:30"""
            return BotResponse(
                response_text=response_text,
                next_step="solicitar_hora",
                should_save=False
            )
        
        conversation_data = user_data.conversation_data
        
        # Si el usuario ya consultó un vehículo específico, saltarse la pregunta
        if "vehiculo_consultado" in conversation_data:
            vehicle_interest = conversation_data.get("vehiculo_consultado")
            
            response_text = f"""📋 Resumen de tu cita:

� **Nombre:** {conversation_data.get('nombre')}
📧 **Email:** {conversation_data.get('email')}
📅 **Fecha:** {conversation_data.get('fecha_preferida', '').split('T')[0]}
🕒 **Hora:** {time_str}
🚗 **Interés:** {vehicle_interest} (previamente consultado)

¿Confirmas el agendamiento de tu cita? (Sí/No)"""
            
            return BotResponse(
                response_text=response_text,
                next_step="confirmar_cita",
                user_data={"hora_preferida": time_str, "vehiculo_interes": vehicle_interest}
            )
        else:
            response_text = """�🚗 ¿Hay algún modelo Toyota en particular que te interese?

• Corolla
• Camry  
• RAV4
• Highlander
• Prius
• Tacoma

O escribe "general" si quieres información general."""
            
            return BotResponse(
                response_text=response_text,
                next_step="solicitar_vehiculo_interes",
                user_data={"hora_preferida": time_str}
            )

    def _handle_vehicle_interest(self, user_data: UserData, message: str) -> BotResponse:
        """Maneja el vehículo de interés"""
        
        vehicle_interest = message.strip()
        conversation_data = user_data.conversation_data
        
        # Si el usuario ya consultó un vehículo específico, usarlo como sugerencia
        if "vehiculo_consultado" in conversation_data and vehicle_interest.lower() in ["si", "sí", "yes", "ok", "vale"]:
            vehicle_interest = conversation_data.get("vehiculo_consultado")
        
        # Mostrar resumen de la cita
        response_text = f"""📋 Resumen de tu cita:

👤 **Nombre:** {conversation_data.get('nombre')}
📧 **Email:** {conversation_data.get('email')}
📅 **Fecha:** {conversation_data.get('fecha_preferida', '').split('T')[0]}
🕒 **Hora:** {conversation_data.get('hora_preferida')}
🚗 **Interés:** {vehicle_interest}

¿Confirmas el agendamiento de tu cita? (Sí/No)"""
        
        return BotResponse(
            response_text=response_text,
            next_step="confirmar_cita",
            user_data={"vehiculo_interes": vehicle_interest}
        )

    def _handle_appointment_confirmation(self, user_data: UserData, message: str) -> BotResponse:
        """Maneja la confirmación de la cita"""
        
        message_lower = message.lower().strip()
        
        if any(word in message_lower for word in ["si", "sí", "confirmar", "confirmo", "ok", "vale"]):
            # Crear la cita
            conversation_data = user_data.conversation_data
            
            appointment = Appointment(
                phone_number=user_data.phone_number,
                customer_name=conversation_data.get('nombre'),
                customer_email=conversation_data.get('email'),
                preferred_date=datetime.fromisoformat(conversation_data.get('fecha_preferida')),
                preferred_time=conversation_data.get('hora_preferida'),
                vehicle_interest=conversation_data.get('vehiculo_interes'),
                status="pendiente"
            )
            
            # Guardar la cita
            saved_appointment = self.db.save_appointment(appointment)
            
            response_text = f"""✅ ¡Cita agendada exitosamente!

📋 **Detalles de tu cita:**
🆔 **ID:** {str(saved_appointment.id)[:8]}...
👤 **Nombre:** {appointment.customer_name}
📅 **Fecha:** {appointment.preferred_date.strftime('%d/%m/%Y')}
🕒 **Hora:** {appointment.preferred_time}

📍 **Ubicación:** Toyota San Juan - Av. Roosevelt 1234
📞 **Contacto:** (787) 555-0123

Te contactaremos 24 horas antes para confirmar.

¿Hay algo más en lo que pueda ayudarte?"""
            
            return BotResponse(
                response_text=response_text,
                next_step="inicio",
                user_data={}  # Limpiar datos de conversación
            )
        
        else:
            response_text = """❌ Cita cancelada.

¿Te gustaría:
1️⃣ Agendar para otra fecha
2️⃣ Ver información de vehículos
3️⃣ Volver al menú principal"""
            
            return BotResponse(
                response_text=response_text,
                next_step="menu_principal",
                user_data={}  # Limpiar datos de conversación
            )

    def _handle_general_query(self, user_data: UserData, message: str) -> BotResponse:
        """Maneja consultas generales usando IA"""
        
        try:
            # Usar el agente de IA para responder
            ai_response = self.agent.run_sync(
                f"Usuario pregunta: {message}\n\nContexto: El usuario está interactuando con un chatbot de Toyota San Juan."
            )
            
            response_text = ai_response.data + "\n\n¿Te gustaría agendar una cita o conocer más sobre nuestros vehículos?"
            
        except Exception as e:
            response_text = """Disculpa, no pude procesar tu consulta en este momento.

¿Te gustaría:
1️⃣ Ver información de vehículos Toyota
2️⃣ Agendar una cita
3️⃣ Hablar con un representante

O escribe "inicio" para volver al menú principal."""
        
        return BotResponse(
            response_text=response_text,
            next_step="menu_principal"
        )
