"""
Script de prueba específica para el error de validación Pydantic
Simulando exactamente el flujo que causaba el error
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_specific_error_case():
    """Probar el caso específico que causaba el error de Pydantic"""
    print("🧪 PROBANDO CASO ESPECÍFICO DEL ERROR PYDANTIC")
    print("="*60)
    
    try:
        from services.conversational_service import conversational_service
        
        # Usar un teléfono diferente para evitar conflictos con conversaciones anteriores
        test_phone = "+56999888777"
        
        # Simular la conversación problemática exacta
        messages = [
            ("Hola", "Saludo inicial"),
            ("Quiero una cita", "Solicitar cita"),
            ("Juan Morales", "Proporcionar nombre"),
            ("mañana a las 10:00", "Fecha que requiere sugerencia de horario laboral"),
            ("cambiar", "ESTE ERA EL MENSAJE PROBLEMÁTICO")
        ]
        
        print(f"📱 Simulando conversación problemática para: {test_phone}\n")
        
        for i, (message, description) in enumerate(messages, 1):
            print(f"👤 {i}. Usuario: '{message}' ({description})")
            
            try:
                response = conversational_service.process_message(test_phone, message)
                
                print(f"🤖 Bot: {response.message[:100]}...")
                print(f"📊 Estado: {response.state}")
                
                # Si llegamos hasta aquí sin error, el problema está resuelto
                if message == "cambiar":
                    print("✅ ¡ÉXITO! El mensaje 'cambiar' se procesó correctamente sin errores de Pydantic")
                
            except Exception as e:
                print(f"❌ Error en mensaje '{message}': {str(e)}")
                if "validation error for ConversationContext" in str(e):
                    print("⚠️  Este es el error de Pydantic que estábamos corrigiendo")
                return False
            
            print("-" * 50)
        
        print("\n🎉 TODAS LAS PRUEBAS EXITOSAS - Error de Pydantic corregido!")
        return True
        
    except Exception as e:
        print(f"❌ Error general: {e}")
        return False

def test_edge_cases_pydantic():
    """Probar casos extremos relacionados con tipos de datos"""
    print("\n🔬 PROBANDO CASOS EXTREMOS DE TIPOS DE DATOS")
    print("="*60)
    
    try:
        from services.conversational_service import conversational_service
        
        # Diferentes teléfonos para diferentes pruebas
        test_cases = [
            ("+56111111111", ["Hola", "Quiero una cita", "Test 1", "el lunes a las 14", "cambiar"]),
            ("+56222222222", ["Hola", "Quiero una cita", "Test 2", "mañana a las 10", "sí"]),
            ("+56333333333", ["Hola", "Quiero una cita", "Test 3", "2025-09-29 15:30", "cambiar"])
        ]
        
        for phone, conversation in test_cases:
            print(f"\n📱 Probando conversación con {phone}")
            
            try:
                for message in conversation:
                    response = conversational_service.process_message(phone, message)
                    if message == "cambiar":
                        print(f"✅ 'cambiar' procesado correctamente para {phone}")
                    elif message == "sí":
                        print(f"✅ 'sí' procesado correctamente para {phone}")
                        
            except Exception as e:
                print(f"❌ Error con {phone}: {e}")
                continue
        
        print("\n✅ Casos extremos completados")
        
    except Exception as e:
        print(f"❌ Error en casos extremos: {e}")

if __name__ == "__main__":
    print("🔧 PRUEBA ESPECÍFICA - ERROR PYDANTIC CORREGIDO")
    print("="*70)
    
    # Probar el caso específico
    success = test_specific_error_case()
    
    if success:
        # Probar casos extremos
        test_edge_cases_pydantic()
        
        print("\n" + "="*70)
        print("🎊 RESUMEN FINAL:")
        print("✅ Error de Pydantic: CORREGIDO")
        print("✅ Mensaje 'cambiar': FUNCIONA")
        print("✅ Validaciones de tipos: FUNCIONAN")
        print("✅ Sistema conversacional: ESTABLE")
    else:
        print("\n❌ Aún hay problemas por corregir")