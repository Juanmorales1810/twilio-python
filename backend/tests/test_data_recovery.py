#!/usr/bin/env python3
"""
Prueba de recuperación de datos guardados para continuar una cita
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


import os
from dotenv import load_dotenv
from services.chatbot_service import ToyotaChatbotService

load_dotenv()

def test_data_recovery():
    """Prueba que se puedan recuperar datos para continuar una cita"""
    
    chatbot = ToyotaChatbotService()
    phone_number = "+1234567890"
    
    # Reset conversation
    chatbot.db.reset_user_conversation(phone_number)
    
    print("=== PRUEBA DE RECUPERACIÓN DE DATOS ===\n")
    
    # Fase 1: Usuario inicia proceso y proporciona algunos datos
    print("📱 FASE 1: Usuario inicia proceso")
    print("=" * 40)
    
    messages_phase1 = [
        "Hola, quiero información sobre pruebas de manejo",
        "Soy María García y mi email es maria@test.com",
        "Me interesa el RAV4"
    ]
    
    for msg in messages_phase1:
        print(f"🗣️  Usuario: {msg}")
        response = chatbot.process_message(phone_number, msg)
        print(f"🤖 Bot: {response}")
        print()
    
    # Mostrar datos guardados hasta ahora
    saved_data = chatbot.get_user_appointment_data(phone_number)
    print("💾 Datos guardados en Fase 1:")
    for key, value in saved_data.items():
        if value:
            print(f"   • {key}: {value}")
    print()
    
    # Fase 2: Simular que el usuario se va y vuelve más tarde
    print("📱 FASE 2: Usuario vuelve más tarde")
    print("=" * 40)
    
    # Crear nueva instancia del chatbot (simula nueva sesión)
    new_chatbot = ToyotaChatbotService()
    
    # El usuario vuelve y quiere continuar
    continuation_messages = [
        "Hola, quiero continuar con mi cita",
        "El viernes de la próxima semana", 
        "A las 10:00 AM",
        "Sí, confirmo la cita"
    ]
    
    for msg in continuation_messages:
        print(f"🗣️  Usuario: {msg}")
        response = new_chatbot.process_message(phone_number, msg)
        print(f"🤖 Bot: {response}")
        print()
    
    # Mostrar datos finales
    final_data = new_chatbot.get_user_appointment_data(phone_number)
    print("💾 Datos finales guardados:")
    for key, value in final_data.items():
        if value:
            print(f"   • {key}: {value}")

def test_partial_data_completion():
    """Prueba completar datos faltantes usando datos guardados"""
    
    chatbot = ToyotaChatbotService()
    phone_number = "+1987654321"
    
    # Reset conversation
    chatbot.db.reset_user_conversation(phone_number)
    
    print("\n" + "="*60)
    print("=== PRUEBA DE COMPLETAR DATOS FALTANTES ===\n")
    
    # Usuario proporciona datos parciales en sesiones diferentes
    print("📅 Sesión 1: Solo nombre")
    chatbot.process_message(phone_number, "Quiero agendar cita")
    chatbot.process_message(phone_number, "Pedro López")
    
    print("📧 Sesión 2: Solo email")
    chatbot.process_message(phone_number, "Mi correo es pedro@example.com")
    
    print("🚗 Sesión 3: Solo vehículo")
    chatbot.process_message(phone_number, "Me interesa el Camry")
    
    print("\n🔄 Usuario quiere continuar con cita completa:")
    response = chatbot.process_message(phone_number, "Quiero confirmar mi cita")
    print(f"🤖 Bot: {response}")
    
    # Mostrar qué datos tenemos
    data = chatbot.get_user_appointment_data(phone_number)
    print("\n💾 Datos acumulados:")
    for key, value in data.items():
        if value:
            print(f"   • {key}: {value}")

if __name__ == "__main__":
    test_data_recovery()
    test_partial_data_completion()
