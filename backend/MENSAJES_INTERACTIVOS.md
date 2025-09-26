# 📱 Mensajes Interactivos de WhatsApp - Guía de Implementación

## 🌟 Funcionalidades Implementadas

### ✅ **Tipos de Mensajes Soportados**

#### 1. 🔘 **Botones Interactivos** (Hasta 3 botones)

```python
{
  "header": "🏥 Asistente de Citas",
  "body": "¿En qué puedo ayudarte?",
  "buttons": [
    {"id": "new_appointment", "title": "📅 Nueva Cita"},
    {"id": "my_appointments", "title": "👀 Mis Citas"},
    {"id": "help", "title": "❓ Ayuda"}
  ]
}
```

#### 2. 📋 **Listas Desplegables** (Hasta 10 opciones por sección)

```python
{
  "header": "📅 Selecciona Fecha y Hora",
  "body": "¿Cuándo te gustaría agendar tu cita?",
  "button_text": "Ver Opciones 📋",
  "sections": [
    {
      "title": "📅 Fechas Rápidas",
      "rows": [
        {"id": "tomorrow_morning", "title": "🌅 Mañana - Mañana (9:00-12:00)"},
        {"id": "tomorrow_afternoon", "title": "🌆 Mañana - Tarde (14:00-18:00)"}
      ]
    }
  ]
}
```

#### 3. 🖼️ **Multimedia** (Imágenes, Videos, Documentos, Audio)

```python
{
  "message": "Aquí tienes tu confirmación de cita 📋",
  "media_url": "https://example.com/confirmacion-cita.jpg",
  "media_type": "image"
}
```

## 🏗️ Arquitectura Implementada

### 📁 **Archivos Nuevos**

| Archivo                        | Descripción                                      |
| ------------------------------ | ------------------------------------------------ |
| `services/whatsapp_service.py` | ⭐ Servicio principal para mensajes interactivos |
| `demo_interactive.py`          | 🧪 Demostración completa de funcionalidades      |

### 📝 **Archivos Modificados**

| Archivo                              | Cambios                                  |
| ------------------------------------ | ---------------------------------------- |
| `services/conversational_service.py` | ✅ Integración con mensajes interactivos |
| `routers/routerBot.py`               | ✅ Endpoint para respuestas interactivas |
| `models/modelConversation.py`        | ✅ Soporte para acciones sugeridas       |

## 🎯 Templates Interactivos Disponibles

### 1. 📋 **Menú Principal**

**Cuándo usar**: Al inicio de la conversación o cuando el usuario saluda

**Botones**:

-   📅 Nueva Cita → `new_appointment`
-   👀 Mis Citas → `my_appointments`
-   ❓ Ayuda → `help`

### 2. 📅 **Selección de Fecha**

**Cuándo usar**: Cuando el usuario necesita elegir fecha y hora

**Opciones**:

-   🌅 Mañana - Mañana (9:00-12:00)
-   🌆 Mañana - Tarde (14:00-18:00)
-   📅 Lunes Próximo (9:00-18:00)
-   📝 Fecha Específica
-   👀 Ver Disponibilidad

### 3. 🏥 **Selección de Servicio**

**Cuándo usar**: Para elegir el tipo de cita médica

**Categorías**:

-   **Servicios Médicos**: Consulta General, Chequeo, Control, Especialista
-   **Otros Servicios**: Consulta, Procedimiento, Terapia, Otro

### 4. ✅ **Confirmación de Cita**

**Cuándo usar**: Para confirmar los detalles de la cita

**Botones**:

-   ✅ Confirmar → `confirm_yes`
-   ❌ Cancelar → `confirm_no`
-   ✏️ Modificar → `modify`

## 🔄 Mapeo de Respuestas Automático

El sistema mapea automáticamente las respuestas interactivas a texto natural:

| ID de Respuesta        | Texto Convertido     |
| ---------------------- | -------------------- |
| `new_appointment`      | "Quiero una cita"    |
| `my_appointments`      | "Ver mis citas"      |
| `confirm_yes`          | "sí"                 |
| `tomorrow_morning`     | "mañana a las 10:00" |
| `general_consultation` | "consulta general"   |
| `modify`               | "cambiar"            |

## 🚀 Implementación y Uso

### 1. **Endpoint Principal Actualizado**

```
POST /bot/whatsapp/citas
```

**Parámetros adicionales**:

-   `ButtonResponse`: ID del botón presionado
-   `ListResponse`: JSON de la opción seleccionada
-   `MediaUrl0`: URL de archivo adjunto

### 2. **Nuevos Endpoints**

#### Enviar Mensaje Interactivo

```http
POST /bot/send-interactive
Content-Type: application/json

{
  "to": "+56912345678",
  "message_type": "buttons",
  "content": {
    "header": "🏥 Asistente de Citas",
    "body": "¿En qué puedo ayudarte?",
    "buttons": [
      {"id": "new_appointment", "title": "📅 Nueva Cita"}
    ]
  }
}
```

#### Obtener Templates

```http
GET /bot/interactive-templates

Response:
{
  "main_menu": { ... },
  "date_selection": { ... },
  "service_selection": { ... },
  "appointment_confirmation": { ... }
}
```

### 3. **Flujo de Conversación Mejorado**

```
👤 Usuario: [Abre chat]
🤖 Bot: [Muestra menú principal con botones]

👤 Usuario: [Presiona "📅 Nueva Cita"]
🤖 Bot: "¡Perfecto! Primero necesito tu nombre..."

👤 Usuario: "Juan Pérez"
🤖 Bot: [Muestra lista de fechas disponibles]

👤 Usuario: [Selecciona "🌅 Mañana - Mañana"]
🤖 Bot: "Fecha seleccionada. ¿Cuál es el motivo?"
     [Muestra lista de servicios médicos]

👤 Usuario: [Selecciona "👩‍⚕️ Consulta General"]
🤖 Bot: [Muestra resumen con botones de confirmación]

👤 Usuario: [Presiona "✅ Confirmar"]
🤖 Bot: "🎉 ¡Cita creada exitosamente!"
```

## ⚙️ Configuración en Twilio

### 1. **Variables de Entorno**

```env
# Agregar el número de WhatsApp de Twilio
TWILIO_PHONE_NUMBER=+14155238886
```

### 2. **Webhook Configuration**

-   **URL**: `https://tu-servidor.com/bot/whatsapp/citas`
-   **HTTP Method**: POST
-   **Content Type**: application/x-www-form-urlencoded

### 3. **Content Templates** (Opcional)

Para funcionalidades avanzadas, puedes crear Content Templates en Twilio Console con botones predefinidos.

## 🧪 Pruebas y Testing

### Script de Pruebas

```bash
.\venv\Scripts\Activate.ps1
python demo_interactive.py
```

### Endpoint de Pruebas

```bash
curl -X POST "http://localhost:8000/bot/test-conversational" \
     -H "Content-Type: application/json" \
     -d '{"phone": "+56912345678", "msg": "Hola"}'

Response:
{
  "message": "👋 ¡Hola! Soy tu asistente virtual...",
  "state": "greeting",
  "suggested_actions": ["📅 Nueva Cita", "👀 Mis Citas", "❓ Ayuda"]
}
```

## 📱 Fallback para Dispositivos No Compatibles

Si los mensajes interactivos fallan, el sistema automáticamente envía:

```
👋 ¡Hola! Soy tu asistente virtual para gestionar citas.

¿En qué puedo ayudarte?

Opciones rápidas:
• 📅 Nueva Cita
• 👀 Mis Citas
• ❓ Ayuda

Responde con el número de tu opción.
```

## 🎨 Personalización

### Agregar Nuevos Botones

```python
# En services/whatsapp_service.py
def create_custom_buttons(self):
    buttons = [
        {"id": "custom_action", "title": "🎯 Acción Personalizada"}
    ]
    return {"body": "Mensaje personalizado", "buttons": buttons}
```

### Agregar Nuevas Listas

```python
def create_custom_list(self):
    sections = [{
        "title": "📂 Categoría Personalizada",
        "rows": [
            {"id": "custom_option", "title": "🎨 Opción Personalizada"}
        ]
    }]
    return {"header": "Header", "body": "Body", "sections": sections}
```

## 📊 Beneficios de la Implementación

### ✅ **Para los Usuarios**

-   🚀 **Más rápido**: Botones vs escritura
-   🎯 **Más fácil**: Opciones claras y visuales
-   📱 **Mejor UX**: Interfaz nativa de WhatsApp
-   🔄 **Menos errores**: Opciones predefinidas

### ✅ **Para el Sistema**

-   🤖 **Menos ambigüedad**: Respuestas estructuradas
-   🎯 **Mayor precisión**: Mapeo directo de intenciones
-   📈 **Mejores métricas**: Tracking de interacciones
-   🛠️ **Más control**: Flujos dirigidos

## 🚀 Estado Final

**ANTES (solo texto)**:

```
Usuario: "Hola"
Bot: "¿En qué puedo ayudarte?"
Usuario: "quiero una cita" (tiene que escribir)
Bot: "Dime tu nombre"
...
```

**AHORA (interactivo)**:

```
Usuario: "Hola"
Bot: [Muestra menú con botones: 📅 Nueva Cita | 👀 Mis Citas | ❓ Ayuda]
Usuario: [Presiona 📅 Nueva Cita]
Bot: "¡Perfecto! Dime tu nombre"
...
```

**🎉 ¡El asistente ahora es completamente interactivo y profesional!**
