#!/usr/bin/env python3
"""
Test del flujo completo de chatbot para confirmar que 18:00 funciona
"""

import sys
import os
from dotenv import load_dotenv

# Configurar variables de entorno mínimas
os.environ["GEMINI_API_KEY"] = "test_key"
os.environ["MONGODB_URL"] = "mongodb://localhost:27017"

# Importar después de configurar env vars
try:
    from services.chatbot_service import ToyotaChatbotService
    from models.user import UserData
    print("✅ Importaciones exitosas")
except Exception as e:
    print(f"❌ Error en importaciones: {e}")
    sys.exit(1)

def test_chatbot_flow():
    """Test del flujo completo con datos reales"""
    print("\n=== PRUEBA DEL FLUJO DE CHATBOT ===")
    
    try:
        chatbot = ToyotaChatbotService()
        phone = "+1234567890"
        
        # Reset inicial
        chatbot.db.reset_user_conversation(phone)
        print("🔄 Conversación reseteada")
        
        # Simular datos previos en la conversación
        user_data = UserData(
            phone_number=phone,
            conversation_data={
                "nombre": "Juan Morales",
                "email": "juan@test.com", 
                "vehiculo_interes": "Corolla",
                "fecha": "28 de julio",
                "hora": "18:00"
            },
            current_step="confirmar_cita"
        )
        
        # Guardar datos del usuario
        chatbot.db.save_user_data(user_data)
        print("💾 Datos de usuario guardados")
        
        # Probar confirmación
        message = "Sí, confirmo"
        print(f"🗣️  Usuario: {message}")
        
        response = chatbot.process_message(phone, message)
        print(f"🤖 Bot: {response}")
        
        # Verificar si la cita se creó
        appointments = chatbot.db.get_user_appointments(phone)
        print(f"\n📅 Citas encontradas: {len(appointments)}")
        
        if appointments:
            for apt in appointments:
                print(f"   • {apt.customer_name} - {apt.preferred_date} - {apt.preferred_time}")
                if apt.preferred_time == "18:00":
                    print("✅ ÉXITO: Cita creada con hora 18:00")
                else:
                    print(f"⚠️  Hora inesperada: {apt.preferred_time}")
        else:
            print("❌ No se crearon citas")
            
    except Exception as e:
        print(f"❌ Error en test: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_chatbot_flow()
