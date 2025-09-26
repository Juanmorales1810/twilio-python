# 🏥 Asistente de Citas con Pydantic AI

Un asistente inteligente y modular para el manejo de citas médicas o de servicios profesionales, construido con **Pydantic AI** y integrado con **WhatsApp** via **Twilio**.

## 🌟 Características Principales

### ✅ Funcionalidades del Asistente

-   **Conversación Secuencial**: Mantiene contexto y guía paso a paso al usuario
-   **Fechas Naturales**: Entiende "mañana a las 10:30", "el viernes próximo", "pasado mañana"
-   **Crear Citas**: Agendado inteligente con validación de fechas futuras
-   **Consultar Citas**: Búsqueda y listado de citas por usuario
-   **Modificar Citas**: Cambio de fechas, descripciones y estados
-   **Cancelar Citas**: Cancelación segura de citas programadas
-   **Verificar Disponibilidad**: Consulta de horarios libres por rangos de fechas
-   **Gestión de Usuarios**: Creación automática de usuarios nuevos
-   **Prevención de Conflictos**: Validación automática de solapamientos
-   **Horarios Laborales**: Sugerencias automáticas de horarios apropiados

### 🛠️ Tecnologías Utilizadas

-   **[Pydantic AI](https://ai.pydantic.dev/)**: Framework para agentes AI con validación de tipos
-   **[Pendulum](https://pendulum.eustace.io/)**: Librería avanzada para manejo de fechas naturales
-   **FastAPI**: API REST moderna y rápida
-   **MongoDB**: Base de datos NoSQL para usuarios y citas
-   **Twilio**: Integración con WhatsApp
-   **Google Gemini**: Modelo de lenguaje natural

## 📁 Estructura del Proyecto

```
backend/
├── models/
│   ├── modelUser.py              # Modelos Pydantic para usuarios
│   ├── modelAppointment.py       # Modelos Pydantic para citas
│   ├── modelConversation.py      # Modelos para contexto conversacional ⭐
│   ├── modelPerson.py            # Modelo original (personas)
│   └── modelMsg.py               # Modelo para mensajes
├── queries/
│   ├── queryAppointments.py      # Agente y herramientas de citas (IA)
│   └── queryBot.py               # Query original (personas)
├── services/
│   └── conversational_service.py # Servicio conversacional secuencial ⭐
├── utils/
│   └── date_parser.py            # Parser de fechas naturales con Pendulum ⭐
├── routers/
│   └── routerBot.py              # Endpoints API (incluye /citas) ⭐
├── config/
│   └── connections.py            # Configuración BD y agentes ⭐
├── demo_assistant.py             # Script de demostración (IA)
└── demo_conversational.py       # Demo del sistema conversacional ⭐
```

## 🚀 Configuración e Instalación

### 1. Variables de Entorno

Crear archivo `.env` con:

```env
# MongoDB
MONGODB_URL=mongodb://localhost:27017

# Twilio (WhatsApp)
TWILIO_ACCOUNT_SID=tu_account_sid
TWILIO_AUTH_TOKEN=tu_auth_token

# Google Gemini AI
GEMINI_API_KEY=tu_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash
```

### 2. Instalar Dependencias

```bash
pip install -r requirements.txt
# Incluye Pendulum para fechas naturales
```

### 3. Iniciar el Servidor

```bash
uvicorn main:app --reload
```

## 📋 Uso del Asistente

### Endpoints Disponibles

#### 1. WhatsApp Webhook - Citas (Conversacional) ⭐

```http
POST /bot/whatsapp/citas
```

**Endpoint PRINCIPAL** para recibir mensajes de WhatsApp. Usa conversación secuencial y fechas naturales.

#### 2. WhatsApp Webhook - Citas (IA Original)

```http
POST /bot/whatsapp/citas-ai
```

Endpoint alternativo que usa el agente IA original (sin conversación secuencial).

#### 3. Prueba del Asistente Conversacional ⭐

```http
POST /bot/test-conversational
Content-Type: application/json

{
    "phone": "+56912345678",
    "msg": "Hola, quiero una cita"
}
```

#### 4. Prueba del Asistente IA

```http
POST /bot/test-citas
Content-Type: application/json

{
    "msg": "Hola, quiero agendar una cita"
}
```

### Comandos de Ejemplo

#### ✨ Conversación Natural (NUEVO)

```
Usuario: "Hola"
Bot: "👋 ¡Hola! Soy tu asistente virtual para gestionar tus citas..."

Usuario: "Quiero hacer una cita"
Bot: "📋 ¡Perfecto! Te ayudo a agendar tu cita. Primero necesito tu nombre completo."

Usuario: "Juan Morales"
Bot: "👋 ¡Hola Juan Morales! Ahora necesito saber cuándo te gustaría tener tu cita..."

Usuario: "Mañana a las 10:30"
Bot: "📅 Mañana: viernes, 27 de septiembre de 2025 a las 10:30..."

Usuario: "Consulta general"
Bot: "📋 RESUMEN DE TU CITA..."

Usuario: "Sí"
Bot: "🎉 ¡CITA CREADA EXITOSAMENTE!"
```

#### 🗣️ Fechas en Lenguaje Natural

```
• "Mañana a las 10:30"
• "El lunes próximo a las 14:00"
• "Pasado mañana en la tarde"
• "El viernes a las 16:30"
• "27/09/2025 15:00"
• "2025-09-28 11:45"
```

#### 📅 Consultar Citas

```
"¿Cuáles son mis citas? Mi número es +1234567890"
```

#### ✏️ Modificar Cita

```
"Cambiar mi cita 6613f4a5b7c8d9e0f1234567 para el 2024-04-20 14:00"
```

#### ❌ Cancelar Cita

```
"Cancelar cita 6613f4a5b7c8d9e0f1234567"
```

#### 🔍 Verificar Disponibilidad

```
"¿Hay horarios disponibles del 2024-04-15 al 2024-04-20?"
```

## 🧪 Demostración y Pruebas

### Script de Demostración

#### Sistema Conversacional (NUEVO) ⭐

```bash
python demo_conversational.py
```

#### Sistema IA Original

```bash
python demo_assistant.py
```

Los scripts incluyen:

-   **Demostración interactiva**: Interfaz de consola para probar el asistente
-   **Parser de fechas naturales**: Pruebas de interpretación de fechas
-   **Pruebas automáticas**: Escenarios predefinidos
-   **Casos extremos**: Manejo de errores y entradas inválidas

### Probar via API

```bash
# Ejemplo con curl
curl -X POST "http://localhost:8000/bot/test-citas" \
     -H "Content-Type: application/json" \
     -d '{"msg": "Hola, necesito una cita"}'
```

## 🏗️ Arquitectura del Sistema

### Sistema Conversacional (NUEVO) ⭐

El **nuevo sistema conversacional** maneja las citas mediante:

1. **Contexto Persistente**: Cada usuario tiene un contexto de conversación guardado
2. **Estados Secuenciales**: Progresión paso a paso (saludo → nombre → fecha → motivo → confirmación)
3. **Fechas Naturales**: Interpretación inteligente usando Pendulum
4. **Validaciones Inteligentes**: Horarios laborales, conflictos, fechas futuras
5. **Confirmación con Resumen**: El usuario ve todos los detalles antes de confirmar

### Agente IA Original

El asistente también incluye el **agente Pydantic AI** original que:

1. **Entiende el contexto** mediante procesamiento de lenguaje natural
2. **Selecciona herramientas** automáticamente según la intención del usuario
3. **Ejecuta acciones** en la base de datos MongoDB
4. **Valida datos** usando modelos Pydantic
5. **Responde en español** con formato amigable

### Herramientas Disponibles para el Agente IA

| Herramienta                | Función                  | Parámetros                                |
| -------------------------- | ------------------------ | ----------------------------------------- |
| `crear_cita`               | Crear nueva cita         | teléfono, nombre, fecha/hora, descripción |
| `buscar_citas_usuario`     | Buscar citas del usuario | teléfono                                  |
| `modificar_cita`           | Modificar cita existente | ID, nueva fecha, descripción, estado      |
| `cancelar_cita`            | Cancelar cita            | ID de la cita                             |
| `verificar_disponibilidad` | Ver horarios libres      | fecha inicio, fecha fin                   |

### Validaciones Implementadas

-   ✅ **Fechas futuras**: Las citas solo se pueden crear para fechas futuras
-   ✅ **Fechas naturales**: Interpretación de "mañana", "el lunes próximo", etc.
-   ✅ **Prevención de conflictos**: No se permite solapar citas (±30 min buffer)
-   ✅ **Formato de fechas**: Múltiples formatos soportados
-   ✅ **Estados válidos**: Control de estados de citas
-   ✅ **Duración de citas**: Manejo de duración en minutos
-   ✅ **Horarios laborales**: Sugerencias automáticas (Lun-Vie 8:00-18:00)
-   ✅ **Validación de nombres**: Longitud mínima y formato
-   ✅ **Contexto persistente**: Conversación guardada en BD

## 📊 Modelos de Datos

### Contexto de Conversación (`ConversationContext`)

```python
{
    "phone_number": "+56912345678",
    "state": "waiting_date",
    "user_name": "Juan Morales",
    "preferred_date": "mañana a las 10:30",
    "parsed_date": "2025-09-27T10:30:00",
    "description": "consulta general",
    "duration_minutes": 60,
    "created_at": "2025-09-26T11:25:00",
    "updated_at": "2025-09-26T11:26:00"
}
```

### Usuario (`User`)

```python
{
    "phone_number": "+56912345678",
    "name": "Juan Morales",
    "email": "juan@email.com",
    "created_at": "2025-09-26T11:25:00",
    "is_active": true
}
```

### Cita (`Appointment`)

```python
{
    "user_phone": "+56912345678",
    "user_name": "Juan Morales",
    "date": "2025-09-27T10:30:00",
    "description": "Consulta general",
    "status": "pendiente",
    "duration_minutes": 60,
    "created_at": "2025-09-26T11:25:00"
}
```

## 🔄 Estados de Citas

| Estado       | Descripción                             |
| ------------ | --------------------------------------- |
| `pendiente`  | Cita solicitada, esperando confirmación |
| `confirmada` | Cita confirmada y programada            |
| `cancelada`  | Cita cancelada por el usuario o sistema |
| `completada` | Cita realizada exitosamente             |
| `no_asistio` | Usuario no asistió a la cita            |

## 🌐 Integración con WhatsApp

### Configuración Webhook

1. Configurar webhook de Twilio: `https://tu-servidor.com/bot/whatsapp/citas`
2. El asistente procesará automáticamente los mensajes usando conversación secuencial
3. Respuestas formateadas para WhatsApp con emojis y progreso claro

### Ejemplo de Conversación Mejorada

```
👤 Usuario: Hola
🤖 Bot: 👋 ¡Hola! Soy tu asistente virtual para gestionar tus citas.
     Estoy aquí para ayudarte a:
     • 📅 Agendar nuevas citas
     • 🔍 Consultar tus citas existentes
     • ✏️ Modificar o cancelar citas
     • 📋 Verificar horarios disponibles

     ¿En qué puedo ayudarte hoy?

👤 Usuario: Quiero hacer una cita
🤖 Bot: 📋 ¡Perfecto! Te ayudo a agendar tu cita.

     Primero necesito tu nombre completo.

👤 Usuario: Juan Morales
🤖 Bot: 👋 ¡Hola Juan Morales!

     Ahora necesito saber cuándo te gustaría tener tu cita. Puedes decirme:
     • "Mañana a las 10:30"
     • "El viernes a las 14:00"
     • "27/09/2025 15:30"
     • "Pasado mañana en la tarde"

     ¿Cuándo te viene bien?

� Usuario: Mañana a las 10:30
🤖 Bot: ✅ 📅 Mañana: viernes, 27 de septiembre de 2025 a las 10:30

     Perfecto! Ahora cuéntame, ¿cuál es el motivo de tu cita?

     Por ejemplo:
     • Consulta general
     • Revisión médica
     • Control
     • Consulta específica

👤 Usuario: Consulta general
🤖 Bot: 📋 **RESUMEN DE TU CITA**

     👤 **Nombre:** Juan Morales
     📅 **Fecha:** viernes, 27 de septiembre de 2025 a las 10:30
     📝 **Motivo:** Consulta general
     📱 **Teléfono:** +56912345678
     ⏱️ **Duración:** 60 minutos

     ¿Todo está correcto? Responde:
     • **'SÍ'** para confirmar y crear la cita
     • **'NO'** para cancelar
     • **'CAMBIAR [campo]'** para modificar algo

👤 Usuario: Sí
🤖 Bot: 🎉 **¡CITA CREADA EXITOSAMENTE!**

     ✅ **ID de cita:** 66f5a8b7c9d0e1f234567890
     👤 **Paciente:** Juan Morales
     📅 **Fecha:** viernes, 27 de septiembre de 2025 a las 10:30
     📝 **Motivo:** Consulta general

     📞 Te contactaremos antes de la cita para confirmarla.

     ¡Gracias por confiar en nosotros!
```

## 🤝 Contribución

El código está estructurado de manera modular siguiendo las mejores prácticas de Pydantic AI:

1. **Modelos Pydantic**: Validación automática de tipos
2. **Herramientas como funciones**: Cada funcionalidad es una tool
3. **Agente especializado**: Contexto específico para citas médicas
4. **Dependency injection**: Conexiones a BD inyectadas
5. **Manejo de errores**: Respuestas amigables para el usuario

## 📝 Notas Técnicas

### Diferencias con el Sistema Original

-   **Agente separado**: El asistente de citas tiene su propio agente independiente
-   **Modelos específicos**: Nuevos modelos para Users y Appointments
-   **Colecciones BD**: Nuevas colecciones `users` y `appointments`
-   **Endpoint dedicado**: `/whatsapp/citas` para citas vs `/whatsapp` general

### Compatibilidad

-   ✅ **Backward compatible**: El sistema original de personas sigue funcionando
-   ✅ **Misma base de datos**: Usa la misma instancia MongoDB
-   ✅ **Misma configuración**: Reutiliza variables de entorno existentes

---

**¡Tu asistente de citas inteligente está listo para usar! 🎉**
