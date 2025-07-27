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
    """Servicio principal del chatbot de Toyota San Juan con IA natural"""
    
    def __init__(self):
        self.db = DatabaseManager()
        self.toyota_service = ToyotaVehicleService()
        
        # Configurar el agente de IA
        model = GeminiModel(os.getenv("GEMINI_MODEL", "gemini-1.5-flash"), api_key=os.getenv("GEMINI_API_KEY"))
        self.agent = Agent(
            model=model,
            system_prompt=self._get_system_prompt()
        )

    def _get_system_prompt(self) -> str:
        from datetime import datetime
        today = datetime.now()
        current_date = today.strftime("%A, %d de %B de %Y")  # Ejemplo: "Jueves, 24 de julio de 2025"
        current_weekday = today.strftime("%A")  # Día de la semana actual

        return f"""Eres un asistente virtual especializado para la agencia Señor Gonzalez.

FECHA ACTUAL: {current_date}
DÍA DE LA SEMANA: {current_weekday}

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

MANEJO DE FECHAS:
- Cuando el usuario mencione fechas como "el lunes que viene", "la próxima semana", etc.
- Calcula la fecha exacta basándote en la fecha actual: {current_date}
- Responde con la fecha específica para confirmar (ej: "¿Te refieres al lunes 28 de julio?")
- Si es ambiguo, pregunta para aclarar

INFORMACIÓN DE LA AGENCIA:
- Señor Gonzalez, Argentina
- Teléfono: (787) 555-0123
- Email: contacto@señorgonzalez.com
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
- Adapta tu respuesta al contexto de la conversación anterior
- SIEMPRE confirma fechas específicas cuando el usuario use lenguaje natural"""

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
        if response.should_save or response.user_data:
            user_data.current_step = response.next_step
            if response.user_data:
                user_data.conversation_data.update(response.user_data)
                
                # También actualizar campos principales si están en conversation_data
                if "nombre" in user_data.conversation_data:
                    user_data.name = user_data.conversation_data["nombre"]
                if "email" in user_data.conversation_data:
                    user_data.email = user_data.conversation_data["email"]
                    
            # Guardar SIEMPRE que haya nuevos datos o cambio de paso
            self.db.save_user_data(user_data)
            
            # Verificar si tenemos todos los datos para crear una cita automáticamente
            self._check_and_create_appointment_if_ready(user_data)
        
        return response.response_text

    def _handle_conversation_flow(self, user_data: UserData, message: str, conversation_history: list) -> BotResponse:
        """Maneja el flujo de conversación usando IA para respuestas más naturales"""
        
        current_step = user_data.current_step
        message_lower = message.lower().strip()
        
        # Preparar contexto para la IA
        context = self._prepare_ai_context(user_data, message, conversation_history)
        
        # Si el usuario quiere continuar/agendar y ya tenemos algunos datos guardados
        if (any(word in message.lower() for word in ["continuar", "cita", "agendar", "confirmar"]) and 
            user_data.conversation_data and 
            current_step not in ["solicitar_email", "solicitar_fecha", "solicitar_hora", "solicitar_vehiculo_interes", "confirmar_cita"]):
            return self._handle_continuation_with_saved_data(user_data, message)
        
        # Casos especiales donde necesitamos validación específica
        if current_step == "solicitar_email":
            return self._handle_email_input(user_data, message)
        elif current_step == "solicitar_fecha":
            return self._handle_date_input(user_data, message)
        elif current_step == "solicitar_hora":
            return self._handle_time_input(user_data, message)
        elif current_step == "solicitar_vehiculo_interes":
            return self._handle_vehicle_interest(user_data, message)
        elif current_step == "confirmar_cita":
            return self._handle_appointment_confirmation(user_data, message)
        
        # Para el resto de casos, usar IA con contexto
        return self._generate_ai_response(user_data, message, context)
    
    def _handle_continuation_with_saved_data(self, user_data: UserData, message: str) -> BotResponse:
        """Maneja cuando el usuario continúa una conversación con datos ya guardados"""
        
        saved_data = user_data.conversation_data
        
        # Determinar qué datos faltan
        missing_data = []
        if not saved_data.get("nombre"):
            missing_data.append("nombre")
        if not saved_data.get("email"):
            missing_data.append("email")
        if not saved_data.get("fecha"):
            missing_data.append("fecha")
        if not saved_data.get("hora"):
            missing_data.append("hora")
        if not saved_data.get("vehiculo_interes"):
            missing_data.append("vehículo de interés")
        
        if missing_data:
            # Pedir el siguiente dato faltante
            next_field = missing_data[0]
            
            if next_field == "nombre":
                response_text = "¡Hola! Para continuar con tu cita, ¿podrías decirme tu nombre completo?"
                next_step = "solicitar_nombre"
            elif next_field == "email":
                response_text = f"Hola {saved_data.get('nombre', '')}! Para continuar, necesito tu correo electrónico."
                next_step = "solicitar_email"
            elif next_field == "fecha":
                response_text = f"Hola {saved_data.get('nombre', '')}! ¿Qué fecha te gustaría para la cita?"
                next_step = "solicitar_fecha"
            elif next_field == "hora":
                response_text = f"¿A qué hora prefieres tu cita el {saved_data.get('fecha', '')}?"
                next_step = "solicitar_hora"
            elif next_field == "vehículo de interés":
                response_text = "¿Qué modelo Toyota te interesa? (Corolla, Camry, RAV4, etc.)"
                next_step = "solicitar_vehiculo_interes"
        else:
            # Tenemos todos los datos, mostrar resumen y pedir confirmación
            summary = self._show_appointment_summary(user_data)
            response_text = f"¡Perfecto! Tengo todos tus datos:\n\n{summary}\n¿Confirmas esta cita?"
            next_step = "confirmar_cita"
        
        return BotResponse(
            response_text=response_text,
            next_step=next_step,
            should_save=True
        )

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
                context_parts.append(f"{role}: {msg.message}")  # Cambiar content por message
        
        # Mensaje actual
        context_parts.append(f"Mensaje actual del usuario: {message}")
        
        return "\n".join(context_parts)

    def _generate_ai_response(self, user_data: UserData, message: str, context: str) -> BotResponse:
        """Genera una respuesta usando IA con el contexto proporcionado"""
        
        try:
            # Detectar si el usuario pregunta sobre vehículos específicos
            vehicle_keywords = ["prius", "corolla", "camry", "rav4", "highlander", "tacoma"]
            mentioned_vehicle = None
            vehicle_info_text = ""
            
            for keyword in vehicle_keywords:
                if keyword in message.lower():
                    mentioned_vehicle = keyword
                    vehicle_info = self.get_vehicle_info_from_db(keyword)
                    vehicle_info_text = f"""
INFORMACIÓN ESPECÍFICA DEL {vehicle_info['name'].upper()}:
- Precio: {vehicle_info['price']}
- Descripción: {vehicle_info['description']}
- Características: {', '.join(vehicle_info['features']) if vehicle_info['features'] else 'Consultar características específicas'}
"""
                    break
            
            # Crear prompt específico según la situación
            prompt = f"""
CONTEXTO DE LA CONVERSACIÓN:
{context}

{vehicle_info_text}

INSTRUCCIONES ESPECÍFICAS:
- Si es el primer mensaje o saludo, da la bienvenida y pregunta cómo puedes ayudar de forma natural
- Si preguntan sobre vehículos, proporciona información específica y ofrece agendar prueba de manejo
- Si quieren agendar cita y no tienes su nombre, pregunta por él naturalmente
- Si tienes el nombre pero no email, pide el email
- Si tienes nombre y email pero no fecha, sugiere fechas disponibles
- Si tienes nombre, email y fecha pero no hora, sugiere horarios
- Si necesitas saber qué vehículo les interesa para la cita, pregúntalo
- Mantén la conversación fluida y natural
- Si mencionan un vehículo específico, usa la información proporcionada arriba

RESPONDE DE FORMA NATURAL Y CONVERSACIONAL AL ÚLTIMO MENSAJE DEL USUARIO.
"""
            
            # Generar respuesta con IA
            ai_response = self.agent.run_sync(prompt)
            response_text = str(ai_response.data)
            
            # Determinar el siguiente paso basado en el contenido y contexto
            next_step = self._determine_next_step(user_data, message, response_text)
            
            # Extraer datos del usuario si los menciona
            extracted_data = self._extract_user_data(message, user_data.current_step)
            
            # Si se mencionó un vehículo específico, agregarlo a los datos extraídos
            if mentioned_vehicle:
                extracted_data["vehiculo_interes"] = mentioned_vehicle.capitalize()
            
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
        
        # Si estamos en pasos específicos de validación, mantener el flujo secuencial
        if current_step == "solicitar_email":
            return "solicitar_fecha"  # Después del email, ir a fecha
        elif current_step == "solicitar_fecha":
            return "solicitar_hora"   # Después de fecha, ir a hora
        elif current_step == "solicitar_hora":
            return "confirmar_cita"   # Después de hora, confirmar
        elif current_step == "solicitar_vehiculo_interes":
            return "confirmar_cita"   # Después de vehículo, confirmar
        
        # Si el usuario quiere agendar explícitamente
        wants_appointment = any(word in message_lower for word in ["agendar", "cita", "prueba", "manejo", "coordinar", "reservar"])
        
        # Solo iniciar flujo de cita si hay intención explícita de agendar
        if wants_appointment:
            # Si no tenemos nombre, solicitarlo
            if not user_data.conversation_data.get("nombre"):
                return "solicitar_nombre"
            
            # Si tenemos nombre pero no email
            if user_data.conversation_data.get("nombre") and not user_data.conversation_data.get("email"):
                return "solicitar_email"
            
            # Si tenemos nombre y email pero no fecha
            if (user_data.conversation_data.get("nombre") and 
                user_data.conversation_data.get("email") and 
                not user_data.conversation_data.get("fecha")):
                return "solicitar_fecha"
            
            # Si tenemos datos básicos pero no hora
            if (user_data.conversation_data.get("nombre") and 
                user_data.conversation_data.get("email") and 
                user_data.conversation_data.get("fecha") and 
                not user_data.conversation_data.get("hora")):
                return "solicitar_hora"
        
        # Si preguntamos sobre vehículos
        if any(word in message_lower for word in ["vehiculo", "auto", "carro", "modelo", "corolla", "camry", "rav4"]):
            return "consulta_vehiculos"
        
        # Por defecto, conversación general
        return "conversacion_general"

    def _extract_user_data(self, message: str, current_step: str) -> Dict[str, Any]:
        """Extrae datos del usuario del mensaje"""
        
        extracted_data = {}
        message_lower = message.lower()
        
        # Extraer email si está presente en el mensaje
        import re
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        email_match = re.search(email_pattern, message)
        if email_match:
            extracted_data["email"] = email_match.group()
        
        # Extraer nombre solo en contextos específicos
        if current_step == "solicitar_nombre" or any(phrase in message_lower for phrase in ["soy ", "me llamo ", "mi nombre es "]):
            # Buscar patrones como "Soy [Nombre]", "Me llamo [Nombre]", "Mi nombre es [Nombre]"
            name_patterns = [
                r'soy\s+([a-záéíóúñü\s]+?)(?:\s+y\s|$)',
                r'me llamo\s+([a-záéíóúñü\s]+?)(?:\s+y\s|$)', 
                r'mi nombre es\s+([a-záéíóúñü\s]+?)(?:\s+y\s|$)'
            ]
            
            for pattern in name_patterns:
                name_match = re.search(pattern, message_lower)
                if name_match:
                    potential_name = name_match.group(1).strip()
                    # Verificar que sea un nombre válido
                    if len(potential_name) > 2 and not any(char.isdigit() for char in potential_name):
                        # Capitalizar correctamente
                        extracted_data["nombre"] = ' '.join(word.capitalize() for word in potential_name.split())
                    break
            
            # Si estamos específicamente pidiendo nombre y no encontramos patrón
            if current_step == "solicitar_nombre" and "nombre" not in extracted_data:
                # Solo aceptar si parece ser solo un nombre (sin verbos comunes)
                common_words = ['quiero', 'necesito', 'busco', 'información', 'agendar', 'cita', 'prueba']
                if not any(word in message_lower for word in common_words):
                    name = message.strip()
                    if len(name) > 2 and not any(char.isdigit() for char in name):
                        extracted_data["nombre"] = name.title()
        
        # Extraer fecha si está presente (en lenguaje natural o formato específico)
        date_keywords = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo", "semana", "próxima", "siguiente", "mañana", "hoy"]
        if any(word in message_lower for word in date_keywords) and not extracted_data.get("fecha"):
            # Intentar parsear la fecha
            parsed_date = self._parse_natural_date(message)
            if parsed_date:
                # Guardar en formato estándar
                extracted_data["fecha"] = parsed_date.strftime("%d/%m/%Y")
                extracted_data["fecha_original"] = message.strip()
                extracted_data["fecha_confirmada"] = self._format_date_confirmation(parsed_date)
            else:
                # Si no se puede parsear, guardar como texto para procesamiento posterior
                extracted_data["fecha"] = message.strip()
        
        # Extraer hora si está presente  
        time_patterns = [
            r'(\d{1,2}:\d{2})',                    # 18:00, 14:30
            r'(\d{1,2})\s*(?:pm|PM)',              # 6 PM, 6pm  
            r'(\d{1,2})\s*(?:am|AM)',              # 9 AM, 9am
            r'las\s+(\d{1,2}:\d{2})',              # las 18:00
            r'las\s+(\d{1,2})\s*(?:pm|am|PM|AM)?', # las 6 pm
            r'a\s+las\s+(\d{1,2}:\d{2})',          # a las 18:00
            r'a\s+las\s+(\d{1,2})\s*(?:pm|am|PM|AM)?', # a las 6 pm
            r'(\d{1,2})\s*h',                      # 18h, 14h
        ]
        for pattern in time_patterns:
            time_match = re.search(pattern, message_lower)
            if time_match and not extracted_data.get("hora"):
                time_str = time_match.group(1).strip()
                
                # Convertir a formato 24h si es necesario
                if 'pm' in message_lower and ':' not in time_str:
                    hour = int(time_str)
                    if hour != 12:
                        hour += 12
                    time_str = f"{hour:02d}:00"
                elif 'am' in message_lower and ':' not in time_str:
                    hour = int(time_str)
                    if hour == 12:
                        hour = 0
                    time_str = f"{hour:02d}:00"
                elif ':' not in time_str:
                    # Si es solo número, asumir que es hora en formato 24h
                    hour = int(time_str)
                    time_str = f"{hour:02d}:00"
                
                extracted_data["hora"] = time_str
                break
        # Si mencionan un vehículo específico
        vehicles = ["corolla", "camry", "rav4", "highlander", "prius", "tacoma"]
        for vehicle in vehicles:
            if vehicle in message_lower:
                extracted_data["vehiculo_interes"] = vehicle.title()
                break
        
        return extracted_data
    
    def get_user_appointment_data(self, phone_number: str) -> Dict[str, Any]:
        """Obtiene los datos de cita del usuario desde la base de datos"""
        user_data = self.db.get_user_data(phone_number)
        if not user_data:
            return {}
        
        return {
            "nombre": user_data.conversation_data.get("nombre"),
            "email": user_data.conversation_data.get("email"), 
            "fecha": user_data.conversation_data.get("fecha"),
            "hora": user_data.conversation_data.get("hora"),
            "vehiculo_interes": user_data.conversation_data.get("vehiculo_interes"),
            "current_step": user_data.current_step
        }
    
    def _show_appointment_summary(self, user_data: UserData) -> str:
        """Muestra un resumen de los datos de cita recopilados"""
        data = user_data.conversation_data
        
        summary = "📋 **Resumen de tu cita:**\n"
        if data.get("nombre"):
            summary += f"• Nombre: {data.get('nombre')}\n"
        if data.get("email"):
            summary += f"• Email: {data.get('email')}\n"
        if data.get("fecha"):
            summary += f"• Fecha: {data.get('fecha')}\n"
        if data.get("hora"):
            summary += f"• Hora: {data.get('hora')}\n"
        if data.get("vehiculo_interes"):
            summary += f"• Vehículo: {data.get('vehiculo_interes')}\n"
        
        return summary
    
    def _parse_natural_date(self, date_text: str) -> Optional[datetime]:
        """Convierte fechas en lenguaje natural a datetime específico"""
        from datetime import datetime, timedelta
        import re
        
        today = datetime.now()
        date_lower = date_text.lower()
        
        # Mapeo de días de la semana
        weekdays = {
            'lunes': 0, 'martes': 1, 'miércoles': 2, 'miercoles': 2,
            'jueves': 3, 'viernes': 4, 'sábado': 5, 'sabado': 5, 'domingo': 6
        }
        
        # Expresiones comunes
        if 'hoy' in date_lower:
            return today
        elif 'mañana' in date_lower and 'pasado' not in date_lower:
            return today + timedelta(days=1)
        elif 'pasado mañana' in date_lower:
            return today + timedelta(days=2)
        
        # Días de la semana con "que viene" o "próximo"
        for day_name, day_num in weekdays.items():
            if day_name in date_lower:
                current_weekday = today.weekday()
                
                if 'que viene' in date_lower or 'próxim' in date_lower or 'siguiente' in date_lower:
                    # Próxima semana - siempre la siguiente semana
                    days_ahead = (day_num - current_weekday) % 7
                    if days_ahead == 0:  # Si es el mismo día, ir a la próxima semana
                        days_ahead = 7
                    else:
                        days_ahead += 7
                else:
                    # Esta semana o la próxima si ya pasó
                    days_ahead = (day_num - current_weekday) % 7
                    if days_ahead == 0:  # Si es hoy, ir al próximo
                        days_ahead = 7
                
                target_date = today + timedelta(days=days_ahead)
                return target_date
        
        # Patrones con "en X días"
        days_match = re.search(r'en\s+(\d+)\s+días?', date_lower)
        if days_match:
            days = int(days_match.group(1))
            return today + timedelta(days=days)
        
        return None
    
    def _format_date_confirmation(self, parsed_date: datetime) -> str:
        """Formatea una fecha para confirmación con el usuario"""
        months = [
            'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ]
        
        weekdays = [
            'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'
        ]
        
        day_name = weekdays[parsed_date.weekday()]
        month_name = months[parsed_date.month - 1]
        
        return f"{day_name} {parsed_date.day} de {month_name} de {parsed_date.year}"
    
    def _parse_date_for_appointment(self, date_str: str) -> datetime:
        """Convierte string de fecha a datetime para crear la cita"""
        from datetime import datetime
        
        if not date_str:
            return datetime.now()
        
        # Si ya es formato DD/MM/YYYY, convertir directamente
        try:
            return datetime.strptime(date_str, "%d/%m/%Y")
        except ValueError:
            pass
        
        # Si es lenguaje natural, usar el parser
        parsed_date = self._parse_natural_date(date_str)
        if parsed_date:
            return parsed_date
        
        # Fallback: retornar fecha actual
        return datetime.now()

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
            user_data={"email": email},
            should_save=True  # Forzar guardado
        )

    def _handle_date_input(self, user_data: UserData, message: str) -> BotResponse:
        """Maneja la entrada de fecha con validación y parseo de lenguaje natural"""
        
        message_lower = message.lower()
        
        # Intentar parsear fecha en lenguaje natural primero
        parsed_date = self._parse_natural_date(message)
        
        if parsed_date:
            # Formatear fecha para confirmación
            formatted_date = self._format_date_confirmation(parsed_date)
            date_to_save = parsed_date.strftime("%d/%m/%Y")  # Formato estándar para guardar
            
            # Usar IA para respuesta natural confirmando la fecha específica
            try:
                prompt = f"""
El usuario dijo: "{message}"
He interpretado esto como: {formatted_date}
Fecha calculada: {date_to_save}
Ya tenemos: nombre: {user_data.conversation_data.get('nombre')}, email: {user_data.conversation_data.get('email')}

Responde de forma natural confirmando la fecha específica calculada y preguntando por el horario preferido.
Por ejemplo: "Perfecto! ¿Te refieres al {formatted_date}? ¿A qué hora te vendría bien?"
Sugiere horarios disponibles (9:00 AM - 6:00 PM de lunes a viernes, 9:00 AM - 2:00 PM sábados).
"""
                ai_response = self.agent.run_sync(prompt)
                response_text = str(ai_response.data)
            except:
                # Fallback
                response_text = f"Perfecto! ¿Te refieres al {formatted_date}? ⏰\n\n¿A qué hora te vendría bien? Tengo disponibilidad:\n• Lunes a Viernes: 9:00 AM - 6:00 PM\n• Sábados: 9:00 AM - 2:00 PM"
            
            return BotResponse(
                response_text=response_text,
                next_step="solicitar_hora",
                user_data={
                    "fecha": date_to_save,
                    "fecha_original": message.strip(),
                    "fecha_confirmada": formatted_date
                },
                should_save=True
            )
        
        # Si no es lenguaje natural, verificar si es fecha en formato específico
        date_str = message.strip()
        validated_date = validate_date(date_str)
        
        if validated_date:
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
                user_data={"fecha": date_str},
                should_save=True
            )
        
        # Si no se pudo parsear ni validar
        response_text = "❌ No pude entender la fecha. Puedes decirme algo como 'el lunes que viene', 'mañana' o usar el formato DD/MM/YYYY (ejemplo: 25/07/2025)"
        return BotResponse(
            response_text=response_text,
            next_step="solicitar_fecha"
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
                user_data={"hora": time_str},
                should_save=True  # Forzar guardado
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
            response_text = f"¡Perfecto! He agendado tu cita:\n\n📅 Fecha: {user_data.conversation_data.get('fecha')}\n⏰ Hora: {time_str}\n🚗 Vehículo: {vehicle}\n\n¿Confirmas estos datos?"
        
        return BotResponse(
            response_text=response_text,
            next_step="confirmar_cita",
            user_data={"hora": time_str},
            should_save=True  # Forzar guardado
        )

    def _handle_appointment_confirmation(self, user_data: UserData, message: str) -> BotResponse:
        """Maneja la confirmación de la cita"""
        
        message_lower = message.lower()
        
        if any(word in message_lower for word in ["si", "sí", "confirmo", "ok", "vale", "perfecto", "correcto"]):
            # Obtener datos actuales del usuario desde la base de datos
            current_user_data = self.db.get_user_data(user_data.phone_number)
            if not current_user_data:
                return BotResponse(
                    response_text="Lo siento, parece que perdí tus datos. ¿Podrías empezar de nuevo con tu nombre y email?",
                    next_step="solicitar_nombre"
                )
            
            conversation_data = current_user_data.conversation_data
            
            # Verificar que tengamos todos los datos necesarios
            required_fields = ["nombre", "email", "fecha", "hora"]
            missing_fields = [field for field in required_fields if not conversation_data.get(field)]
            
            if missing_fields:
                return BotResponse(
                    response_text=f"Parece que me faltan algunos datos: {', '.join(missing_fields)}. ¿Podrías proporcionármelos?",
                    next_step="solicitar_nombre"
                )
            
            # Crear la cita con datos de la base de datos
            appointment_data = {
                "phone_number": user_data.phone_number,
                "customer_name": conversation_data.get("nombre"),
                "customer_email": conversation_data.get("email"),
                "preferred_date": self._parse_date_for_appointment(conversation_data.get("fecha")),
                "preferred_time": conversation_data.get("hora"),
                "vehicle_interest": conversation_data.get("vehiculo_interes") or conversation_data.get("vehiculo_consultado", "No especificado")
            }
            
            appointment = Appointment(**appointment_data)
            self.db.save_appointment(appointment)
            
            # Usar IA para mensaje de confirmación natural
            try:
                prompt = f"""
La cita ha sido confirmada exitosamente. Datos:
- Nombre: {appointment.customer_name}
- Fecha: {appointment.preferred_date.strftime('%d/%m/%Y')}
- Hora: {appointment.preferred_time}
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
• Nombre: {appointment.customer_name}
• Fecha: {appointment.preferred_date.strftime('%d/%m/%Y')}
• Hora: {appointment.preferred_time}
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

    def _handle_vehicle_interest(self, user_data: UserData, message: str) -> BotResponse:
        """Maneja cuando el usuario especifica qué vehículo le interesa"""
        
        message_lower = message.lower()
        vehicle_interest = None
        
        # Buscar modelo mencionado
        vehicles = ["corolla", "camry", "rav4", "highlander", "prius", "tacoma"]
        for vehicle in vehicles:
            if vehicle in message_lower:
                vehicle_interest = vehicle.title()
                break
        
        if not vehicle_interest:
            # Usar IA para respuesta natural
            try:
                prompt = f"""
El usuario respondió: {message}
No pude identificar un modelo específico de Toyota.

Responde de forma natural pidiendo que especifique cuál de nuestros modelos le interesa.
Modelos: Corolla, Camry, RAV4, Highlander, Prius, Tacoma
"""
                ai_response = self.agent.run_sync(prompt)
                response_text = str(ai_response.data)
            except:
                response_text = "¿Podrías especificar cuál de nuestros modelos te interesa? Tenemos: Corolla, Camry, RAV4, Highlander, Prius y Tacoma."
            
            return BotResponse(
                response_text=response_text,
                next_step="solicitar_vehiculo_interes"
            )
        
        # Proceder a confirmación con IA
        try:
            prompt = f"""
Perfecto! El usuario está interesado en: {vehicle_interest}

Tenemos todos los datos para la cita:
- Nombre: {user_data.conversation_data.get('nombre')}
- Email: {user_data.conversation_data.get('email')}
- Fecha: {user_data.conversation_data.get('fecha')}
- Hora: {user_data.conversation_data.get('hora')}
- Vehículo: {vehicle_interest}

Crea un resumen natural de la cita y pide confirmación de forma amigable.
"""
            ai_response = self.agent.run_sync(prompt)
            response_text = str(ai_response.data)
        except:
            response_text = f"""¡Perfecto! {vehicle_interest} es una excelente elección.

📋 Resumen de tu cita:
• Nombre: {user_data.conversation_data.get('nombre')}
• Email: {user_data.conversation_data.get('email')}
• Fecha: {user_data.conversation_data.get('fecha')}
• Hora: {user_data.conversation_data.get('hora')}
• Vehículo: {vehicle_interest}

¿Confirmas estos datos?"""
        
        return BotResponse(
            response_text=response_text,
            next_step="confirmar_cita",
            user_data={"vehiculo_interes": vehicle_interest},
            should_save=True  # Forzar guardado
        )
    
    def _check_and_create_appointment_if_ready(self, user_data: UserData):
        """Verifica si tenemos todos los datos necesarios y crea la cita automáticamente"""
        
        conversation_data = user_data.conversation_data
        required_fields = ["nombre", "email", "fecha", "hora", "vehiculo_interes"]
        
        # Verificar si tenemos todos los campos requeridos
        has_all_data = all(conversation_data.get(field) for field in required_fields)
        
        if has_all_data and user_data.current_step == "conversacion_general":
            try:
                # Crear la cita automáticamente
                appointment_data = {
                    "phone_number": user_data.phone_number,
                    "customer_name": conversation_data.get("nombre"),
                    "customer_email": conversation_data.get("email"),
                    "preferred_date": self._parse_date_for_appointment(conversation_data.get("fecha")),
                    "preferred_time": conversation_data.get("hora"),
                    "vehicle_interest": conversation_data.get("vehiculo_interes")
                }
                
                appointment = Appointment(**appointment_data)
                self.db.save_appointment(appointment)
                
                # Actualizar el paso para evitar crear duplicados
                user_data.current_step = "cita_creada"
                self.db.save_user_data(user_data)
                
                print(f"✅ Cita creada automáticamente para {appointment.customer_name}")
                
            except Exception as e:
                print(f"❌ Error al crear cita automática: {e}")
    
    def get_vehicle_info_from_db(self, vehicle_name: str) -> dict:
        """Obtiene información del vehículo desde la base de datos"""
        try:
            # Buscar vehículo en la base de datos
            vehicles_collection = self.db.db.vehicles
            vehicle = vehicles_collection.find_one(
                {"model": {"$regex": vehicle_name, "$options": "i"}}
            )
            
            if vehicle:
                return {
                    "name": vehicle.get("name"),
                    "price": vehicle.get("price"),
                    "description": vehicle.get("description"),
                    "features": vehicle.get("features", []),
                    "fuel_economy": vehicle.get("fuel_economy", ""),
                    "category": vehicle.get("category", "")
                }
            else:
                # Si no está en la DB, usar información hardcodeada como fallback
                vehicles_info = {
                    "corolla": {
                        "name": "Corolla 2024",
                        "price": "$23,000-$28,000",
                        "description": "Sedán compacto, confiable y eficiente",
                        "features": ["Motor 2.0L", "CVT", "Toyota Safety Sense 2.0"]
                    },
                    "camry": {
                        "name": "Camry 2024", 
                        "price": "$26,000-$35,000",
                        "description": "Sedán mediano, premium y espacioso",
                        "features": ["Motor 2.5L", "8-speed automático", "Pantalla touchscreen"]
                    },
                    "prius": {
                        "name": "Prius 2024",
                        "price": "$28,000-$33,000", 
                        "description": "Híbrido eco-friendly e innovador",
                        "features": ["Sistema híbrido", "Excelente economía de combustible", "Tecnología avanzada"]
                    },
                    "rav4": {
                        "name": "RAV4 2024",
                        "price": "$29,000-$38,000",
                        "description": "SUV compacta, versátil y adventure-ready",
                        "features": ["AWD disponible", "Gran espacio de carga", "Capacidad off-road"]
                    }
                }
                
                vehicle_key = vehicle_name.lower()
                return vehicles_info.get(vehicle_key, {
                    "name": vehicle_name,
                    "price": "Consultar precio",
                    "description": "Vehículo Toyota de calidad",
                    "features": []
                })
                
        except Exception as e:
            print(f"Error obteniendo info del vehículo: {e}")
            return {
                "name": vehicle_name,
                "price": "Consultar precio", 
                "description": "Vehículo Toyota de calidad",
                "features": []
            }
