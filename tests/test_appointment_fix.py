"""
Script para probar el flujo de prueba de manejo que estaba fallando
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

def simulate_conversation():
    """Simula la conversación que estaba fallando"""
    
    try:
        chatbot = ToyotaChatbotService()
        phone_number = "+1234567890test"
        
        print("🧪 SIMULANDO CONVERSACIÓN PROBLEMÁTICA")
        print("=" * 50)
        
        # Secuencia de mensajes del usuario real
        messages = [
            "Hola",
            "1",  # Ver vehículos
            "Me gusta el Corolla",  # Consultar Corolla específico
            "Si quiero agendar una prueba de manejo"  # Este era el mensaje problemático
        ]
        
        for i, message in enumerate(messages, 1):
            print(f"\n👤 Usuario (paso {i}): {message}")
            
            try:
                response = chatbot.process_message(phone_number, message)
                print(f"🤖 Bot: {response[:200]}...")
                
                if i == 4:  # El mensaje problemático
                    if "nombre" in response.lower() or "agendar" in response.lower():
                        print("✅ ¡ÉXITO! El bot ahora detecta correctamente la intención de agendar")
                    else:
                        print("❌ FALLO: El bot aún no detecta la intención de agendar")
                        print(f"Respuesta completa: {response}")
                        
            except Exception as e:
                print(f"❌ Error procesando mensaje: {str(e)}")
                return False
        
        # Limpiar datos de prueba
        chatbot.db.reset_user_conversation(phone_number)
        print("\n🧹 Datos de prueba limpiados")
        return True
        
    except Exception as e:
        print(f"❌ Error general: {str(e)}")
        return False

def test_appointment_keywords():
    """Prueba diferentes variaciones de palabras para agendar cita"""
    
    print("\n🧪 PROBANDO PALABRAS CLAVE PARA AGENDAR")
    print("=" * 50)
    
    try:
        chatbot = ToyotaChatbotService()
        phone_number = "+1234567891test"
        
        # Configurar usuario en estado de consulta de vehículos
        user_data = UserData(phone_number=phone_number, current_step="consulta_vehiculos")
        chatbot.db.save_user_data(user_data)
        
        test_phrases = [
            "Si quiero agendar una prueba de manejo",
            "Me gustaría agendar una cita",
            "Quiero probar el carro",
            "Puedo hacer una prueba?",
            "Me interesa ir a la agencia",
            "Agendar visita"
        ]
        
        for phrase in test_phrases:
            print(f"\n👤 Probando: '{phrase}'")
            
            response = chatbot.process_message(phone_number, phrase)
            
            if any(word in response.lower() for word in ["nombre", "datos", "ayudo", "agendar tu cita"]):
                print("✅ DETECTADO: Reconoce intención de agendar")
            else:
                print("❌ NO DETECTADO: No reconoce intención de agendar")
                print(f"   Respuesta: {response[:100]}...")
        
        # Limpiar
        chatbot.db.reset_user_conversation(phone_number)
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def main():
    """Ejecuta todas las pruebas"""
    
    print("🚀 PROBANDO CORRECCIÓN DEL FLUJO DE AGENDAMIENTO")
    print("=" * 60)
    
    # Probar conversación problemática original
    success1 = simulate_conversation()
    
    # Probar diferentes palabras clave
    success2 = test_appointment_keywords()
    
    print("\n" + "=" * 60)
    print("📊 RESULTADOS FINALES:")
    print(f"   Conversación original: {'✅ CORREGIDA' if success1 else '❌ AÚN FALLA'}")
    print(f"   Detección de palabras clave: {'✅ FUNCIONA' if success2 else '❌ FALLA'}")
    
    if success1 and success2:
        print("\n🎉 ¡TODAS LAS PRUEBAS EXITOSAS!")
        print("El problema del flujo de agendamiento ha sido corregido.")
    else:
        print("\n⚠️ Algunas pruebas fallaron. Revisar la lógica.")

if __name__ == "__main__":
    main()
