#!/usr/bin/env python3
"""
Prueba específica para el caso reportado por el usuario
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


import os
from dotenv import load_dotenv
from services.chatbot_service import ToyotaChatbotService

load_dotenv()

def test_reported_issue():
    """Prueba el caso específico reportado por el usuario"""
    
    chatbot = ToyotaChatbotService()
    phone_number = "+1234567890"
    
    # Reset conversation
    chatbot.db.reset_user_conversation(phone_number)
    
    print("=== PRUEBA DEL CASO REPORTADO ===\n")
    
    # Simular exactamente la conversación reportada
    conversation = [
        ("Usuario", "Hola"),
        ("Usuario", "Estoy buscando información"),
        ("Usuario", "Me interesa el Corolla"),
        ("Usuario", "Quiero me des información técnica sobre el auto"),
        ("Usuario", "Quiero agendar una prueba de manejo"),
        ("Usuario", "Soy Juan Morales y mí correo es juan@uncorreo.com"),
        ("Usuario", "Quiero hacer una prueba de manejo"),
        ("Usuario", "Podemos hacerlo para el lunes de la semana que viene?")
    ]
    
    for i, (speaker, message) in enumerate(conversation, 1):
        print(f"Paso {i}")
        print(f"🗣️  {speaker}: {message}")
        
        response = chatbot.process_message(phone_number, message)
        
        print(f"🤖 Bot: {response}")
        
        # Verificar que no hay mensaje de error de email
        is_error = "❌ El formato del correo no es válido" in response
        
        if is_error:
            print("❌ ERROR DETECTADO: Validación incorrecta de email")
        else:
            print("✅ Respuesta correcta")
            
        # Mostrar estado interno
        user_data = chatbot.db.get_user_data(phone_number)
        if user_data:
            print(f"📊 Estado: {user_data.current_step}")
            print(f"📋 Datos: {user_data.conversation_data}")
        
        print("=" * 60)
        print()

if __name__ == "__main__":
    test_reported_issue()
