#!/usr/bin/env python3
"""
Prueba del nuevo sistema de parseo de fechas en lenguaje natural
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


import os
from datetime import datetime
from dotenv import load_dotenv
from services.chatbot_service import ToyotaChatbotService

load_dotenv()

def test_natural_date_parsing():
    """Prueba el parseo de fechas en lenguaje natural"""
    
    chatbot = ToyotaChatbotService()
    
    print("=== PRUEBA DE PARSEO DE FECHAS NATURALES ===\n")
    print(f"📅 Fecha actual: {datetime.now().strftime('%A, %d de %B de %Y')}\n")
    
    # Casos de prueba para fechas naturales
    test_cases = [
        "mañana",
        "el lunes que viene", 
        "el próximo viernes",
        "el lunes de la siguiente semana",
        "el martes",
        "hoy",
        "pasado mañana",
        "en 3 días",
        "el sábado próximo"
    ]
    
    for date_text in test_cases:
        print(f"🗣️  Texto: '{date_text}'")
        
        # Probar parseo
        parsed_date = chatbot._parse_natural_date(date_text)
        
        if parsed_date:
            formatted = chatbot._format_date_confirmation(parsed_date)
            standard = parsed_date.strftime("%d/%m/%Y")
            print(f"✅ Interpretado como: {formatted}")
            print(f"📝 Formato estándar: {standard}")
        else:
            print("❌ No se pudo parsear")
        
        print("-" * 50)

def test_date_conversation_flow():
    """Prueba el flujo completo con fechas naturales"""
    
    chatbot = ToyotaChatbotService()
    phone_number = "+1234567890"
    
    # Reset conversation
    chatbot.db.reset_user_conversation(phone_number)
    
    print("\n=== PRUEBA DE FLUJO CON FECHAS NATURALES ===\n")
    print(f"📅 Contexto: Hoy es {datetime.now().strftime('%A, %d de %B de %Y')}\n")
    
    conversation = [
        "Hola, quiero agendar una cita",
        "Soy Ana López y mi email es ana@test.com",  
        "Me interesa el Camry",
        "el próximo martes",  # Fecha en lenguaje natural
        "a las 3:00 PM",
        "Sí, confirmo"
    ]
    
    for i, message in enumerate(conversation, 1):
        print(f"Paso {i}")
        print(f"🗣️  Usuario: {message}")
        
        response = chatbot.process_message(phone_number, message)
        print(f"🤖 Bot: {response}")
        
        # Mostrar datos guardados
        user_data = chatbot.get_user_appointment_data(phone_number)
        if user_data.get("fecha"):
            print(f"📅 Fecha guardada: {user_data.get('fecha')}")
            if user_data.get("fecha_confirmada"):
                print(f"📋 Fecha confirmada: {user_data.get('fecha_confirmada')}")
        
        print("=" * 60)
        print()

def test_multiple_date_formats():
    """Prueba diferentes formatos de fecha en una conversación"""
    
    chatbot = ToyotaChatbotService()
    phone_number = "+1987654321"
    
    # Reset conversation
    chatbot.db.reset_user_conversation(phone_number)
    
    print("=== PRUEBA DE MÚLTIPLES FORMATOS DE FECHA ===\n")
    
    # Simular diferentes usuarios con diferentes formas de expresar fechas
    scenarios = [
        ("Usuario 1", "el lunes que viene"),
        ("Usuario 2", "25/07/2025"), 
        ("Usuario 3", "mañana"),
        ("Usuario 4", "el viernes próximo")
    ]
    
    for user, date_expression in scenarios:
        print(f"👤 {user}: '{date_expression}'")
        
        # Simular flujo rápido
        chatbot.process_message(phone_number, "Quiero cita")
        chatbot.process_message(phone_number, f"Soy {user} y mi email es test@test.com")
        response = chatbot.process_message(phone_number, date_expression)
        
        print(f"🤖 Respuesta: {response}")
        
        # Mostrar interpretación
        data = chatbot.get_user_appointment_data(phone_number)
        if data.get("fecha"):
            print(f"💾 Guardado como: {data.get('fecha')}")
            if data.get("fecha_confirmada"):
                print(f"✨ Confirmación: {data.get('fecha_confirmada')}")
        
        # Reset para siguiente usuario
        chatbot.db.reset_user_conversation(phone_number)
        print("-" * 50)

if __name__ == "__main__":
    test_natural_date_parsing()
    test_date_conversation_flow() 
    test_multiple_date_formats()
