#!/usr/bin/env python3
"""
Test específico para el problema con las horas
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.validators import validate_time
from services.chatbot_service import ToyotaChatbotService

def test_time_validation():
    """Prueba la validación de diferentes formatos de hora"""
    
    print("=== PRUEBA DE VALIDACIÓN DE HORAS ===\n")
    
    test_cases = [
        "18:00",
        "6:00 PM", 
        "6 PM",
        "18",
        "14:30",
        "2:30 PM",
        "9:00",
        "6:00",
        "19:00",  # Fuera de horario
        "8:00",   # Fuera de horario  
        "abc",    # Inválido
        "25:00"   # Inválido
    ]
    
    for time_str in test_cases:
        result = validate_time(time_str)
        status = "✅" if result else "❌"
        print(f"{status} '{time_str}' → {result}")

def test_time_extraction():
    """Prueba la extracción automática de horas"""
    
    chatbot = ToyotaChatbotService()
    
    print("\n=== PRUEBA DE EXTRACCIÓN DE HORAS ===\n")
    
    test_messages = [
        "Si esa fecha está bien y quiero que sea a las 6 pm",
        "18:00",
        "a las 14:30",
        "las 6 de la tarde",
        "a las 18:00",
        "6 PM",
        "las 18 horas"
    ]
    
    for message in test_messages:
        extracted = chatbot._extract_user_data(message, "solicitar_hora")
        hora = extracted.get("hora", "No extraída")
        print(f"'{message}' → hora: {hora}")

def test_full_flow_with_18():
    """Prueba el flujo completo con la hora 18:00"""
    
    chatbot = ToyotaChatbotService()
    phone_number = "+1234567890"
    
    # Reset conversation
    chatbot.db.reset_user_conversation(phone_number)
    
    print("\n=== PRUEBA DE FLUJO COMPLETO CON 18:00 ===\n")
    
    # Configurar datos básicos
    print("🔧 Configurando datos básicos...")
    chatbot.process_message(phone_number, "Quiero agendar cita")
    chatbot.process_message(phone_number, "Soy Juan Morales y mi email es juan@test.com")
    chatbot.process_message(phone_number, "Me interesa el Corolla")
    chatbot.process_message(phone_number, "El lunes 28")
    
    # Mostrar estado antes de la hora
    data = chatbot.get_user_appointment_data(phone_number)
    print(f"📊 Datos antes de hora: {data}")
    
    # Probar con 18:00
    print("\n🕕 Probando '18:00'...")
    response = chatbot.process_message(phone_number, "18:00")
    print(f"🤖 Respuesta: {response}")
    
    # Mostrar estado después
    data = chatbot.get_user_appointment_data(phone_number)
    print(f"📊 Datos después: {data}")
    
    # Intentar confirmar
    print("\n✅ Intentando confirmar...")
    response = chatbot.process_message(phone_number, "Sí, confirmo")
    print(f"🤖 Respuesta: {response}")

if __name__ == "__main__":
    test_time_validation()
    test_time_extraction()
    test_full_flow_with_18()
