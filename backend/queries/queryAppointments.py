from datetime import datetime, timedelta
from typing import List, Optional
from config.connections import db_collections, model
from models.modelAppointment import (
    Appointment, 
    AppointmentCreate, 
    AppointmentStatus, 
    AppointmentUpdate
)
from models.modelUser import User, UserCreate
from pydantic_ai.tools import RunContext
from pydantic_ai import Agent
from bson import ObjectId


def create_user_if_not_exists(phone_number: str, name: str) -> str:
    """Crear usuario si no existe, retorna el ID del usuario"""
    existing_user = db_collections['users'].find_one({"phone_number": phone_number})
    
    if existing_user:
        return str(existing_user["_id"])
    
    new_user = UserCreate(phone_number=phone_number, name=name)
    user_data = new_user.dict()
    user_data["created_at"] = datetime.now()
    user_data["is_active"] = True
    
    result = db_collections['users'].insert_one(user_data)
    return str(result.inserted_id)


def create_appointment_agent() -> Agent:
    """Crear agente especializado en manejo de citas"""
    
    appointment_agent = Agent(
        model=model,  # Usar el modelo configurado en connections.py
        system_prompt="""Eres un asistente especializado en el manejo de citas médicas o de servicios profesionales.
        
        Tu función principal es ayudar a los usuarios con:
        - Agendar nuevas citas
        - Consultar citas existentes  
        - Modificar citas programadas
        - Cancelar citas
        - Verificar disponibilidad de horarios
        
        INSTRUCCIONES IMPORTANTES:
        1. SIEMPRE saluda de manera amable y profesional
        2. Cuando te soliciten una cita, pregunta por: fecha preferida, hora, motivo/descripción
        3. Confirma todos los detalles antes de crear una cita
        4. Si hay conflictos de horario, sugiere alternativas
        5. Sé claro sobre el estado de las citas (pendiente, confirmada, etc.)
        6. SIEMPRE responde en español
        7. Si no tienes información suficiente, pregunta amablemente
        
        LIMITACIONES:
        - Solo puedes trabajar con citas y usuarios
        - No proporciones información médica o diagnósticos
        - No manejes información financiera o pagos
        - Si te preguntan algo fuera de tu alcance, redirige cortésmente al tema de citas
        
        Sé empático, profesional y eficiente en tus respuestas."""
    )
    
    @appointment_agent.tool
    def crear_cita(
        ctx: RunContext, 
        phone_number: str, 
        user_name: str,
        fecha_hora: str,
        descripcion: str,
        duracion_minutos: int = 60
    ) -> str:
        """
        Crear una nueva cita para un usuario.
        
        Args:
            phone_number: Número de teléfono del usuario
            user_name: Nombre completo del usuario  
            fecha_hora: Fecha y hora en formato 'YYYY-MM-DD HH:MM'
            descripcion: Motivo o descripción de la cita
            duracion_minutos: Duración estimada en minutos (por defecto 60)
        """
        try:
            # Parsear la fecha
            cita_datetime = datetime.strptime(fecha_hora, '%Y-%m-%d %H:%M')
            
            # Verificar que la fecha sea futura
            if cita_datetime <= datetime.now():
                return "Error: La fecha de la cita debe ser en el futuro. Por favor elige otra fecha y hora."
            
            # Verificar disponibilidad
            conflicts = list(db_collections['appointments'].find({
                "date": {
                    "$gte": cita_datetime - timedelta(minutes=30),
                    "$lt": cita_datetime + timedelta(minutes=duracion_minutos + 30)
                },
                "status": {"$in": ["pendiente", "confirmada"]}
            }))
            
            if conflicts:
                return f"Lo siento, ya hay una cita programada cerca de esa hora ({fecha_hora}). Por favor elige otro horario."
            
            # Crear o verificar usuario
            user_id = create_user_if_not_exists(phone_number, user_name)
            
            # Crear la cita
            nueva_cita = AppointmentCreate(
                user_phone=phone_number,
                user_name=user_name,
                date=cita_datetime,
                description=descripcion,
                duration_minutes=duracion_minutos
            )
            
            cita_data = nueva_cita.dict()
            cita_data["status"] = AppointmentStatus.PENDING
            cita_data["created_at"] = datetime.now()
            
            result = db_collections['appointments'].insert_one(cita_data)
            cita_id = str(result.inserted_id)
            
            return f"✅ Cita creada exitosamente!\n\nDetalles:\n- ID: {cita_id}\n- Fecha: {cita_datetime.strftime('%d/%m/%Y a las %H:%M')}\n- Duración: {duracion_minutos} minutos\n- Motivo: {descripcion}\n- Estado: Pendiente de confirmación\n\nTe contactaremos pronto para confirmar tu cita."
            
        except ValueError:
            return "Error: Formato de fecha inválido. Por favor usa el formato 'YYYY-MM-DD HH:MM' (ejemplo: '2024-03-15 10:30')"
        except Exception as e:
            return f"Error al crear la cita: {str(e)}"
    
    @appointment_agent.tool  
    def buscar_citas_usuario(ctx: RunContext, phone_number: str) -> str:
        """
        Buscar todas las citas de un usuario por número de teléfono.
        
        Args:
            phone_number: Número de teléfono del usuario
        """
        try:
            citas = list(db_collections['appointments'].find({"user_phone": phone_number}).sort("date", 1))
            
            if not citas:
                return f"No se encontraron citas para el número {phone_number}."
            
            respuesta = f"📅 Citas encontradas para {phone_number}:\n\n"
            
            for i, cita in enumerate(citas, 1):
                fecha_str = cita["date"].strftime("%d/%m/%Y a las %H:%M")
                estado_emoji = {
                    "pendiente": "⏳",
                    "confirmada": "✅", 
                    "cancelada": "❌",
                    "completada": "✅",
                    "no_asistio": "⚠️"
                }
                
                respuesta += f"{i}. {estado_emoji.get(cita['status'], '📋')} {fecha_str}\n"
                respuesta += f"   Motivo: {cita['description']}\n" 
                respuesta += f"   Estado: {cita['status'].title()}\n"
                respuesta += f"   ID: {str(cita['_id'])}\n\n"
            
            return respuesta
            
        except Exception as e:
            return f"Error al buscar citas: {str(e)}"
    
    @appointment_agent.tool
    def modificar_cita(
        ctx: RunContext,
        cita_id: str,
        nueva_fecha_hora: Optional[str] = None,
        nueva_descripcion: Optional[str] = None,
        nuevo_estado: Optional[str] = None
    ) -> str:
        """
        Modificar una cita existente.
        
        Args:
            cita_id: ID de la cita a modificar
            nueva_fecha_hora: Nueva fecha y hora en formato 'YYYY-MM-DD HH:MM' (opcional)
            nueva_descripcion: Nueva descripción (opcional) 
            nuevo_estado: Nuevo estado: pendiente, confirmada, cancelada, completada (opcional)
        """
        try:
            # Verificar que la cita existe
            cita = db_collections['appointments'].find_one({"_id": ObjectId(cita_id)})
            if not cita:
                return f"No se encontró una cita con ID {cita_id}"
            
            updates = {}
            
            # Actualizar fecha si se proporciona
            if nueva_fecha_hora:
                try:
                    nueva_fecha = datetime.strptime(nueva_fecha_hora, '%Y-%m-%d %H:%M')
                    if nueva_fecha <= datetime.now():
                        return "Error: La nueva fecha debe ser en el futuro."
                    
                    # Verificar conflictos (excluyendo la cita actual)
                    conflicts = list(db_collections['appointments'].find({
                        "_id": {"$ne": ObjectId(cita_id)},
                        "date": {
                            "$gte": nueva_fecha - timedelta(minutes=30),
                            "$lt": nueva_fecha + timedelta(minutes=cita.get("duration_minutes", 60) + 30)
                        },
                        "status": {"$in": ["pendiente", "confirmada"]}
                    }))
                    
                    if conflicts:
                        return f"Conflicto de horario: Ya hay una cita programada cerca de {nueva_fecha_hora}"
                    
                    updates["date"] = nueva_fecha
                except ValueError:
                    return "Error: Formato de fecha inválido. Usa 'YYYY-MM-DD HH:MM'"
            
            # Actualizar descripción
            if nueva_descripcion:
                updates["description"] = nueva_descripcion
            
            # Actualizar estado
            if nuevo_estado:
                estados_validos = ["pendiente", "confirmada", "cancelada", "completada", "no_asistio"]
                if nuevo_estado.lower() not in estados_validos:
                    return f"Estado inválido. Estados válidos: {', '.join(estados_validos)}"
                updates["status"] = nuevo_estado.lower()
            
            if not updates:
                return "No se especificaron cambios para realizar."
            
            updates["updated_at"] = datetime.now()
            
            # Realizar la actualización
            db_collections['appointments'].update_one(
                {"_id": ObjectId(cita_id)}, 
                {"$set": updates}
            )
            
            # Obtener la cita actualizada
            cita_actualizada = db_collections['appointments'].find_one({"_id": ObjectId(cita_id)})
            
            respuesta = "✅ Cita actualizada exitosamente!\n\nNuevos detalles:\n"
            respuesta += f"- Fecha: {cita_actualizada['date'].strftime('%d/%m/%Y a las %H:%M')}\n"
            respuesta += f"- Motivo: {cita_actualizada['description']}\n"
            respuesta += f"- Estado: {cita_actualizada['status'].title()}\n"
            
            return respuesta
            
        except Exception as e:
            return f"Error al modificar la cita: {str(e)}"
    
    @appointment_agent.tool
    def cancelar_cita(ctx: RunContext, cita_id: str) -> str:
        """
        Cancelar una cita específica.
        
        Args:
            cita_id: ID de la cita a cancelar
        """
        try:
            result = db_collections['appointments'].update_one(
                {"_id": ObjectId(cita_id)},
                {
                    "$set": {
                        "status": "cancelada",
                        "updated_at": datetime.now()
                    }
                }
            )
            
            if result.matched_count == 0:
                return f"No se encontró una cita con ID {cita_id}"
            
            return f"✅ Cita cancelada exitosamente (ID: {cita_id})"
            
        except Exception as e:
            return f"Error al cancelar la cita: {str(e)}"
    
    @appointment_agent.tool
    def verificar_disponibilidad(ctx: RunContext, fecha_inicio: str, fecha_fin: str) -> str:
        """
        Verificar disponibilidad de horarios en un rango de fechas.
        
        Args:
            fecha_inicio: Fecha de inicio en formato 'YYYY-MM-DD'
            fecha_fin: Fecha de fin en formato 'YYYY-MM-DD' 
        """
        try:
            inicio = datetime.strptime(fecha_inicio, '%Y-%m-%d')
            fin = datetime.strptime(fecha_fin, '%Y-%m-%d') + timedelta(days=1)
            
            citas_ocupadas = list(db_collections['appointments'].find({
                "date": {"$gte": inicio, "$lt": fin},
                "status": {"$in": ["pendiente", "confirmada"]}
            }).sort("date", 1))
            
            if not citas_ocupadas:
                return f"✅ Horarios completamente disponibles del {fecha_inicio} al {fecha_fin}"
            
            respuesta = f"📅 Disponibilidad del {fecha_inicio} al {fecha_fin}:\n\n"
            respuesta += "Horarios ocupados:\n"
            
            for cita in citas_ocupadas:
                fecha_str = cita["date"].strftime("%d/%m/%Y a las %H:%M")
                duracion = cita.get("duration_minutes", 60)
                fin_cita = cita["date"] + timedelta(minutes=duracion)
                fin_str = fin_cita.strftime("%H:%M")
                
                respuesta += f"- {fecha_str} - {fin_str} ({cita['description']})\n"
            
            return respuesta
            
        except ValueError:
            return "Error: Formato de fecha inválido. Usa 'YYYY-MM-DD'"
        except Exception as e:
            return f"Error al verificar disponibilidad: {str(e)}"
    
    return appointment_agent


# Instancia del agente de citas
appointment_agent = create_appointment_agent()