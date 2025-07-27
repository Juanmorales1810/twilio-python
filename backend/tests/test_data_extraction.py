#!/usr/bin/env python3
"""
Test de extracción de datos sin depender de la IA
"""

import sys
import os
from dotenv import load_dotenv

# Configurar variables de entorno
os.environ["GEMINI_API_KEY"] = "test_key"
os.environ["MONGODB_URL"] = "mongodb://localhost:27017"

# Importar después de configurar env vars
from services.chatbot_service import ToyotaChatbotService
from models.user import UserData

def test_data_extraction():
    """Test directo de extracción de datos"""
    print("=== PRUEBA DE EXTRACCIÓN DE DATOS ===\n")
    
    try:
        chatbot = ToyotaChatbotService()
        
        # Test de extracción de email
        message = "Mi correo es juan@test.com"
        extracted = chatbot._extract_user_data(message, "solicitar_email")
        print(f"📧 Mensaje: '{message}'")
        print(f"✅ Email extraído: {extracted.get('email')}")
        
        # Test de extracción de nombre
        message = "Soy Juan Morales"
        extracted = chatbot._extract_user_data(message, "solicitar_nombre")
        print(f"\n👤 Mensaje: '{message}'")
        print(f"✅ Nombre extraído: {extracted.get('nombre')}")
        
        # Test de extracción de hora
        message = "A las 18:00"
        extracted = chatbot._extract_user_data(message, "solicitar_hora")
        print(f"\n🕒 Mensaje: '{message}'")
        print(f"✅ Hora extraída: {extracted.get('hora')}")
        
        # Test de consulta de vehículo desde DB
        print(f"\n🚗 Información del Prius desde DB:")
        prius_info = chatbot.get_vehicle_info_from_db("prius")
        print(f"   • Nombre: {prius_info['name']}")
        print(f"   • Precio: {prius_info['price']}")
        print(f"   • Descripción: {prius_info['description']}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

def test_user_data_update():
    """Test directo de actualización de datos de usuario"""
    print("\n=== PRUEBA DE ACTUALIZACIÓN DE DATOS ===\n")
    
    try:
        chatbot = ToyotaChatbotService()
        phone = "+1234567893"
        
        # Crear usuario inicial
        user_data = UserData(phone_number=phone)
        chatbot.db.save_user_data(user_data)
        
        # Simular datos extraídos
        extracted_data = {
            "nombre": "Juan Morales",
            "email": "juan@test.com",
            "vehiculo_interes": "Prius",
            "fecha": "28 de julio",
            "hora": "18:00"
        }
        
        # Actualizar conversation_data
        user_data.conversation_data.update(extracted_data)
        
        # Actualizar campos principales
        if "nombre" in user_data.conversation_data:
            user_data.name = user_data.conversation_data["nombre"]
        if "email" in user_data.conversation_data:
            user_data.email = user_data.conversation_data["email"]
            
        # Guardar
        chatbot.db.save_user_data(user_data)
        
        # Verificar
        saved_user = chatbot.db.get_user_data(phone)
        print(f"✅ Nombre guardado: {saved_user.name}")
        print(f"✅ Email guardado: {saved_user.email}")
        print(f"✅ Conversation data: {saved_user.conversation_data}")
        
        # Test de creación automática de cita
        chatbot._check_and_create_appointment_if_ready(saved_user)
        
        # Verificar citas
        appointments = chatbot.db.get_user_appointments(phone)
        print(f"✅ Citas creadas: {len(appointments)}")
        
        if appointments:
            apt = appointments[0]
            print(f"   📅 {apt.customer_name} - {apt.preferred_date} - {apt.preferred_time}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_data_extraction()
    test_user_data_update()
