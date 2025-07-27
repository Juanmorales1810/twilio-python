#!/usr/bin/env python3
"""
Test completo usando la configuración de producción con IA real
"""

import sys
import os
from dotenv import load_dotenv

# Agregar el directorio padre al path para imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Cargar variables de entorno reales
load_dotenv()

# Verificar que tenemos las claves necesarias
if not os.getenv("GEMINI_API_KEY") or os.getenv("GEMINI_API_KEY") == "test_key":
    print("❌ Error: Necesitas configurar GEMINI_API_KEY en el archivo .env")
    sys.exit(1)

if not os.getenv("MONGODB_URL"):
    print("❌ Error: Necesitas configurar MONGODB_URL en el archivo .env")
    sys.exit(1)

# Importar después de verificar las claves
from services.chatbot_service import ToyotaChatbotService
from database.connection import DatabaseManager

def test_vehicle_information_with_ai():
    """Test de consulta de vehículos con IA real"""
    print("=== PRUEBA DE CONSULTA DE VEHÍCULOS CON IA REAL ===\n")
    
    try:
        chatbot = ToyotaChatbotService()
        phone = "+1234567894"
        
        # Reset inicial
        chatbot.db.reset_user_conversation(phone)
        print("🔄 Conversación reseteada")
        
        # Test 1: Consulta general de vehículos
        print("\n--- Test 1: Consulta general ---")
        message = "¿Qué vehículos tienen disponibles?"
        print(f"🗣️  Usuario: {message}")
        
        response = chatbot.process_message(phone, message)
        print(f"🤖 Bot: {response}")
        
        # Verificar que la respuesta mencione vehículos
        vehicle_names = ["corolla", "camry", "prius", "rav4"]
        mentioned_vehicles = [v for v in vehicle_names if v in response.lower()]
        print(f"✅ Vehículos mencionados: {mentioned_vehicles}")
        
        # Test 2: Consulta específica del Prius
        print("\n--- Test 2: Consulta específica del Prius ---")
        message = "Quiero más información del Prius"
        print(f"🗣️  Usuario: {message}")
        
        response = chatbot.process_message(phone, message)
        print(f"🤖 Bot: {response}")
        
        # Verificar que se guardó el interés en el vehículo
        user_data = chatbot.db.get_user_data(phone)
        print(f"💾 Vehículo de interés guardado: {user_data.conversation_data.get('vehiculo_interes')}")
        
        # Verificar información específica del Prius desde DB
        prius_info = chatbot.get_vehicle_info_from_db("prius")
        print(f"📊 Info del Prius desde DB:")
        print(f"   • Precio: {prius_info['price']}")
        print(f"   • Descripción: {prius_info['description']}")
        
    except Exception as e:
        print(f"❌ Error en test de vehículos: {e}")
        import traceback
        traceback.print_exc()

def test_complete_appointment_flow():
    """Test del flujo completo de agendamiento con IA real"""
    print("\n=== PRUEBA DE FLUJO COMPLETO DE AGENDAMIENTO ===\n")
    
    try:
        chatbot = ToyotaChatbotService()
        phone = "+1234567895"
        
        # Reset inicial
        chatbot.db.reset_user_conversation(phone)
        print("🔄 Conversación reseteada")
        
        # Simular conversación completa paso a paso
        conversation_steps = [
            ("Hola, quiero agendar una prueba de manejo", "Iniciar agendamiento"),
            ("Quiero probar el Prius", "Especificar vehículo"),
            ("Soy Juan Morales", "Proporcionar nombre"),
            ("Mi correo es juan@correotest.com", "Proporcionar email"),
            ("Me gustaría para el lunes 28 de julio", "Proporcionar fecha"),
            ("A las 18:00 horas por favor", "Proporcionar hora"),
            ("Sí, confirmo la cita", "Confirmar cita")
        ]
        
        for i, (message, description) in enumerate(conversation_steps, 1):
            print(f"\n--- Paso {i}: {description} ---")
            print(f"🗣️  Usuario: {message}")
            
            response = chatbot.process_message(phone, message)
            print(f"🤖 Bot: {response[:200]}...")
            
            # Verificar datos guardados después de cada paso
            user_data = chatbot.db.get_user_data(phone)
            if user_data:
                print(f"💾 Datos guardados:")
                print(f"   • Nombre: {user_data.name}")
                print(f"   • Email: {user_data.email}")
                print(f"   • Step: {user_data.current_step}")
                if user_data.conversation_data:
                    print(f"   • Conversation: {list(user_data.conversation_data.keys())}")
            
            # Verificar si hay errores
            if "disculpa" in response.lower() and "error" in response.lower():
                print("⚠️  Posible error detectado en la respuesta")
            
            print("-" * 60)
        
        # Verificar estado final
        final_user = chatbot.db.get_user_data(phone)
        appointments = chatbot.db.get_user_appointments(phone)
        
        print(f"\n📊 ESTADO FINAL:")
        print(f"✅ Nombre guardado: {final_user.name}")
        print(f"✅ Email guardado: {final_user.email}")
        print(f"✅ Datos conversación: {final_user.conversation_data}")
        print(f"✅ Citas creadas: {len(appointments)}")
        
        if appointments:
            for apt in appointments:
                print(f"   📅 {apt.customer_name} - {apt.preferred_date.strftime('%d/%m/%Y')} - {apt.preferred_time}")
                print(f"   🚗 Vehículo: {apt.vehicle_interest}")
        
        if len(appointments) > 0 and final_user.name and final_user.email:
            print("🎉 ¡TEST EXITOSO! Todos los datos se guardaron y la cita se creó correctamente")
        else:
            print("❌ El test no fue completamente exitoso")
            
    except Exception as e:
        print(f"❌ Error en flujo completo: {e}")
        import traceback
        traceback.print_exc()

def test_data_persistence():
    """Test de persistencia de datos en base de datos"""
    print("\n=== PRUEBA DE PERSISTENCIA DE DATOS ===\n")
    
    try:
        chatbot = ToyotaChatbotService()
        phone = "+1234567896"
        
        # Simular que ya tenemos datos guardados
        from models.user import UserData
        user_data = UserData(
            phone_number=phone,
            name="Juan Morales",
            email="juan@test.com",
            conversation_data={
                "nombre": "Juan Morales",
                "email": "juan@test.com",
                "vehiculo_interes": "Prius",
                "fecha": "28/07/2025",
                "hora": "18:00"
            },
            current_step="conversacion_general"
        )
        
        # Guardar datos
        chatbot.db.save_user_data(user_data)
        print("💾 Datos de usuario guardados manualmente")
        
        # Verificar que la función de crear cita automática funcione
        chatbot._check_and_create_appointment_if_ready(user_data)
        
        # Verificar citas creadas
        appointments = chatbot.db.get_user_appointments(phone)
        print(f"✅ Citas creadas automáticamente: {len(appointments)}")
        
        if appointments:
            apt = appointments[0]
            print(f"   📅 {apt.customer_name}")
            print(f"   📧 {apt.customer_email}")
            print(f"   📅 {apt.preferred_date}")
            print(f"   🕒 {apt.preferred_time}")
            print(f"   🚗 {apt.vehicle_interest}")
        
    except Exception as e:
        print(f"❌ Error en persistencia: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("🔑 Usando claves de producción...")
    print(f"📊 MongoDB URL: {os.getenv('MONGODB_URL')[:50]}...")
    print(f"🤖 Gemini API: Configurada\n")
    
    test_vehicle_information_with_ai()
    test_complete_appointment_flow()
    test_data_persistence()
