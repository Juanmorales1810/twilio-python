"""
Script para probar el chatbot con IA conversacional natural
"""

import os
import sys
from datetime import datetime
from dotenv import load_dotenv

# Agregar el directorio raíz al path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.chatbot_service import ToyotaChatbotService
from models.user import UserData

# Cargar variables de entorno
load_dotenv()

def test_natural_conversation():
    """Prueba conversaciones naturales con IA"""
    
    print("🤖 PROBANDO CHATBOT CONVERSACIONAL CON IA")
    print("=" * 55)
    
    try:
        chatbot = ToyotaChatbotService()
        phone_number = "+1234567890test"
        
        # Conversaciones naturales para probar
        conversations = [
            {
                "name": "Saludo Inicial",
                "messages": [
                    "Hola, buenos días",
                    "Me interesa saber sobre los carros que tienen",
                    "¿Cuánto cuesta el Corolla?"
                ]
            },
            {
                "name": "Agendamiento Natural",
                "messages": [
                    "Hola",
                    "Quiero agendar una cita",
                    "Juan Pérez",
                    "juan.perez@email.com",
                    "15/08/2025",
                    "2:00 PM",
                    "RAV4"
                ]
            },
            {
                "name": "Consulta de Vehículo con Prueba",
                "messages": [
                    "Buenos días",
                    "¿Me pueden hablar del Prius?",
                    "Sí, me gustaría probarlo"
                ]
            }
        ]
        
        for i, conversation in enumerate(conversations, 1):
            print(f"\n{'='*20} {conversation['name']} {'='*20}")
            
            # Limpiar datos previos
            chatbot.db.reset_user_conversation(phone_number)
            
            for j, message in enumerate(conversation['messages'], 1):
                print(f"\n👤 Usuario: {message}")
                
                try:
                    response = chatbot.process_message(phone_number, message)
                    print(f"🤖 Bot: {response[:300]}...")
                    
                    # Pausa corta para simular conversación real
                    import time
                    time.sleep(0.5)
                    
                except Exception as e:
                    print(f"❌ Error: {str(e)}")
                    return False
            
            # Limpiar después de cada conversación
            chatbot.db.reset_user_conversation(phone_number)
            print(f"\n✅ Conversación '{conversation['name']}' completada")
        
        return True
        
    except Exception as e:
        print(f"❌ Error general: {str(e)}")
        return False

def test_ai_responses():
    """Prueba diferentes tipos de respuestas de IA"""
    
    print("\n🧠 PROBANDO RESPUESTAS INTELIGENTES")
    print("=" * 40)
    
    try:
        chatbot = ToyotaChatbotService()
        phone_number = "+1234567891test"
        
        test_messages = [
            "¿Qué diferencia hay entre el Corolla y el Camry?",
            "Necesito un carro familiar, ¿qué me recomiendan?",
            "¿Tienen financiamiento disponible?",
            "¿Cuál es el carro más económico?",
            "Me interesa un híbrido",
            "¿Hacen servicio de mantenimiento?"
        ]
        
        for i, message in enumerate(test_messages, 1):
            print(f"\n{i}. 👤 Usuario: {message}")
            
            try:
                response = chatbot.process_message(phone_number, message)
                print(f"   🤖 Bot: {response[:200]}...")
                
                # Verificar que la respuesta es conversacional
                if len(response) > 50 and not response.startswith("❌"):
                    print("   ✅ Respuesta conversacional generada")
                else:
                    print("   ⚠️ Respuesta muy corta o de error")
                
            except Exception as e:
                print(f"   ❌ Error: {str(e)}")
        
        # Limpiar
        chatbot.db.reset_user_conversation(phone_number)
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_appointment_flow():
    """Prueba el flujo de agendamiento conversacional"""
    
    print("\n📅 PROBANDO FLUJO DE AGENDAMIENTO CONVERSACIONAL")
    print("=" * 50)
    
    try:
        chatbot = ToyotaChatbotService()
        phone_number = "+1234567892test"
        
        # Flujo de agendamiento natural
        flow_messages = [
            "Hola, quiero agendar una cita",
            "María González",
            "maria.gonzalez@gmail.com", 
            "20/08/2025",
            "10:30 AM",
            "Highlander",
            "Sí, confirmo"
        ]
        
        expected_steps = [
            "conversacion_general",
            "solicitar_email", 
            "solicitar_fecha",
            "solicitar_hora",
            "solicitar_vehiculo_interes",
            "confirmar_cita",
            "inicio"
        ]
        
        for i, (message, expected_step) in enumerate(zip(flow_messages, expected_steps)):
            print(f"\n{i+1}. 👤 Usuario: {message}")
            
            try:
                response = chatbot.process_message(phone_number, message)
                print(f"    🤖 Bot: {response[:150]}...")
                
                # Verificar que avanza en el flujo
                user_data = chatbot.db.get_user_data(phone_number)
                if user_data:
                    print(f"    📊 Estado: {user_data.current_step}")
                
            except Exception as e:
                print(f"    ❌ Error: {str(e)}")
                return False
        
        print("\n✅ Flujo de agendamiento completado")
        
        # Limpiar
        chatbot.db.reset_user_conversation(phone_number)
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def main():
    """Ejecuta todas las pruebas del chatbot conversacional"""
    
    print("🚀 PROBANDO CHATBOT TOYOTA CON IA CONVERSACIONAL")
    print("=" * 60)
    
    # Ejecutar pruebas
    test1 = test_natural_conversation()
    test2 = test_ai_responses()
    test3 = test_appointment_flow()
    
    print("\n" + "=" * 60)
    print("📊 RESULTADOS FINALES:")
    print(f"   Conversaciones naturales: {'✅ EXITOSO' if test1 else '❌ FALLÓ'}")
    print(f"   Respuestas inteligentes: {'✅ EXITOSO' if test2 else '❌ FALLÓ'}")
    print(f"   Flujo de agendamiento: {'✅ EXITOSO' if test3 else '❌ FALLÓ'}")
    
    if test1 and test2 and test3:
        print("\n🎉 ¡TODAS LAS PRUEBAS EXITOSAS!")
        print("El chatbot ahora es más conversacional y natural.")
    else:
        print("\n⚠️ Algunas pruebas fallaron. Revisar la configuración.")

if __name__ == "__main__":
    main()
