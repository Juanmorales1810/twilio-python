from datetime import datetime
from typing import Optional, Dict, Any
from config.connections import db_collections, model
from models.modelConversation import ConversationContext, ConversationState, ConversationResponse
from models.modelAppointment import AppointmentCreate, AppointmentStatus
from models.modelUser import UserCreate
from utils.date_parser import DateParser
from services.whatsapp_service import whatsapp_service
from pydantic_ai import Agent
from bson import ObjectId
import pendulum

class ConversationalAppointmentService:
    """Servicio para manejar citas de manera conversacional secuencial"""
    
    def __init__(self):
        self.date_parser = DateParser(timezone="America/Santiago")  # Ajustar según tu zona horaria
    
    def get_or_create_conversation(self, phone_number: str) -> ConversationContext:
        """Obtener o crear contexto de conversación para un usuario"""
        # Buscar conversación activa
        existing = db_collections['conversations'].find_one({
            "phone_number": phone_number,
            "state": {"$ne": ConversationState.COMPLETED}
        })
        
        if existing:
            existing['_id'] = str(existing['_id'])
            
            # Asegurar que parsed_date sea string si existe
            if existing.get('parsed_date'):
                if isinstance(existing['parsed_date'], datetime):
                    existing['parsed_date'] = existing['parsed_date'].isoformat()
                elif not isinstance(existing['parsed_date'], str):
                    existing['parsed_date'] = str(existing['parsed_date'])
            
            return ConversationContext(**existing)
        
        # Crear nueva conversación
        new_conversation = ConversationContext(phone_number=phone_number)
        conversation_data = new_conversation.dict()
        conversation_data.pop('id', None)  # Remover el ID para que MongoDB lo genere
        
        result = db_collections['conversations'].insert_one(conversation_data)
        new_conversation.id = str(result.inserted_id)
        
        return new_conversation
    
    def update_conversation(self, context: ConversationContext) -> None:
        """Actualizar contexto de conversación en la base de datos"""
        context.updated_at = datetime.now()
        
        update_data = context.dict()
        update_data.pop('id', None)  # No actualizar el ID
        
        # Asegurar que parsed_date sea string si existe
        if update_data.get('parsed_date') and not isinstance(update_data['parsed_date'], str):
            if hasattr(update_data['parsed_date'], 'to_datetime_string'):
                update_data['parsed_date'] = update_data['parsed_date'].to_datetime_string()
            else:
                update_data['parsed_date'] = str(update_data['parsed_date'])
        
        db_collections['conversations'].update_one(
            {"_id": ObjectId(context.id)},
            {"$set": update_data}
        )
    
    def process_message(self, phone_number: str, message: str) -> ConversationResponse:
        """Procesar mensaje del usuario de manera conversacional"""
        # Obtener contexto de conversación
        context = self.get_or_create_conversation(phone_number)
        context.last_message = message.strip()
        
        # Procesar según el estado actual
        if context.state == ConversationState.GREETING or context.state == ConversationState.IDLE:
            return self._handle_greeting(context, message)
        elif context.state == ConversationState.WAITING_NAME:
            return self._handle_name_input(context, message)
        elif context.state == ConversationState.WAITING_DATE:
            return self._handle_date_input(context, message)
        elif context.state == ConversationState.WAITING_DESCRIPTION:
            return self._handle_description_input(context, message)
        elif context.state == ConversationState.CONFIRMING_APPOINTMENT:
            return self._handle_confirmation(context, message)
        else:
            return self._handle_unknown_state(context, message)
    
    def _handle_greeting(self, context: ConversationContext, message: str) -> ConversationResponse:
        """Manejar saludo inicial y solicitud de cita"""
        message_lower = message.lower()
        
        # Detectar si quiere hacer una cita
        cita_keywords = ['cita', 'agendar', 'turno', 'consulta', 'hora', 'appointment']
        wants_appointment = any(keyword in message_lower for keyword in cita_keywords)
        
        if wants_appointment:
            context.state = ConversationState.WAITING_NAME
            self.update_conversation(context)
            
            return ConversationResponse(
                message="📋 ¡Perfecto! Te ayudo a agendar tu cita.\n\nPrimero necesito tu nombre completo.",
                state=ConversationState.WAITING_NAME,
                requires_input=True
            )
        else:
            # Saludo con menú interactivo
            menu_config = whatsapp_service.create_main_menu_buttons()
            
            return ConversationResponse(
                message=menu_config["body"],
                state=ConversationState.GREETING,
                requires_input=True,
                suggested_actions=[
                    "📅 Nueva Cita",
                    "👀 Mis Citas", 
                    "❓ Ayuda"
                ]
            )
    
    def _handle_name_input(self, context: ConversationContext, message: str) -> ConversationResponse:
        """Manejar entrada del nombre del usuario"""
        name = message.strip()
        
        # Validación básica del nombre
        if len(name) < 2:
            return ConversationResponse(
                message="🤔 El nombre parece muy corto. Por favor, ingresa tu nombre completo (nombre y apellido).",
                state=ConversationState.WAITING_NAME,
                requires_input=True
            )
        
        context.user_name = name
        context.state = ConversationState.WAITING_DATE
        self.update_conversation(context)
        
        return ConversationResponse(
            message=f"👋 ¡Hola {name}!\n\nAhora necesito saber cuándo te gustaría tener tu cita. Puedes decirme:\n\n• \"Mañana a las 10:30\"\n• \"El viernes a las 14:00\"\n• \"27/09/2025 15:30\"\n• \"Pasado mañana en la tarde\"\n\n¿Cuándo te viene bien?",
            state=ConversationState.WAITING_DATE,
            requires_input=True
        )
    
    def _handle_date_input(self, context: ConversationContext, message: str) -> ConversationResponse:
        """Manejar entrada de fecha y hora"""
        message_lower = message.lower().strip()
        
        # Manejar respuesta a sugerencia de horario laboral
        if hasattr(context, 'temp_data') and context.temp_data.get('suggested_business_date'):
            if message_lower in ['sí', 'si', 'yes', 'ok', 'confirmar']:
                # Mantener la fecha original que el usuario eligió
                original_date_str = context.temp_data.get('original_date')
                context.parsed_date = original_date_str
                context.state = ConversationState.WAITING_DESCRIPTION
                context.temp_data = {}  # Limpiar datos temporales
                self.update_conversation(context)
                
                parsed_date = pendulum.parse(original_date_str)
                explanation = self.date_parser._explain_parsed_date(parsed_date, pendulum.now(self.date_parser.timezone))
                
                return ConversationResponse(
                    message=f"✅ {explanation}\n\nPerfecto! Ahora cuéntame, ¿cuál es el motivo de tu cita?\n\nPor ejemplo:\n• Consulta general\n• Revisión médica\n• Control\n• Consulta específica",
                    state=ConversationState.WAITING_DESCRIPTION,
                    requires_input=True
                )
            elif message_lower in ['cambiar', 'horario laboral', 'cambio']:
                # Usar la fecha sugerida de horario laboral
                suggested_date_str = context.temp_data.get('suggested_business_date')
                context.parsed_date = suggested_date_str
                context.state = ConversationState.WAITING_DESCRIPTION
                context.temp_data = {}  # Limpiar datos temporales
                self.update_conversation(context)
                
                parsed_date = pendulum.parse(suggested_date_str)
                explanation = self.date_parser._explain_parsed_date(parsed_date, pendulum.now(self.date_parser.timezone))
                
                return ConversationResponse(
                    message=f"✅ {explanation}\n\nPerfecto! Ahora cuéntame, ¿cuál es el motivo de tu cita?\n\nPor ejemplo:\n• Consulta general\n• Revisión médica\n• Control\n• Consulta específica",
                    state=ConversationState.WAITING_DESCRIPTION,
                    requires_input=True
                )
        
        # Procesar nueva entrada de fecha
        context.preferred_date = message
        
        # Parsear fecha con lenguaje natural
        parsed_date, explanation = self.date_parser.parse_natural_date(message)
        
        if parsed_date is None:
            return ConversationResponse(
                message=f"❌ {explanation}\n\nPor favor, intenta de nuevo con un formato como:\n• \"Mañana a las 10:30\"\n• \"El lunes a las 14:00\"\n• \"28/09/2025 09:15\"",
                state=ConversationState.WAITING_DATE,
                requires_input=True
            )
        
        # Verificar que la fecha sea futura
        now = pendulum.now(self.date_parser.timezone)
        if parsed_date <= now:
            return ConversationResponse(
                message="⏰ La fecha debe ser en el futuro. Por favor elige una fecha y hora posterior a ahora.",
                state=ConversationState.WAITING_DATE,
                requires_input=True
            )
        
        # Verificar conflictos de horario
        conflicts = self._check_time_conflicts(parsed_date)
        if conflicts:
            conflict_time = conflicts[0]['date'].strftime('%d/%m/%Y a las %H:%M')
            return ConversationResponse(
                message=f"⚠️ Ya hay una cita programada cerca de esa hora ({conflict_time}).\n\n¿Podrías elegir otro horario? Por ejemplo:\n• Una hora antes o después\n• Otro día",
                state=ConversationState.WAITING_DATE,
                requires_input=True
            )
        
        # Sugerir horario laboral si es necesario
        if not self.date_parser.is_business_hours(parsed_date):
            business_alternative = self.date_parser.suggest_business_hours_alternative(parsed_date)
            business_formatted = self.date_parser.format_date_for_display(business_alternative)
            
            context.temp_data['suggested_business_date'] = business_alternative.to_datetime_string()
            context.temp_data['original_date'] = parsed_date.to_datetime_string()
            self.update_conversation(context)
            
            return ConversationResponse(
                message=f"💼 {explanation}\n\nNota: La hora que elegiste está fuera del horario laboral (Lun-Vie 8:00-18:00).\n\n¿Te parece bien así o prefieres que te sugiera: {business_formatted}?\n\nResponde 'sí' para confirmar tu horario original o 'cambiar' para el horario laboral.",
                state=ConversationState.WAITING_DATE,
                requires_input=True
            )
        
        context.parsed_date = parsed_date.to_datetime_string()
        context.state = ConversationState.WAITING_DESCRIPTION
        self.update_conversation(context)
        
        return ConversationResponse(
            message=f"✅ {explanation}\n\nPerfecto! Ahora cuéntame, ¿cuál es el motivo de tu cita?\n\nPor ejemplo:\n• Consulta general\n• Revisión médica\n• Control\n• Consulta específica",
            state=ConversationState.WAITING_DESCRIPTION,
            requires_input=True
        )
    
    def _handle_description_input(self, context: ConversationContext, message: str) -> ConversationResponse:
        """Manejar entrada de descripción/motivo de la cita"""
        description = message.strip()
        
        if len(description) < 3:
            # Mostrar opciones de servicios con lista interactiva
            service_config = whatsapp_service.create_service_selection_list()
            
            return ConversationResponse(
                message=f"{service_config['body']}\n\nO describe brevemente el motivo de tu cita:",
                state=ConversationState.WAITING_DESCRIPTION,
                requires_input=True,
                suggested_actions=[
                    "👩‍⚕️ Consulta General",
                    "🔍 Chequeo Médico", 
                    "📋 Control",
                    "🩺 Especialista"
                ]
            )
        
        context.description = description
        context.state = ConversationState.CONFIRMING_APPOINTMENT
        self.update_conversation(context)
        
        # Preparar resumen con botones de confirmación
        parsed_date = pendulum.parse(context.parsed_date)
        formatted_date = self.date_parser.format_date_for_display(parsed_date)
        
        summary = f"📋 **RESUMEN DE TU CITA**\n\n👤 **Nombre:** {context.user_name}\n📅 **Fecha:** {formatted_date}\n📝 **Motivo:** {context.description}\n📱 **Teléfono:** {context.phone_number}\n⏱️ **Duración:** {context.duration_minutes} minutos"
        
        return ConversationResponse(
            message=f"{summary}\n\n¿Todo está correcto?",
            state=ConversationState.CONFIRMING_APPOINTMENT,
            requires_input=True,
            suggested_actions=[
                "✅ Confirmar",
                "❌ Cancelar",
                "✏️ Modificar"
            ]
        )
    
    def _handle_confirmation(self, context: ConversationContext, message: str) -> ConversationResponse:
        """Manejar confirmación final de la cita"""
        message_lower = message.lower().strip()
        
        if message_lower in ['sí', 'si', 'yes', 'confirmar', 'ok']:
            # Crear la cita
            try:
                appointment_id = self._create_appointment(context)
                
                if appointment_id:
                    context.state = ConversationState.COMPLETED
                    self.update_conversation(context)
                    
                    parsed_date = pendulum.parse(context.parsed_date)
                    formatted_date = self.date_parser.format_date_for_display(parsed_date)
                    
                    return ConversationResponse(
                        message=f"🎉 **¡CITA CREADA EXITOSAMENTE!**\n\n✅ **ID de cita:** {appointment_id}\n👤 **Paciente:** {context.user_name}\n📅 **Fecha:** {formatted_date}\n📝 **Motivo:** {context.description}\n\n📞 Te contactaremos antes de la cita para confirmarla.\n\n💬 Si necesitas modificar o cancelar, escribe 'mis citas' en cualquier momento.\n\n¡Gracias por confiar en nosotros!",
                        state=ConversationState.COMPLETED,
                        requires_input=False,
                        appointment_created=True,
                        appointment_id=appointment_id
                    )
                else:
                    return ConversationResponse(
                        message="❌ Hubo un error al crear la cita. Por favor intenta nuevamente o contacta con soporte.",
                        state=ConversationState.GREETING,
                        requires_input=True
                    )
                    
            except Exception as e:
                return ConversationResponse(
                    message=f"❌ Error inesperado: {str(e)}. Por favor intenta nuevamente.",
                    state=ConversationState.GREETING,
                    requires_input=True
                )
        
        elif message_lower in ['no', 'cancelar', 'cancel']:
            context.state = ConversationState.COMPLETED
            self.update_conversation(context)
            
            return ConversationResponse(
                message="❌ Cita cancelada. Si cambias de opinión, puedes escribir 'quiero una cita' en cualquier momento.\n\n¿Hay algo más en lo que pueda ayudarte?",
                state=ConversationState.COMPLETED,
                requires_input=True
            )
        
        elif 'cambiar' in message_lower:
            # Manejar cambios específicos
            if 'fecha' in message_lower or 'hora' in message_lower:
                context.state = ConversationState.WAITING_DATE
                self.update_conversation(context)
                
                return ConversationResponse(
                    message="📅 ¿Cuál es la nueva fecha y hora que prefieres?",
                    state=ConversationState.WAITING_DATE,
                    requires_input=True
                )
            elif 'motivo' in message_lower or 'descripcion' in message_lower:
                context.state = ConversationState.WAITING_DESCRIPTION
                self.update_conversation(context)
                
                return ConversationResponse(
                    message="📝 ¿Cuál es el nuevo motivo de la cita?",
                    state=ConversationState.WAITING_DESCRIPTION,
                    requires_input=True
                )
            elif 'nombre' in message_lower:
                context.state = ConversationState.WAITING_NAME
                self.update_conversation(context)
                
                return ConversationResponse(
                    message="👤 ¿Cuál es el nombre correcto?",
                    state=ConversationState.WAITING_NAME,
                    requires_input=True
                )
        
        # Si no entendimos la respuesta
        return ConversationResponse(
            message="🤔 No entendí tu respuesta. Por favor responde:\n• **'SÍ'** para confirmar la cita\n• **'NO'** para cancelar\n• **'CAMBIAR [campo]'** para modificar (ej: 'cambiar fecha')",
            state=ConversationState.CONFIRMING_APPOINTMENT,
            requires_input=True
        )
    
    def _handle_unknown_state(self, context: ConversationContext, message: str) -> ConversationResponse:
        """Manejar estado desconocido o error"""
        context.state = ConversationState.GREETING
        self.update_conversation(context)
        
        return ConversationResponse(
            message="🔄 Hubo un problema con la conversación. Empecemos de nuevo.\n\n¿En qué puedo ayudarte?",
            state=ConversationState.GREETING,
            requires_input=True
        )
    
    def _check_time_conflicts(self, date_time) -> list:
        """Verificar conflictos de horario"""
        from datetime import timedelta
        
        # Convertir a datetime si es necesario
        if hasattr(date_time, 'to_datetime_string'):
            check_datetime = datetime.fromisoformat(date_time.to_datetime_string())
        else:
            check_datetime = date_time
        
        # Buscar citas en un rango de ±30 minutos
        conflicts = list(db_collections['appointments'].find({
            "date": {
                "$gte": check_datetime - timedelta(minutes=30),
                "$lt": check_datetime + timedelta(minutes=30)
            },
            "status": {"$in": ["pendiente", "confirmada"]}
        }))
        
        return conflicts
    
    def _create_appointment(self, context: ConversationContext) -> Optional[str]:
        """Crear la cita en la base de datos"""
        try:
            # Crear usuario si no existe
            existing_user = db_collections['users'].find_one({"phone_number": context.phone_number})
            
            if not existing_user:
                new_user = UserCreate(
                    phone_number=context.phone_number,
                    name=context.user_name
                )
                user_data = new_user.dict()
                user_data["created_at"] = datetime.now()
                user_data["is_active"] = True
                db_collections['users'].insert_one(user_data)
            
            # Crear la cita
            # Convertir la fecha string a datetime object correctamente
            if isinstance(context.parsed_date, str):
                # Si parsed_date es un string, parsearlo con pendulum y convertir a datetime
                parsed_pendulum = pendulum.parse(context.parsed_date)
                parsed_date = parsed_pendulum.to_datetime_string()
                # Convertir a datetime nativo de Python
                appointment_datetime = datetime.fromisoformat(parsed_date.replace('T', ' '))
            else:
                # Si ya es datetime, usarlo directamente
                appointment_datetime = context.parsed_date
            
            new_appointment = AppointmentCreate(
                user_phone=context.phone_number,
                user_name=context.user_name,
                date=appointment_datetime,
                description=context.description,
                duration_minutes=context.duration_minutes
            )
            
            appointment_data = new_appointment.dict()
            appointment_data["status"] = AppointmentStatus.PENDING
            appointment_data["created_at"] = datetime.now()
            
            result = db_collections['appointments'].insert_one(appointment_data)
            return str(result.inserted_id)
            
        except Exception as e:
            print(f"Error creating appointment: {e}")
            print(f"Context parsed_date type: {type(context.parsed_date)}")
            print(f"Context parsed_date value: {context.parsed_date}")
            return None


# Instancia global del servicio
conversational_service = ConversationalAppointmentService()