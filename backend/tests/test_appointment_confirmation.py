#!/usr/bin/env python3
"""
Test específico para el problema de confirmación de citas con hora 18:00
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import os
from dotenv import load_dotenv

# Configurar variables de entorno mínimas para testing
os.environ["GEMINI_API_KEY"] = "test_key"
os.environ["MONGODB_URL"] = "mongodb://localhost:27017"

# Solo importar después de configurar env vars
from services.chatbot_service import ToyotaChatbotService
from utils.validators import validate_time

load_dotenv()

def test_appointment_confirmation_flow():
    """Prueba el flujo completo incluyendo confirmación"""
    
    print("=== PRUEBA DE CONFIRMACIÓN DE CITAS CON 18:00 ===\n")
    
    # Primero verificar que 18:00 sea válido
    is_valid = validate_time("18:00")
    print(f"🕕 ¿Es '18:00' válido? {is_valid}")
    
    if not is_valid:
        print("❌ ERROR: 18:00 no es válido según la validación")
        return
    
    try:
        chatbot = ToyotaChatbotService()
        phone_number = "+1234567890"
        
        # Reset conversation
        chatbot.db.reset_user_conversation(phone_number)
        
        print("\n📱 Simulando conversación completa...")
        
        # Conversación paso a paso
        steps = [
            ("Quiero agendar una cita", "Iniciar proceso"),
            ("Soy Juan Morales y mi correo es juan@test.com", "Proporcionar datos"),
            ("Me interesa el Corolla", "Seleccionar vehículo"),
            ("El lunes 28", "Proporcionar fecha"),
            ("18:00", "Proporcionar hora - PUNTO CRÍTICO"),
            ("Sí, confirmo", "Confirmar cita - PUNTO CRÍTICO")
        ]
        
        for i, (message, description) in enumerate(steps, 1):
            print(f"\n--- Paso {i}: {description} ---")
            print(f"🗣️  Usuario: {message}")
            
            try:
                response = chatbot.process_message(phone_number, message)
                print(f"🤖 Bot: {response}")
                
                # Verificar que no sea mensaje de error
                if "Disculpa, ocurrió un error" in response:
                    print("❌ ERROR DETECTADO en la respuesta del bot")
                    
                    # Mostrar datos guardados para debug
                    data = chatbot.get_user_appointment_data(phone_number)
                    print(f"📊 Datos guardados: {data}")
                    break
                elif "❌" in response:
                    print("⚠️  Mensaje de validación detectado")
                else:
                    print("✅ Respuesta normal")
                    
            except Exception as e:
                print(f"❌ EXCEPCIÓN: {str(e)}")
                import traceback
                traceback.print_exc()
                break
        
        # Mostrar estado final
        final_data = chatbot.get_user_appointment_data(phone_number)
        print(f"\n📊 Estado final: {final_data}")
        
        # Verificar si se creó la cita
        appointments = chatbot.db.get_user_appointments(phone_number)
        print(f"\n📅 Citas creadas: {len(appointments)}")
        for appointment in appointments:
            print(f"   • {appointment.customer_name} - {appointment.preferred_date} - {appointment.preferred_time}")
            
    except Exception as e:
        print(f"❌ ERROR GENERAL: {str(e)}")
        import traceback
        traceback.print_exc()

def test_appointment_model():
    """Prueba la creación directa del modelo Appointment"""
    
    print("\n=== PRUEBA DEL MODELO APPOINTMENT ===\n")
    
    try:
        from models.user import Appointment
        from datetime import datetime
        
        # Datos de prueba
        test_data = {
            "phone_number": "+1234567890",
            "customer_name": "Juan Morales",
            "customer_email": "juan@test.com",
            "preferred_date": datetime(2025, 7, 28),
            "preferred_time": "18:00",
            "vehicle_interest": "Corolla"
        }
        
        print("📝 Creando appointment con datos:")
        for key, value in test_data.items():
            print(f"   • {key}: {value}")
        
        appointment = Appointment(**test_data)
        print(f"\n✅ Appointment creado exitosamente!")
        print(f"   • ID: {appointment.id}")
        print(f"   • Nombre: {appointment.customer_name}")
        print(f"   • Fecha: {appointment.preferred_date}")
        print(f"   • Hora: {appointment.preferred_time}")
        
    except Exception as e:
        print(f"❌ ERROR al crear Appointment: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_appointment_model()
    test_appointment_confirmation_flow()
