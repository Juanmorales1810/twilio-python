"""
Pruebas básicas para el chatbot de Toyota
Ejecuta: python test_chatbot.py
"""

import os
import sys
from datetime import datetime
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

def test_environment():
    """Prueba las variables de entorno"""
    print("🧪 Probando variables de entorno...")
    
    required_vars = [
        "TWILIO_ACCOUNT_SID",
        "TWILIO_AUTH_TOKEN", 
        "TWILIO_PHONE_NUMBER",
        "MONGODB_URL",
        "GEMINI_API_KEY"
    ]
    
    missing = []
    for var in required_vars:
        if not os.getenv(var):
            missing.append(var)
    
    if missing:
        print(f"❌ Variables faltantes: {', '.join(missing)}")
        return False
    
    print("✅ Variables de entorno OK")
    return True


def test_database_connection():
    """Prueba la conexión a la base de datos"""
    print("🧪 Probando conexión a base de datos...")
    
    try:
        from database.connection import DatabaseManager
        db = DatabaseManager()
        
        # Prueba básica de conexión
        db.db.command('ping')
        print("✅ Conexión a MongoDB OK")
        return True
        
    except Exception as e:
        print(f"❌ Error de conexión a MongoDB: {str(e)}")
        return False


def test_models():
    """Prueba los modelos de datos"""
    print("🧪 Probando modelos de datos...")
    
    try:
        from models.user import UserData, Appointment, ConversationMessage
        from models.message import BotResponse
        
        # Crear instancias de prueba
        user = UserData(phone_number="+5215551234567")
        response = BotResponse(response_text="Test", next_step="test")
        
        print("✅ Modelos de datos OK")
        return True
        
    except Exception as e:
        print(f"❌ Error en modelos: {str(e)}")
        return False


def test_services():
    """Prueba los servicios principales"""
    print("🧪 Probando servicios...")
    
    try:
        from services.toyota_service import ToyotaVehicleService
        
        toyota_service = ToyotaVehicleService()
        
        # Probar obtención de vehículos
        vehicles = toyota_service.get_all_vehicles()
        assert len(vehicles) > 0, "No hay vehículos configurados"
        
        # Probar búsqueda específica
        corolla = toyota_service.get_vehicle_info("corolla")
        assert corolla is not None, "No se encontró información del Corolla"
        
        print("✅ Servicios OK")
        return True
        
    except Exception as e:
        print(f"❌ Error en servicios: {str(e)}")
        return False


def test_validators():
    """Prueba las utilidades de validación"""
    print("🧪 Probando validadores...")
    
    try:
        from utils.validators import validate_email, validate_date, validate_time
        
        # Probar validación de email
        assert validate_email("test@example.com") == True
        assert validate_email("invalid-email") == False
        
        # Probar validación de fecha
        assert validate_date("25/12/2024") is not None
        assert validate_date("invalid-date") is None
        
        # Probar validación de hora
        assert validate_time("10:30") is not None
        assert validate_time("25:70") is None
        
        print("✅ Validadores OK")
        return True
        
    except Exception as e:
        print(f"❌ Error en validadores: {str(e)}")
        return False


def test_chatbot_flow():
    """Prueba el flujo básico del chatbot"""
    print("🧪 Probando flujo del chatbot...")
    
    try:
        # Solo probar si la base de datos está disponible
        if not test_database_connection():
            print("⚠️ Saltando prueba de chatbot (sin DB)")
            return True
            
        from services.chatbot_service import ToyotaChatbotService
        
        chatbot = ToyotaChatbotService()
        
        # Simular inicio de conversación
        test_phone = "+5215551234567"
        response = chatbot.process_message(test_phone, "Hola")
        
        assert len(response) > 0, "Respuesta vacía del chatbot"
        assert "Toyota" in response, "Respuesta no contiene marca Toyota"
        
        # Limpiar datos de prueba
        chatbot.db.reset_user_conversation(test_phone)
        
        print("✅ Flujo del chatbot OK")
        return True
        
    except Exception as e:
        print(f"❌ Error en chatbot: {str(e)}")
        return False


def test_api_endpoints():
    """Prueba que la API se pueda importar correctamente"""
    print("🧪 Probando endpoints de API...")
    
    try:
        from main import app
        from routers.routerBot import routerBotWhatsApp
        
        assert app is not None, "App principal no se pudo crear"
        assert routerBotWhatsApp is not None, "Router del bot no se pudo crear"
        
        print("✅ Endpoints de API OK")
        return True
        
    except Exception as e:
        print(f"❌ Error en API: {str(e)}")
        return False


def run_all_tests():
    """Ejecuta todas las pruebas"""
    print("🚀 INICIANDO PRUEBAS DEL CHATBOT TOYOTA")
    print("=" * 50)
    
    tests = [
        ("Variables de entorno", test_environment),
        ("Modelos de datos", test_models),
        ("Validadores", test_validators),
        ("Servicios Toyota", test_services),
        ("Conexión BD", test_database_connection),
        ("API Endpoints", test_api_endpoints),
        ("Flujo del chatbot", test_chatbot_flow),
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
    
    print("\n" + "=" * 50)
    print(f"📊 RESULTADOS:")
    print(f"   ✅ Pruebas exitosas: {passed}")
    print(f"   ❌ Pruebas fallidas: {failed}")
    print(f"   📈 Total: {passed + failed}")
    
    if failed == 0:
        print("\n🎉 ¡Todas las pruebas pasaron exitosamente!")
        return True
    else:
        print(f"\n⚠️ {failed} pruebas fallaron. Revisa la configuración.")
        return False


def run_quick_test():
    """Ejecuta una prueba rápida sin base de datos"""
    print("⚡ PRUEBA RÁPIDA (sin base de datos)")
    print("=" * 40)
    
    quick_tests = [
        ("Variables de entorno", test_environment),
        ("Modelos de datos", test_models),
        ("Validadores", test_validators),
        ("Servicios Toyota", test_services),
        ("API Endpoints", test_api_endpoints),
    ]
    
    for test_name, test_func in quick_tests:
        print(f"\n🔍 {test_name}:")
        test_func()


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--quick":
        run_quick_test()
    else:
        success = run_all_tests()
        sys.exit(0 if success else 1)
