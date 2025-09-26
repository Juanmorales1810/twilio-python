"""
Script de demostración del Asistente de Citas con Pydantic AI

Este script muestra cómo funciona el asistente de citas y permite probarlo
de manera interactiva.
"""

from queries.queryAppointments import appointment_agent
from datetime import datetime, timedelta
import asyncio

def demo_appointment_assistant():
    """Función de demostración del asistente de citas"""
    print("🏥 DEMOSTRACIÓN DEL ASISTENTE DE CITAS CON PYDANTIC AI")
    print("=" * 60)
    print()
    
    # Ejemplos de consultas que se pueden hacer
    test_queries = [
        "Hola, necesito agendar una cita",
        "Quiero ver mis citas programadas para el número +1234567890", 
        "¿Puedes verificar disponibilidad para el 15 de abril de 2024?",
        "Necesito cancelar mi cita",
        "¿Qué puedes hacer por mí?",
    ]
    
    print("📋 CONSULTAS DE EJEMPLO:")
    for i, query in enumerate(test_queries, 1):
        print(f"{i}. {query}")
    print()
    
    while True:
        print("-" * 60)
        user_input = input("🗣️  Escribe tu consulta (o 'salir' para terminar): ").strip()
        
        if user_input.lower() in ['salir', 'exit', 'quit']:
            print("¡Hasta luego! 👋")
            break
            
        if not user_input:
            continue
            
        print("\n🤖 Procesando con el asistente de citas...")
        print("-" * 40)
        
        try:
            # Ejecutar el agente
            result = appointment_agent.run_sync(user_input)
            
            # Mostrar respuesta del agente
            print("📋 RESPUESTA DEL ASISTENTE:")
            print(result.data)
            print()
            
            # Mostrar información de debug (opcional)
            if len(result.all_messages()) > 1:
                print("🔧 DEBUG - Herramientas utilizadas:")
                for msg in result.all_messages():
                    if hasattr(msg, 'content') and 'tool' in str(msg).lower():
                        print(f"  - {msg}")
                print()
                
        except Exception as e:
            print(f"❌ Error: {str(e)}")
            print()

def test_specific_scenarios():
    """Pruebas específicas de escenarios comunes"""
    print("\n🧪 PRUEBAS DE ESCENARIOS ESPECÍFICOS")
    print("=" * 60)
    
    scenarios = [
        {
            "description": "Saludo inicial",
            "query": "Hola"
        },
        {
            "description": "Crear una cita",
            "query": "Quiero agendar una cita para Juan Pérez, teléfono +1234567890, para el 2024-04-15 10:30, motivo: consulta general"
        },
        {
            "description": "Consultar citas",
            "query": "¿Cuáles son mis citas? Mi número es +1234567890"
        },
        {
            "description": "Verificar disponibilidad", 
            "query": "¿Hay horarios disponibles del 2024-04-15 al 2024-04-20?"
        }
    ]
    
    for i, scenario in enumerate(scenarios, 1):
        print(f"\n{i}. {scenario['description']}")
        print(f"Consulta: {scenario['query']}")
        print("-" * 40)
        
        try:
            result = appointment_agent.run_sync(scenario['query'])
            print("Respuesta:")
            print(result.data)
            
        except Exception as e:
            print(f"Error: {str(e)}")
        
        print()

def show_capabilities():
    """Mostrar las capacidades del asistente"""
    print("\n🎯 CAPACIDADES DEL ASISTENTE DE CITAS")
    print("=" * 60)
    print()
    
    capabilities = [
        "✅ Crear nuevas citas con validación de fechas futuras",
        "✅ Buscar y listar citas de un usuario específico", 
        "✅ Modificar citas existentes (fecha, descripción, estado)",
        "✅ Cancelar citas programadas",
        "✅ Verificar disponibilidad de horarios en rangos de fechas",
        "✅ Prevenir conflictos de horarios automáticamente", 
        "✅ Gestión automática de usuarios (crear si no existe)",
        "✅ Estados de citas (pendiente, confirmada, cancelada, etc.)",
        "✅ Validaciones de formato de fecha y hora",
        "✅ Respuestas en español con emojis informativos"
    ]
    
    for capability in capabilities:
        print(f"  {capability}")
    
    print("\n📋 COMANDOS DE EJEMPLO:")
    examples = [
        "- 'Quiero una cita para [nombre] en [fecha YYYY-MM-DD HH:MM] por [motivo]'",
        "- 'Mis citas del número [teléfono]'",
        "- 'Cambiar mi cita [ID] para [nueva fecha]'",
        "- 'Cancelar cita [ID]'", 
        "- 'Disponibilidad del [fecha] al [fecha]'"
    ]
    
    for example in examples:
        print(f"  {example}")

if __name__ == "__main__":
    print("🚀 INICIALIZANDO ASISTENTE DE CITAS...")
    print()
    
    # Mostrar capacidades
    show_capabilities()
    
    # Ejecutar pruebas automáticas
    test_specific_scenarios()
    
    # Demo interactiva
    demo_appointment_assistant()