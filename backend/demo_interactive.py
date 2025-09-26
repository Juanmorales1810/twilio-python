"""
Demostración de mensajes interactivos de WhatsApp con Twilio
Incluye botones, listas y multimedia
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def demo_interactive_templates():
    """Mostrar los diferentes templates interactivos disponibles"""
    print("🎨 TEMPLATES INTERACTIVOS DE WHATSAPP")
    print("="*60)
    
    try:
        from services.whatsapp_service import whatsapp_service
        
        print("1. 📋 MENÚ PRINCIPAL (Botones)")
        print("-"*40)
        main_menu = whatsapp_service.create_main_menu_buttons()
        print(f"Header: {main_menu['header']}")
        print(f"Body: {main_menu['body'][:100]}...")
        print("Botones:")
        for btn in main_menu['buttons']:
            print(f"  • {btn['title']} (ID: {btn['id']})")
        
        print("\n2. 📅 SELECCIÓN DE FECHA (Lista)")
        print("-"*40)
        date_list = whatsapp_service.create_date_selection_list()
        print(f"Header: {date_list['header']}")
        print(f"Button Text: {date_list['button_text']}")
        print("Secciones:")
        for section in date_list['sections']:
            print(f"  📂 {section['title']}")
            for row in section['rows'][:2]:  # Solo primeras 2 opciones
                print(f"    • {row['title']}")
            if len(section['rows']) > 2:
                print(f"    ... y {len(section['rows']) - 2} más")
        
        print("\n3. 🏥 SELECCIÓN DE SERVICIO (Lista)")
        print("-"*40)
        service_list = whatsapp_service.create_service_selection_list()
        print(f"Header: {service_list['header']}")
        print("Secciones:")
        for section in service_list['sections']:
            print(f"  📂 {section['title']}")
            for row in section['rows'][:2]:
                print(f"    • {row['title']}")
            if len(section['rows']) > 2:
                print(f"    ... y {len(section['rows']) - 2} más")
        
        print("\n4. ✅ CONFIRMACIÓN DE CITA (Botones)")
        print("-"*40)
        confirmation = whatsapp_service.create_appointment_confirmation_buttons(
            "📋 Cita: Juan Pérez - 29/09/2025 10:00 - Consulta General"
        )
        print("Botones de confirmación:")
        for btn in confirmation['buttons']:
            print(f"  • {btn['title']} (ID: {btn['id']})")
            
    except Exception as e:
        print(f"❌ Error: {e}")

def demo_interactive_responses():
    """Demostrar manejo de respuestas interactivas"""
    print("\n🎯 MANEJO DE RESPUESTAS INTERACTIVAS")
    print("="*60)
    
    try:
        from services.whatsapp_service import whatsapp_service
        
        test_responses = [
            ("new_appointment", "Botón: Nueva Cita"),
            ("my_appointments", "Botón: Mis Citas"),
            ("confirm_yes", "Botón: Confirmar Cita"),
            ("tomorrow_morning", "Lista: Mañana - Mañana"),
            ("general_consultation", "Lista: Consulta General"),
            ("modify", "Botón: Modificar")
        ]
        
        print("Respuestas mapeadas:")
        for response_id, description in test_responses:
            mapped_text = whatsapp_service.handle_interactive_response(response_id, "+56912345678")
            print(f"  {description}")
            print(f"    ID: {response_id} → Texto: '{mapped_text}'")
            print()
            
    except Exception as e:
        print(f"❌ Error: {e}")

def demo_conversational_with_interactive():
    """Demostrar conversación con elementos interactivos"""
    print("\n💬 CONVERSACIÓN CON ELEMENTOS INTERACTIVOS")
    print("="*60)
    
    try:
        from services.conversational_service import conversational_service
        
        test_phone = "+56777888999"
        
        # Conversación con respuestas interactivas
        interactions = [
            ("Hola", "Saludo inicial (debería mostrar menú)"),
            ("new_appointment", "Respuesta de botón: Nueva Cita"),
            ("Juan Demo", "Nombre"),
            ("tomorrow_morning", "Respuesta de lista: Mañana mañana"),
            ("general_consultation", "Respuesta de lista: Consulta General"),
            ("confirm_yes", "Respuesta de botón: Confirmar")
        ]
        
        print(f"📱 Conversación interactiva para {test_phone}:\n")
        
        for i, (input_text, description) in enumerate(interactions, 1):
            print(f"👤 {i}. {description}")
            print(f"    Input: '{input_text}'")
            
            try:
                # Si es un ID de interacción, convertirlo primero
                from services.whatsapp_service import whatsapp_service
                if input_text in ['new_appointment', 'tomorrow_morning', 'general_consultation', 'confirm_yes']:
                    converted_text = whatsapp_service.handle_interactive_response(input_text, test_phone)
                    print(f"    Convertido a: '{converted_text}'")
                    actual_input = converted_text
                else:
                    actual_input = input_text
                
                result = conversational_service.process_message(test_phone, actual_input)
                
                print(f"🤖 Bot: {result.message[:80]}...")
                print(f"📊 Estado: {result.state}")
                
                if result.suggested_actions:
                    print(f"🎯 Acciones sugeridas: {result.suggested_actions}")
                
                if result.appointment_created:
                    print(f"🎉 ¡Cita creada! ID: {result.appointment_id}")
                    break
                    
            except Exception as e:
                print(f"    ❌ Error: {e}")
                
            print("-" * 50)
            
    except Exception as e:
        print(f"❌ Error: {e}")

def demo_media_messages():
    """Demostrar tipos de mensajes multimedia"""
    print("\n📱 TIPOS DE MENSAJES MULTIMEDIA")
    print("="*60)
    
    media_examples = [
        {
            "type": "image",
            "description": "🖼️ Imagen de confirmación de cita",
            "example": "https://example.com/cita-confirmada.jpg"
        },
        {
            "type": "document", 
            "description": "📄 PDF con instrucciones pre-cita",
            "example": "https://example.com/instrucciones.pdf"
        },
        {
            "type": "audio",
            "description": "🔊 Recordatorio de voz",
            "example": "https://example.com/recordatorio.ogg"
        },
        {
            "type": "video",
            "description": "🎥 Video explicativo del procedimiento",
            "example": "https://example.com/explicacion.mp4"
        }
    ]
    
    print("Ejemplos de mensajes multimedia soportados:")
    for media in media_examples:
        print(f"\n{media['description']}")
        print(f"  Tipo: {media['type'].upper()}")
        print(f"  URL: {media['example']}")
        print(f"  Uso: Adjuntar automáticamente según el contexto")

if __name__ == "__main__":
    print("📱 DEMOSTRACIÓN - MENSAJES INTERACTIVOS DE WHATSAPP")
    print("="*70)
    
    # Mostrar templates disponibles
    demo_interactive_templates()
    
    # Mostrar manejo de respuestas
    demo_interactive_responses()
    
    # Demostrar conversación interactiva
    demo_conversational_with_interactive()
    
    # Mostrar opciones multimedia
    demo_media_messages()
    
    print("\n" + "="*70)
    print("🎊 RESUMEN:")
    print("✅ Templates interactivos creados")
    print("✅ Botones de respuesta rápida implementados")
    print("✅ Listas desplegables configuradas") 
    print("✅ Manejo de respuestas automático")
    print("✅ Integración con conversación secuencial")
    print("✅ Soporte para multimedia preparado")
    print("\n🚀 El asistente ahora es completamente interactivo!")
    
    print("\n📋 PRÓXIMOS PASOS:")
    print("1. Configurar Content Templates en Twilio Console")
    print("2. Actualizar webhook URL en Twilio")
    print("3. Probar con usuarios reales")
    print("4. Optimizar templates según feedback")