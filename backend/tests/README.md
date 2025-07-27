# 🧪 Tests - Chatbot Toyota San Juan

# Tests del Chatbot de Toyota San Juan

Esta carpeta contiene todos los tests para verificar el funcionamiento del chatbot de Toyota San Juan.

## 📁 Estructura de Tests

### Tests Principales

-   **`test_production.py`** - Test completo con IA real y claves de producción ✅
-   **`test_chatbot.py`** - Tests básicos del chatbot
-   **`test_webhook.py`** - Tests del webhook de Twilio

### Tests de Funcionalidades Específicas

-   **`test_appointment_confirmation.py`** - Test de confirmación de citas con hora 18:00
-   **`test_appointment_flow.py`** - Test del flujo completo de agendamiento
-   **`test_appointment_fix.py`** - Test de correcciones de citas
-   **`test_conversational_ai.py`** - Test de conversación con IA
-   **`test_time_validation.py`** - Test de validación de horarios
-   **`test_time_issue.py`** - Test específico para problemas de tiempo

### Tests de Datos y Persistencia

-   **`test_data_extraction.py`** - Test de extracción de datos sin IA
-   **`test_data_recovery.py`** - Test de recuperación de datos
-   **`test_progressive_saving.py`** - Test de guardado progresivo

### Tests de Mejoras

-   **`test_improvements.py`** - Test de mejoras implementadas
-   **`test_natural_dates.py`** - Test de fechas en lenguaje natural
-   **`test_monday_scenario.py`** - Test específico para el escenario del lunes

### Tests Simples y Específicos

-   **`test_simple.py`** - Tests básicos de validación y modelos
-   **`test_flow.py`** - Test de flujo de conversación específico
-   **`test_specific_case.py`** - Test de casos específicos

## 🚀 Cómo Ejecutar los Tests

### Test Completo de Producción (Recomendado)

```bash
# Desde la raíz del proyecto
H:/twilio-python/venv/Scripts/python.exe tests/test_production.py
```

### Tests Individuales

```bash
# Test específico
H:/twilio-python/venv/Scripts/python.exe tests/test_simple.py

# Test de validación de tiempo
H:/twilio-python/venv/Scripts/python.exe tests/test_time_validation.py

# Test de flujo de citas
H:/twilio-python/venv/Scripts/python.exe tests/test_appointment_flow.py
```

## ✅ Tests Validados

Los siguientes tests han sido validados y funcionan correctamente:

1. **Extracción de datos del usuario** ✅
2. **Guardado en base de datos** ✅
3. **Consulta de vehículos desde DB** ✅
4. **Creación automática de citas** ✅
5. **Validación de hora "18:00"** ✅
6. **Persistencia de datos** ✅
7. **Integración con IA real** ✅

## 🔧 Configuración para Tests

### Variables de Entorno Requeridas

```env
GEMINI_API_KEY=tu_clave_real_de_gemini
MONGODB_URL=mongodb://localhost:27017
GEMINI_MODEL=gemini-1.5-flash
```

### Prerequisitos

-   Base de datos MongoDB ejecutándose
-   Clave válida de Google Gemini AI
-   Datos de vehículos inicializados (`python init_vehicles.py`)

## 📊 Cobertura de Tests

-   ✅ Flujo completo de conversación
-   ✅ Extracción y validación de datos
-   ✅ Persistencia en base de datos
-   ✅ Integración con IA
-   ✅ Manejo de errores
-   ✅ Casos edge específicos
-   ✅ Confirmación de citas
-   ✅ Consulta de vehículos

## 🎯 Tests Recomendados para Validación

1. **Para verificar funcionamiento básico**: `test_simple.py`
2. **Para validar el flujo completo**: `test_production.py`
3. **Para confirmar citas**: `test_appointment_confirmation.py`
4. **Para validar horarios**: `test_time_validation.py`

## 📋 Archivos de Prueba

### Tests Principales del Sistema

-   **`test_chatbot.py`** - Pruebas básicas del chatbot
-   **`test_conversational_ai.py`** - Pruebas de la IA conversacional
-   **`test_webhook.py`** - Pruebas del webhook de Twilio

### Tests de Flujo de Reservas

-   **`test_appointment_fix.py`** - Pruebas de corrección de reservas
-   **`test_appointment_flow.py`** - Pruebas del flujo completo de reservas
-   **`test_specific_case.py`** - Prueba del caso específico reportado por el usuario
-   **`test_progressive_saving.py`** - Pruebas del guardado progresivo de datos
-   **`test_data_recovery.py`** - Pruebas de recuperación de datos entre sesiones

### Tests de Fechas Naturales

-   **`test_natural_dates.py`** - Pruebas del parseo de fechas en lenguaje natural
-   **`test_monday_scenario.py`** - Prueba específica del escenario "lunes de la semana que viene"

## 🚀 Cómo Ejecutar las Pruebas

### Desde el directorio raíz del proyecto:

```bash
# Configurar entorno Python
H:/twilio-python/venv/Scripts/python.exe

# Ejecutar una prueba específica
H:/twilio-python/venv/Scripts/python.exe tests/test_appointment_flow.py

# Ejecutar pruebas de fechas naturales
H:/twilio-python/venv/Scripts/python.exe tests/test_natural_dates.py

# Ejecutar prueba del caso específico
H:/twilio-python/venv/Scripts/python.exe tests/test_specific_case.py
```

### Desde el directorio tests:

```bash
cd tests

# Ajustar el path para importar módulos del proyecto
python -c "import sys; sys.path.append('..'); exec(open('test_appointment_flow.py').read())"
```

## ✅ Tests por Funcionalidad

### 1. Guardado Progresivo

-   `test_progressive_saving.py` - Verifica que los datos se guarden después de cada interacción
-   `test_data_recovery.py` - Verifica recuperación de datos entre sesiones

### 2. Parseo de Fechas

-   `test_natural_dates.py` - Prueba interpretación de fechas como "mañana", "próximo lunes"
-   `test_monday_scenario.py` - Caso específico de "lunes de la semana que viene"

### 3. Flujo de Reservas

-   `test_appointment_flow.py` - Flujo completo desde saludo hasta confirmación
-   `test_specific_case.py` - Reproduce el bug reportado y verifica la corrección

### 4. Integración

-   `test_webhook.py` - Pruebas de integración con Twilio
-   `test_chatbot.py` - Pruebas generales del sistema

## 📊 Cobertura de Pruebas

Las pruebas cubren:

-   ✅ Extracción automática de datos (nombre, email, fecha, hora)
-   ✅ Guardado progresivo en base de datos
-   ✅ Recuperación de sesiones interrumpidas
-   ✅ Parseo de fechas en lenguaje natural
-   ✅ Flujo completo de reservas
-   ✅ Manejo de errores y casos límite
-   ✅ Integración con Twilio y base de datos

## 🔧 Configuración Requerida

Para ejecutar las pruebas, asegúrate de tener:

1. **Variables de entorno configuradas** (`.env`):

    - `GEMINI_API_KEY`
    - `MONGODB_URL`
    - `TWILIO_ACCOUNT_SID`
    - `TWILIO_AUTH_TOKEN`

2. **Base de datos MongoDB** funcionando

3. **Dependencias instaladas**:
    ```bash
    pip install -r requirements.txt
    ```

## 📝 Notas

-   Los tests usan números de teléfono de prueba como `+1234567890`
-   Se recomienda usar una base de datos de prueba separada
-   Algunos tests requieren conexión a internet para usar la API de Gemini
-   Los tests limpian automáticamente los datos de prueba al iniciar
