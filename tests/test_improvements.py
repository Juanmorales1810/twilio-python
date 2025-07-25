#!/usr/bin/env python3
"""
Test completo para verificar las mejoras del chatbot:
1. Consulta de vehículos desde DB
2. Guardado correcto de datos del usuario
3. Creación automática de citas
"""

import sys
import os
from dotenv import load_dotenv

# Configurar variables de entorno
os.environ["GEMINI_API_KEY"] = "test_key"
os.environ["MONGODB_URL"] = "mongodb://localhost:27017"

# Importar después de configurar env vars
from services.chatbot_service import ToyotaChatbotService
from database.connection import DatabaseManager

def test_vehicle_database_integration():
    """Test de consulta de vehículos desde la base de datos"""
    print("=== PRUEBA DE CONSULTA DE VEHÍCULOS DESDE DB ===\n")
    
    try:
        chatbot = ToyotaChatbotService()
        
        # Probar consulta de diferentes vehículos
        vehicles = ["prius", "corolla", "rav4"]
        
        for vehicle in vehicles:
            print(f"🚗 Consultando {vehicle}:")
            info = chatbot.get_vehicle_info_from_db(vehicle)
            print(f"   • Nombre: {info['name']}")
            print(f"   • Precio: {info['price']}")
            print(f"   • Descripción: {info['description']}")
            if info.get('features'):
                print(f"   • Características: {info['features'][:2]}...")
            print()
            
    except Exception as e:
        print(f"❌ Error en consulta de vehículos: {e}")

def test_user_data_saving():
    """Test de guardado correcto de datos del usuario"""
    print("=== PRUEBA DE GUARDADO DE DATOS DE USUARIO ===\n")
    
    try:
        chatbot = ToyotaChatbotService()
        phone = "+1234567891"
        
        # Reset inicial
        chatbot.db.reset_user_conversation(phone)
        
        # Simular conversación que debe guardar datos
        messages = [
            "Hola, quiero información del Prius",
            "Soy Juan Morales",
            "Mi email es juan@test.com",
            "Me gustaría agendar una prueba para el lunes 28 de julio",
            "A las 18:00 horas"
        ]
        
        for i, message in enumerate(messages, 1):
            print(f"📱 Mensaje {i}: {message}")
            response = chatbot.process_message(phone, message)
            print(f"🤖 Respuesta: {response[:100]}...")
            
            # Verificar datos guardados después de cada mensaje
            user_data = chatbot.db.get_user_data(phone)
            if user_data:
                print(f"💾 Datos guardados:")
                print(f"   • Nombre en model: {user_data.name}")
                print(f"   • Email en model: {user_data.email}")
                print(f"   • Conversation data: {user_data.conversation_data}")
                print(f"   • Current step: {user_data.current_step}")
            print("-" * 50)
        
        # Verificar estado final
        final_user_data = chatbot.db.get_user_data(phone)
        print("\n📊 ESTADO FINAL:")
        print(f"✅ Nombre guardado: {final_user_data.name}")
        print(f"✅ Email guardado: {final_user_data.email}")
        print(f"✅ Datos conversación: {len(final_user_data.conversation_data)} campos")
        
        # Verificar si se creó cita automáticamente
        appointments = chatbot.db.get_user_appointments(phone)
        print(f"✅ Citas creadas: {len(appointments)}")
        
        if appointments:
            for apt in appointments:
                print(f"   📅 {apt.customer_name} - {apt.preferred_date} - {apt.preferred_time}")
        
    except Exception as e:
        print(f"❌ Error en guardado de datos: {e}")
        import traceback
        traceback.print_exc()

def test_vehicle_specific_response():
    """Test de respuesta específica con información de vehículo"""
    print("\n=== PRUEBA DE RESPUESTA ESPECÍFICA DE VEHÍCULO ===\n")
    
    try:
        chatbot = ToyotaChatbotService()
        phone = "+1234567892"
        
        # Reset inicial
        chatbot.db.reset_user_conversation(phone)
        
        # Preguntar específicamente sobre un vehículo
        message = "Quiero más información del Prius 2024"
        print(f"🗣️  Usuario: {message}")
        
        response = chatbot.process_message(phone, message)
        print(f"🤖 Bot: {response}")
        
        # Verificar que la respuesta contenga información específica
        if any(keyword in response.lower() for keyword in ["híbrido", "28,000", "eficiencia"]):
            print("✅ La respuesta contiene información específica del vehículo")
        else:
            print("⚠️  La respuesta no parece contener información específica")
            
    except Exception as e:
        print(f"❌ Error en respuesta específica: {e}")

if __name__ == "__main__":
    test_vehicle_database_integration()
    test_user_data_saving()
    test_vehicle_specific_response()
