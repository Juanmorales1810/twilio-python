"""
Script de prueba simple para debuggear la IA
"""

import os
import sys
from dotenv import load_dotenv

# Agregar el directorio raíz al path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.chatbot_service import ToyotaChatbotService

# Cargar variables de entorno
load_dotenv()

def test_ai_debug():
    """Prueba simple para debuggear la IA"""
    
    print("🔍 DEBUGGEANDO INTEGRACIÓN CON GEMINI")
    print("=" * 45)
    
    try:
        # Verificar variables de entorno
        api_key = os.getenv("GEMINI_API_KEY")
        model_name = os.getenv("GEMINI_MODEL", "gemini-pro")
        
        print(f"API Key: {'✅ Configurada' if api_key else '❌ No encontrada'}")
        print(f"Modelo: {model_name}")
        
        if not api_key:
            print("❌ No se encontró GEMINI_API_KEY en .env")
            return False
        
        # Crear chatbot
        chatbot = ToyotaChatbotService()
        
        # Probar directamente el agente de IA
        print("\n🤖 Probando agente de IA directamente...")
        
        try:
            response = chatbot.agent.run_sync("Responde con un saludo simple para Toyota San Juan")
            print(f"✅ Respuesta IA: {response.data}")
        except Exception as e:
            print(f"❌ Error IA: {str(e)}")
            return False
        
        # Probar conversación completa
        print("\n💬 Probando conversación completa...")
        
        try:
            response = chatbot.process_message("+123test", "Hola")
            print(f"✅ Respuesta chatbot: {response[:200]}")
        except Exception as e:
            print(f"❌ Error chatbot: {str(e)}")
            return False
        
        return True
        
    except Exception as e:
        print(f"❌ Error general: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_ai_debug()
    print(f"\n{'✅ ÉXITO' if success else '❌ FALLO'}: {'IA funcionando correctamente' if success else 'Hay problemas con la IA'}")
