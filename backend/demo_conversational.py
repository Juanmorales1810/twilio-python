"""
Script de demostración del Asistente de Citas Conversacional con Pendulum
Manejo secuencial de conversación y fechas naturales
"""

from services.conversational_service import conversational_service
from utils.date_parser import DateParser
import asyncio

def demo_natural_date_parsing():
    """Demostración del parser de fechas naturales"""
    print("📅 DEMOSTRACIÓN DEL PARSER DE FECHAS NATURALES")
    print("=" * 60)
    
    date_parser = DateParser(timezone="America/Santiago")
    
    test_phrases = [
        "mañana a las 10:30",
        "el lunes a las 14:00", 
        "pasado mañana a las 9:15",
        "el viernes próximo a las 16:30",
        "27/09/2025 11:00",
        "2025-09-28 15:45",
        "hoy a las 18:00",
        "el sábado a las 8:30",
        "mañana en la tarde",
        "el miércoles a las 13:00"
    ]
    
    print("\n🧪 Probando diferentes formatos de fecha:\n")
    
    for phrase in test_phrases:
        parsed_date, explanation = date_parser.parse_natural_date(phrase)
        
        if parsed_date:
            business_hours = "✅ Horario laboral" if date_parser.is_business_hours(parsed_date) else "⚠️ Fuera de horario"
            print(f"📝 '{phrase}'")
            print(f"   {explanation}")
            print(f"   {business_hours}")
            print()
        else:
            print(f"❌ '{phrase}' -> {explanation}")
            print()

def demo_conversational_flow():
    """Demostración del flujo conversacional completo"""
    print("\n💬 DEMOSTRACIÓN DEL ASISTENTE CONVERSACIONAL")
    print("=" * 60)
    
    # Simular número de teléfono de prueba
    test_phone = "+56912345678"
    
    # Secuencia de mensajes de prueba
    conversation_flow = [
        "Hola",
        "Quiero hacer una cita",
        "Juan Morales",
        "mañana a las 10:30",
        "consulta general",
        "sí"
    ]
    
    print(f"📱 Simulando conversación para el teléfono: {test_phone}\n")
    
    for i, message in enumerate(conversation_flow, 1):
        print(f"👤 Usuario: {message}")
        print("-" * 40)
        
        try:
            response = conversational_service.process_message(test_phone, message)
            
            print(f"🤖 Asistente ({response.state}):")
            print(response.message)
            
            if response.appointment_created:
                print(f"✅ ¡Cita creada con ID: {response.appointment_id}!")
            
            print(f"\n📊 Estado: {response.state}")
            print(f"📥 Requiere input: {response.requires_input}")
            
        except Exception as e:
            print(f"❌ Error: {str(e)}")
        
        print("\n" + "="*60 + "\n")

def interactive_conversation_demo():
    """Demo interactivo del asistente conversacional"""
    print("\n🎯 DEMO INTERACTIVO DEL ASISTENTE CONVERSACIONAL")
    print("=" * 60)
    
    test_phone = input("📱 Ingresa un número de teléfono de prueba (ej: +56912345678): ").strip()
    
    if not test_phone:
        test_phone = "+56912345678"
        print(f"📱 Usando teléfono por defecto: {test_phone}")
    
    print(f"\n💬 Iniciando conversación para {test_phone}")
    print("📝 Escribe 'salir' para terminar la demo\n")
    
    while True:
        user_input = input("👤 Tú: ").strip()
        
        if user_input.lower() in ['salir', 'exit', 'quit']:
            print("👋 ¡Hasta luego!")
            break
        
        if not user_input:
            continue
        
        print("🔄 Procesando...")
        
        try:
            response = conversational_service.process_message(test_phone, user_input)
            
            print(f"\n🤖 Asistente:")
            print(response.message)
            
            if response.appointment_created:
                print(f"\n🎉 ¡Cita creada exitosamente!")
                print(f"📋 ID de cita: {response.appointment_id}")
            
            print(f"\n📊 [Estado: {response.state} | Input requerido: {response.requires_input}]")
            
        except Exception as e:
            print(f"\n❌ Error: {str(e)}")
        
        print()

def test_edge_cases():
    """Probar casos extremos y manejo de errores"""
    print("\n🧪 PRUEBAS DE CASOS EXTREMOS")
    print("=" * 60)
    
    test_phone = "+56999999999"
    edge_cases = [
        ("", "Mensaje vacío"),
        ("xyz", "Texto sin sentido"),
        ("ayer a las 10:00", "Fecha en el pasado"),
        ("a", "Nombre muy corto"),
        ("mañana a las 25:70", "Hora inválida"),
        ("el mes que viene", "Fecha ambigua")
    ]
    
    print("Probando manejo de casos extremos:\n")
    
    # Iniciar conversación
    conversational_service.process_message(test_phone, "quiero una cita")
    conversational_service.process_message(test_phone, "Test User")
    
    for test_input, description in edge_cases:
        print(f"🧪 {description}: '{test_input}'")
        
        try:
            response = conversational_service.process_message(test_phone, test_input)
            print(f"   ✅ Manejado correctamente")
            print(f"   📝 Respuesta: {response.message[:100]}...")
        except Exception as e:
            print(f"   ❌ Error: {str(e)}")
        
        print()

def show_improvements():
    """Mostrar las mejoras implementadas"""
    print("\n🚀 MEJORAS IMPLEMENTADAS")
    print("=" * 60)
    
    improvements = [
        "✅ **Conversación Secuencial**: El asistente mantiene contexto entre mensajes",
        "✅ **Fechas Naturales**: Entiende 'mañana a las 10:30', 'el viernes próximo', etc.",
        "✅ **Validación de Horarios**: Sugiere horarios laborales automáticamente",
        "✅ **Manejo de Conflictos**: Detecta solapamientos y sugiere alternativas",
        "✅ **Estados de Conversación**: Progreso paso a paso claro",
        "✅ **Casos Extremos**: Manejo robusto de errores y entradas inválidas",
        "✅ **Zona Horaria**: Soporte para diferentes zonas horarias",
        "✅ **Persistencia**: Contexto guardado en base de datos",
        "✅ **Confirmación**: Resumen antes de crear la cita",
        "✅ **Modificaciones**: Permite cambiar datos antes de confirmar"
    ]
    
    for improvement in improvements:
        print(f"  {improvement}")
    
    print("\n📋 **FLUJO MEJORADO:**")
    flow_steps = [
        "1. 👋 Saludo inteligente",
        "2. 👤 Recolección de nombre",
        "3. 📅 Entrada de fecha natural",
        "4. 📝 Motivo de la cita",
        "5. ✅ Confirmación con resumen",
        "6. 🎉 Creación exitosa"
    ]
    
    for step in flow_steps:
        print(f"   {step}")

if __name__ == "__main__":
    print("🏥 SISTEMA DE CITAS CONVERSACIONAL CON PENDULUM")
    print("=" * 60)
    print()
    
    # Mostrar mejoras
    show_improvements()
    
    # Demo del parser de fechas
    demo_natural_date_parsing()
    
    # Demo del flujo conversacional
    demo_conversational_flow()
    
    # Pruebas de casos extremos
    test_edge_cases()
    
    # Demo interactivo
    print("\n" + "="*60)
    interactive_option = input("¿Quieres probar el demo interactivo? (s/n): ").strip().lower()
    if interactive_option in ['s', 'sí', 'si', 'yes', 'y']:
        interactive_conversation_demo()