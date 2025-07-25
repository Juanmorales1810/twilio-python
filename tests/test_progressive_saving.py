#!/usr/bin/env python3
"""
Prueba del guardado progresivo de datos durante el flujo de reserva
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


import os
from dotenv import load_dotenv
from services.chatbot_service import ToyotaChatbotService

load_dotenv()

def test_progressive_data_saving():
    """Prueba que los datos se guarden progresivamente"""
    
    chatbot = ToyotaChatbotService()
    phone_number = "+1234567890"
    
    # Reset conversation
    chatbot.db.reset_user_conversation(phone_number)
    
    print("=== PRUEBA DE GUARDADO PROGRESIVO ===\n")
    
    test_messages = [
        "Hola, quiero agendar una prueba de manejo",
        "Soy Juan Morales y mi correo es juan@uncorreo.com", 
        "El lunes de la próxima semana",
        "A las 2:00 PM",
        "Me interesa el Corolla",
        "Sí, confirmo"
    ]
    
    for i, message in enumerate(test_messages, 1):
        print(f"📤 Paso {i}: {message}")
        
        # Procesar mensaje
        response = chatbot.process_message(phone_number, message)
        print(f"🤖 Respuesta: {response}")
        
        # Mostrar datos guardados en la base de datos después de cada paso
        saved_data = chatbot.get_user_appointment_data(phone_number)
        print(f"💾 Datos guardados en BD:")
        for key, value in saved_data.items():
            if value:  # Solo mostrar campos con datos
                print(f"   • {key}: {value}")
        
        print("=" * 60)
        print()

def test_data_persistence():
    """Prueba que los datos persistan entre sesiones"""
    
    chatbot = ToyotaChatbotService()
    phone_number = "+1234567890"
    
    print("=== PRUEBA DE PERSISTENCIA DE DATOS ===\n")
    
    # Simular que el usuario proporciona algunos datos
    print("1. Usuario proporciona nombre y email...")
    chatbot.process_message(phone_number, "Quiero agendar una cita")
    chatbot.process_message(phone_number, "Soy María García y mi email es maria@test.com")
    
    # Mostrar datos guardados
    saved_data = chatbot.get_user_appointment_data(phone_number)
    print("💾 Datos guardados:")
    for key, value in saved_data.items():
        if value:
            print(f"   • {key}: {value}")
    
    print("\n2. Usuario se desconecta y vuelve más tarde...")
    print("   (Simulando nueva sesión del chatbot)\n")
    
    # Crear nueva instancia del chatbot (simula nueva sesión)
    new_chatbot = ToyotaChatbotService()
    
    # Verificar que los datos persisten
    print("3. Usuario continúa la conversación...")
    response = new_chatbot.process_message(phone_number, "Quiero continuar con mi cita")
    print(f"🤖 Respuesta: {response}")
    
    # Mostrar datos recuperados
    recovered_data = new_chatbot.get_user_appointment_data(phone_number)
    print("💾 Datos recuperados de BD:")
    for key, value in recovered_data.items():
        if value:
            print(f"   • {key}: {value}")

if __name__ == "__main__":
    test_progressive_data_saving()
    print("\n" + "="*80 + "\n")
    test_data_persistence()
