#!/usr/bin/env python3
"""
Prueba del flujo de reservas del chatbot Toyota
Simula la conversación que reportó el usuario para verificar que funciona correctamente
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


import os
from dotenv import load_dotenv
from services.chatbot_service import ToyotaChatbotService

load_dotenv()

def test_appointment_flow():
    """Prueba el flujo completo de reserva"""
    
    # Crear instancia del chatbot
    chatbot = ToyotaChatbotService()
    
    # Número de teléfono de prueba
    phone_number = "+1234567890"
    
    # Reset conversation before testing
    chatbot.db.reset_user_conversation(phone_number)
    
    print("=== PRUEBA DEL FLUJO DE RESERVAS ===\n")
    
    # Simular la conversación reportada
    messages = [
        "Hola",
        "Estoy buscando información", 
        "Me interesa el Corolla",
        "Quiero me des información técnica sobre el auto",
        "Quiero agendar una prueba de manejo",
        "Soy Juan Morales y mí correo es juan@uncorreo.com",
        "Quiero hacer una prueba de manejo",
        "Podemos hacerlo para el lunes de la semana que viene?"
    ]
    
    for i, message in enumerate(messages, 1):
        print(f"🗣️  Usuario: {message}")
        
        # Procesar mensaje
        response = chatbot.process_message(phone_number, message)
        
        print(f"🤖 Bot: {response}")
        print("-" * 50)
        
        # Mostrar estado interno después de cada mensaje
        user_data = chatbot.db.get_user_data(phone_number)
        if user_data:
            print(f"📊 Estado: {user_data.current_step}")
            print(f"📋 Datos: {user_data.conversation_data}")
        print("=" * 50)
        print()

if __name__ == "__main__":
    test_appointment_flow()
