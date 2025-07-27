import os
from datetime import datetime, timedelta
from typing import Optional, List
from pymongo import MongoClient
from models.user import UserData, ConversationMessage, Appointment


class DatabaseManager:
    def __init__(self):
        self.client = MongoClient(os.getenv("MONGODB_URL"))
        self.db = self.client.toyota_sanjuan
        self.users_collection = self.db.users
        self.messages_collection = self.db.messages
        self.appointments_collection = self.db.appointments

    def get_user_data(self, phone_number: str) -> Optional[UserData]:
        """Obtiene los datos del usuario de la base de datos"""
        user_doc = self.users_collection.find_one({"phone_number": phone_number})
        if user_doc:
            # Verificar si los datos han expirado
            if user_doc.get("expires_at") and user_doc["expires_at"] < datetime.utcnow():
                self.reset_user_conversation(phone_number)
                return None
            return UserData(**user_doc)
        return None

    def save_user_data(self, user_data: UserData, expiration_hours: int = 24) -> UserData:
        """Guarda o actualiza los datos del usuario"""
        user_data.updated_at = datetime.utcnow()
        user_data.expires_at = datetime.utcnow() + timedelta(hours=expiration_hours)
        
        user_dict = user_data.dict(by_alias=True)
        
        self.users_collection.update_one(
            {"phone_number": user_data.phone_number},
            {"$set": user_dict},
            upsert=True
        )
        return user_data

    def save_message(self, phone_number: str, message: str, sender: str, expiration_hours: int = 168) -> ConversationMessage:
        """Guarda un mensaje en el historial de conversación"""
        expires_at = datetime.utcnow() + timedelta(hours=expiration_hours)
        
        conversation_msg = ConversationMessage(
            phone_number=phone_number,
            message=message,
            sender=sender,
            expires_at=expires_at
        )
        
        msg_dict = conversation_msg.dict(by_alias=True)
        self.messages_collection.insert_one(msg_dict)
        return conversation_msg

    def get_conversation_history(self, phone_number: str, limit: int = 10) -> List[ConversationMessage]:
        """Obtiene el historial de conversación del usuario"""
        # Limpiar mensajes expirados
        self.messages_collection.delete_many({
            "expires_at": {"$lt": datetime.utcnow()}
        })
        
        # Obtener mensajes recientes
        messages = self.messages_collection.find(
            {"phone_number": phone_number}
        ).sort("timestamp", -1).limit(limit)
        
        return [ConversationMessage(**msg) for msg in messages]

    def save_appointment(self, appointment: Appointment) -> Appointment:
        """Guarda una cita en la base de datos"""
        appointment_dict = appointment.dict(by_alias=True)
        self.appointments_collection.insert_one(appointment_dict)
        return appointment

    def get_user_appointments(self, phone_number: str) -> List[Appointment]:
        """Obtiene las citas del usuario"""
        appointments = self.appointments_collection.find({"phone_number": phone_number})
        return [Appointment(**app) for app in appointments]

    def reset_user_conversation(self, phone_number: str):
        """Resetea la conversación del usuario"""
        self.users_collection.delete_one({"phone_number": phone_number})
        self.messages_collection.delete_many({"phone_number": phone_number})

    def cleanup_expired_data(self):
        """Limpia datos expirados de la base de datos"""
        current_time = datetime.utcnow()
        
        # Limpiar usuarios expirados
        self.users_collection.delete_many({
            "expires_at": {"$lt": current_time}
        })
        
        # Limpiar mensajes expirados
        self.messages_collection.delete_many({
            "expires_at": {"$lt": current_time}
        })

    def get_appointment_by_id(self, appointment_id: str) -> Optional[Appointment]:
        """Obtiene una cita por su ID"""
        from bson import ObjectId
        appointment_doc = self.appointments_collection.find_one({"_id": ObjectId(appointment_id)})
        if appointment_doc:
            return Appointment(**appointment_doc)
        return None

    def update_appointment_status(self, appointment_id: str, status: str) -> bool:
        """Actualiza el estado de una cita"""
        from bson import ObjectId
        result = self.appointments_collection.update_one(
            {"_id": ObjectId(appointment_id)},
            {"$set": {"status": status}}
        )
        return result.modified_count > 0
