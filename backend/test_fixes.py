"""
Script simple para probar las correcciones del sistema conversacional
"""

import sys
import os

# Agregar el directorio padre al path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_date_parser():
    """Probar el parser de fechas con los casos problemáticos"""
    print("🧪 PROBANDO PARSER DE FECHAS")
    print("="*50)
    
    try:
        from utils.date_parser import DateParser
        
        parser = DateParser(timezone="America/Santiago")
        
        test_cases = [
            "mañana a las 10",
            "mañana a las 10:00",
            "el lunes a las 14:00",
            "el lunes a las 14"
        ]
        
        for case in test_cases:
            print(f"📝 Probando: '{case}'")
            result, explanation = parser.parse_natural_date(case)
            
            if result:
                print(f"   ✅ {explanation}")
            else:
                print(f"   ❌ {explanation}")
            print()
            
    except Exception as e:
        print(f"❌ Error: {e}")

def test_conversational_flow():
    """Probar el flujo conversacional básico"""
    print("💬 PROBANDO FLUJO CONVERSACIONAL")
    print("="*50)
    
    try:
        from services.conversational_service import conversational_service
        
        test_phone = "+56987654321"
        
        # Secuencia de prueba
        messages = [
            "Hola",
            "Quiero una cita", 
            "Juan Test",
            "mañana a las 10:00",
            "cambiar",
            "consulta de prueba",
            "sí"
        ]
        
        for i, msg in enumerate(messages, 1):
            print(f"👤 {i}. Usuario: {msg}")
            try:
                response = conversational_service.process_message(test_phone, msg)
                print(f"🤖 Bot: {response.message[:100]}...")
                print(f"📊 Estado: {response.state}")
                
                if response.appointment_created:
                    print(f"🎉 ¡Cita creada! ID: {response.appointment_id}")
                    break
                    
            except Exception as e:
                print(f"   ❌ Error: {e}")
            print("-" * 30)
            
    except Exception as e:
        print(f"❌ Error al importar servicio: {e}")

if __name__ == "__main__":
    print("🔧 SCRIPT DE PRUEBAS - CORRECCIONES")
    print("="*60)
    
    # Probar parser de fechas
    test_date_parser()
    
    # Probar flujo conversacional
    test_conversational_flow()
    
    print("\n✅ Pruebas completadas")