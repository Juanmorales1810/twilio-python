#!/usr/bin/env python3
"""
Prueba del escenario específico: "Podemos hacerlo para el lunes de la semana que viene?"
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


import os
from datetime import datetime
from dotenv import load_dotenv
from services.chatbot_service import ToyotaChatbotService

load_dotenv()

def test_specific_scenario():
    """Prueba el escenario exacto del usuario"""
    
    chatbot = ToyotaChatbotService()
    phone_number = "+1234567890"
    
    # Reset conversation
    chatbot.db.reset_user_conversation(phone_number)
    
    print("=== PRUEBA DEL ESCENARIO ESPECÍFICO ===\n")
    print(f"📅 Contexto actual: {datetime.now().strftime('%A, %d de %B de %Y')}")
    print("🎯 Objetivo: Probar 'Podemos hacerlo para el lunes de la semana que viene?'\n")
    
    # Simular la conversación exacta pero con el nuevo sistema
    conversation = [
        ("Usuario", "Hola"),
        ("Usuario", "Estoy buscando información"),
        ("Usuario", "Me interesa el Corolla"), 
        ("Usuario", "Quiero me des información técnica sobre el auto"),
        ("Usuario", "Quiero agendar una prueba de manejo"),
        ("Usuario", "Soy Juan Morales y mí correo es juan@uncorreo.com"),
        ("Usuario", "Quiero hacer una prueba de manejo"),
        ("Usuario", "Podemos hacerlo para el lunes de la semana que viene?")  # ← Frase clave
    ]
    
    for i, (speaker, message) in enumerate(conversation, 1):
        print(f"Paso {i}")
        print(f"🗣️  {speaker}: {message}")
        
        response = chatbot.process_message(phone_number, message)
        print(f"🤖 Bot: {response}")
        
        # Mostrar parseo de fecha si es el paso clave
        if "lunes de la semana que viene" in message:
            parsed_date = chatbot._parse_natural_date(message)
            if parsed_date:
                formatted = chatbot._format_date_confirmation(parsed_date)
                standard = parsed_date.strftime("%d/%m/%Y")
                print(f"🔍 PARSEO EXITOSO:")
                print(f"   • Texto original: '{message}'")
                print(f"   • Fecha calculada: {formatted}")
                print(f"   • Formato estándar: {standard}")
            else:
                print("❌ No se pudo parsear la fecha")
        
        # Mostrar datos guardados
        user_data = chatbot.get_user_appointment_data(phone_number)
        print(f"💾 Datos guardados:")
        for key, value in user_data.items():
            if value and key != 'current_step':
                print(f"   • {key}: {value}")
        
        print("=" * 70)
        print()

def test_date_parsing_variations():
    """Prueba diferentes variaciones de la misma frase"""
    
    chatbot = ToyotaChatbotService()
    
    print("=== PRUEBA DE VARIACIONES DE FECHA ===\n")
    
    variations = [
        "el lunes de la semana que viene",
        "el lunes que viene", 
        "el próximo lunes",
        "el lunes de la siguiente semana",
        "podemos hacerlo el lunes que viene",
        "me gustaría el lunes de la próxima semana"
    ]
    
    for phrase in variations:
        print(f"🗣️  '{phrase}'")
        
        parsed_date = chatbot._parse_natural_date(phrase)
        if parsed_date:
            formatted = chatbot._format_date_confirmation(parsed_date)
            standard = parsed_date.strftime("%d/%m/%Y")
            print(f"✅ → {formatted} ({standard})")
        else:
            print("❌ → No se pudo parsear")
        
        print()

if __name__ == "__main__":
    test_specific_scenario()
    print("\n" + "="*80 + "\n")
    test_date_parsing_variations()
