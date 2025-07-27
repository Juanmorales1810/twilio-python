"""
Pruebas del webhook de WhatsApp
Ejecuta: python test_webhook.py
"""

import requests
import json
from datetime import datetime

# Configuración
BASE_URL = "http://localhost:8000"
TEST_PHONE = "+5215551234567"

def test_webhook_basic():
    """Prueba básica del webhook"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

    print("🧪 Probando webhook básico...")
    
    url = f"{BASE_URL}/bot/whatsapp"
    data = {
        "From": f"whatsapp:{TEST_PHONE}",
        "Body": "Hola"
    }
    
    try:
        response = requests.post(url, data=data)
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text[:200]}...")
        
        if response.status_code == 200 and "Toyota" in response.text:
            print("✅ Webhook básico funcionando")
            return True
        else:
            print("❌ Webhook no está funcionando correctamente")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ No se puede conectar al servidor")
        print("   Asegúrate de que el servidor esté ejecutándose:")
        print("   python main.py")
        return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False


def test_conversation_flow():
    """Prueba el flujo completo de conversación"""
    print("\n🧪 Probando flujo de conversación...")
    
    url = f"{BASE_URL}/bot/whatsapp"
    
    # Secuencia de mensajes para agendar una cita
    messages = [
        "Hola",
        "2",  # Agendar cita
        "Juan Pérez",  # Nombre
        "juan@test.com",  # Email
        "25/12/2024",  # Fecha
        "10:30",  # Hora
        "Corolla",  # Vehículo
        "Sí"  # Confirmación
    ]
    
    for i, message in enumerate(messages):
        print(f"   Paso {i+1}: Enviando '{message}'")
        
        data = {
            "From": f"whatsapp:{TEST_PHONE}",
            "Body": message
        }
        
        try:
            response = requests.post(url, data=data)
            if response.status_code == 200:
                # Extraer respuesta del XML TwiML
                response_text = response.text
                if "<Body>" in response_text:
                    start = response_text.find("<Body>") + 6
                    end = response_text.find("</Body>")
                    bot_response = response_text[start:end]
                    print(f"   Bot: {bot_response[:100]}...")
                else:
                    print(f"   Bot: {response_text[:100]}...")
            else:
                print(f"   ❌ Error {response.status_code}")
                return False
                
        except Exception as e:
            print(f"   ❌ Error: {str(e)}")
            return False
    
    print("✅ Flujo de conversación completado")
    return True


def test_vehicle_info():
    """Prueba consulta de información de vehículos"""
    print("\n🧪 Probando consulta de vehículos...")
    
    url = f"{BASE_URL}/bot/whatsapp"
    
    # Reset y luego consultar vehículos
    messages = [
        "inicio",
        "1",  # Ver vehículos
        "Corolla"  # Preguntar por Corolla específicamente
    ]
    
    for message in messages:
        data = {
            "From": f"whatsapp:{TEST_PHONE}_vehicles",  # Usar número diferente
            "Body": message
        }
        
        try:
            response = requests.post(url, data=data)
            if response.status_code == 200:
                print(f"   ✓ Respuesta para '{message}': OK")
            else:
                print(f"   ❌ Error para '{message}': {response.status_code}")
                return False
                
        except Exception as e:
            print(f"   ❌ Error: {str(e)}")
            return False
    
    print("✅ Consulta de vehículos funcionando")
    return True


def test_api_endpoints():
    """Prueba otros endpoints de la API"""
    print("\n🧪 Probando endpoints adicionales...")
    
    # Health check
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("   ✓ Health check: OK")
        else:
            print(f"   ❌ Health check falló: {response.status_code}")
            
    except Exception as e:
        print(f"   ❌ Health check error: {str(e)}")
    
    # Root endpoint
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            print("   ✓ Root endpoint: OK")
        else:
            print(f"   ❌ Root endpoint falló: {response.status_code}")
            
    except Exception as e:
        print(f"   ❌ Root endpoint error: {str(e)}")
    
    # Appointments endpoint (debería requerir teléfono válido)
    try:
        response = requests.get(f"{BASE_URL}/bot/appointments/{TEST_PHONE}")
        if response.status_code in [200, 404]:  # OK o Not Found son válidos
            print("   ✓ Appointments endpoint: OK")
        else:
            print(f"   ❌ Appointments endpoint falló: {response.status_code}")
            
    except Exception as e:
        print(f"   ❌ Appointments endpoint error: {str(e)}")


def cleanup_test_data():
    """Limpia datos de prueba"""
    print("\n🧹 Limpiando datos de prueba...")
    
    test_phones = [TEST_PHONE, f"{TEST_PHONE}_vehicles"]
    
    for phone in test_phones:
        try:
            response = requests.delete(f"{BASE_URL}/bot/conversation/{phone}")
            if response.status_code == 200:
                print(f"   ✓ Limpiado: {phone}")
            else:
                print(f"   ⚠️ No se pudo limpiar: {phone}")
                
        except Exception as e:
            print(f"   ⚠️ Error limpiando {phone}: {str(e)}")


def simulate_webhook_call():
    """Simula una llamada real de webhook de Twilio"""
    print("\n📞 Simulando llamada real de webhook...")
    
    # Headers típicos de Twilio
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'TwilioProxy/1.1',
        'X-Twilio-Signature': 'dummy_signature'  # En producción, esto se valida
    }
    
    # Datos típicos de Twilio
    webhook_data = {
        'MessageSid': 'SM' + 'x' * 32,
        'AccountSid': 'AC' + 'x' * 32,
        'MessagingServiceSid': '',
        'From': f'whatsapp:{TEST_PHONE}',
        'To': 'whatsapp:+14155238886',
        'Body': 'Hola, quiero información sobre autos Toyota',
        'NumMedia': '0',
        'ProfileName': 'Juan Test',
        'WaId': TEST_PHONE.replace('+', ''),
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/bot/whatsapp",
            headers=headers,
            data=webhook_data
        )
        
        print(f"   Status: {response.status_code}")
        print(f"   Content-Type: {response.headers.get('content-type', 'N/A')}")
        
        if response.status_code == 200 and 'xml' in response.headers.get('content-type', ''):
            print("   ✅ Respuesta TwiML válida")
            print(f"   Respuesta: {response.text[:200]}...")
            return True
        else:
            print("   ❌ Respuesta inválida")
            return False
            
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return False


def main():
    """Ejecuta todas las pruebas"""
    print("🚀 INICIANDO PRUEBAS DE WEBHOOK")
    print("=" * 50)
    
    tests = [
        ("Webhook básico", test_webhook_basic),
        ("Endpoints API", test_api_endpoints),
        ("Simulación webhook real", simulate_webhook_call),
        ("Información de vehículos", test_vehicle_info),
        ("Flujo de conversación", test_conversation_flow),
    ]
    
    passed = 0
    failed = 0
    
    for test_name, test_func in tests:
        print(f"\n🔍 {test_name}:")
        try:
            if test_func():
                passed += 1
            else:
                failed += 1
        except Exception as e:
            print(f"❌ Error inesperado: {str(e)}")
            failed += 1
    
    # Limpiar datos de prueba
    cleanup_test_data()
    
    print("\n" + "=" * 50)
    print(f"📊 RESULTADOS:")
    print(f"   ✅ Pruebas exitosas: {passed}")
    print(f"   ❌ Pruebas fallidas: {failed}")
    print(f"   📈 Total: {passed + failed}")
    
    if failed == 0:
        print("\n🎉 ¡Todas las pruebas del webhook pasaron!")
        print("\n💡 Para probar con WhatsApp real:")
        print("   1. Configura ngrok: ngrok http 8000")
        print("   2. Actualiza webhook en Twilio Console")
        print("   3. Envía mensajes desde WhatsApp")
    else:
        print(f"\n⚠️ {failed} pruebas fallaron.")
        print("   Verifica que el servidor esté ejecutándose:")
        print("   python main.py")


if __name__ == "__main__":
    main()
