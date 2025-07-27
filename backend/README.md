# 🚗 Toyota San Juan Chatbot Inteligente

Un chatbot modular e inteligente para la agencia Toyota San Juan, diseñado para ayudar a los clientes con información de vehículos y agendamiento de citas a través de WhatsApp.

## 🌟 Características

-   **🤖 IA Conversacional**: Powered by Google Gemini para respuestas naturales
-   **📱 Integración WhatsApp**: Comunicación directa vía Twilio
-   **📅 Agendamiento de Citas**: Sistema completo de reserva de citas
-   **🚗 Catálogo de Vehículos**: Información detallada de modelos Toyota
-   **💾 Persistencia de Datos**: MongoDB para historial y datos de usuarios
-   **⏰ Expiración Automática**: Los datos se limpian automáticamente
-   **🏗️ Arquitectura Modular**: Código organizado y fácil de mantener

## 📋 Requisitos

-   Python 3.8+
-   MongoDB
-   Cuenta de Twilio
-   API Key de Google Gemini
-   FastAPI

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Juanmorales1810/twilio-python.git
cd twilio-python
```

### 2. Crear entorno virtual

```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 4. Configurar variables de entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env
# Editar .env con tus credenciales
```

### 5. Inicializar base de datos

```bash
python init_db.py
```

### 6. Ejecutar la aplicación

```bash
python main.py
# o
uvicorn main:app --reload
```

## ⚙️ Configuración

### Variables de Entorno Requeridas

```env
# Twilio
TWILIO_ACCOUNT_SID=tu_account_sid
TWILIO_AUTH_TOKEN=tu_auth_token
TWILIO_PHONE_NUMBER=+14155552671

# MongoDB
MONGODB_URL=mongodb://localhost:27017

# Google Gemini
GEMINI_API_KEY=tu_api_key
GEMINI_MODEL=gemini-pro

# Configuración opcional
USER_SESSION_EXPIRY_HOURS=24
MESSAGE_HISTORY_EXPIRY_HOURS=168
AGENCY_PHONE=(787) 555-0123
AGENCY_EMAIL=contacto@toyota-sanjuan.com
```

## 📁 Estructura del Proyecto

```
twilio-python/
├── 📁 models/              # Modelos de datos Pydantic
│   ├── user.py            # Modelos de usuario y citas
│   └── message.py         # Modelos de mensajes
├── 📁 services/           # Lógica de negocio
│   ├── chatbot_service.py # Servicio principal del chatbot
│   └── toyota_service.py  # Servicio de información de vehículos
├── 📁 database/          # Gestión de base de datos
│   └── connection.py     # Conexiones y consultas MongoDB
├── 📁 routers/           # Endpoints de la API
│   └── routerBot.py      # Rutas del chatbot
├── 📁 utils/             # Utilidades
│   └── validators.py     # Validadores de datos
├── 📁 tests/             # Pruebas del sistema
│   ├── test_*.py         # Archivos de prueba
│   └── README.md         # Documentación de tests
├── 📁 querys/            # Legacy (para compatibilidad)
├── main.py               # Aplicación principal
├── config.py             # Configuración del sistema
├── init_db.py            # Script de inicialización
└── requirements.txt      # Dependencias
```

## 🤖 Flujo de Conversación

### 1. Inicio

-   Saludo y menú principal
-   Opciones: vehículos, citas, representante

### 2. Información de Vehículos

-   Catálogo completo de Toyota
-   Detalles por modelo
-   Búsqueda por categoría

### 3. Agendamiento de Citas

1. **Datos del cliente**: Nombre y email
2. **Fecha y hora**: Validación de horarios de atención
3. **Vehículo de interés**: Modelo específico
4. **Confirmación**: Resumen y confirmación final

### 4. Gestión de Contexto

-   Historial de conversación con expiración
-   Datos de usuario temporales
-   Limpieza automática de datos antiguos

## 📊 API Endpoints

### WhatsApp Webhook

```http
POST /bot/whatsapp
Content-Type: application/x-www-form-urlencoded

From=whatsapp:+5215551234567
Body=Hola
```

### Gestión de Citas

```http
GET /bot/appointments/{phone_number}
PUT /bot/appointments/status
DELETE /bot/conversation/{phone_number}
```

### Administración

```http
GET /health
POST /bot/cleanup
```

## 🔧 Personalización

### Agregar Nuevos Vehículos

Edita `services/toyota_service.py`:

```python
self.vehicles_data["nuevo_modelo"] = VehicleInfo(
    model="Nuevo Modelo",
    year=2024,
    price_range="$XXX,XXX - $XXX,XXX",
    description="Descripción del vehículo",
    features=["Característica 1", "Característica 2"]
)
```

### Modificar Flujo de Conversación

Edita `services/chatbot_service.py` y agrega nuevos métodos:

```python
def _handle_nuevo_paso(self, user_data: UserData, message: str) -> BotResponse:
    # Tu lógica aquí
    return BotResponse(
        response_text="Tu respuesta",
        next_step="siguiente_paso"
    )
```

### Personalizar Prompts de IA

Modifica `_get_system_prompt()` en `chatbot_service.py` para ajustar el comportamiento del bot.

## 🧪 Testing

```bash
# Ejecutar pruebas individuales
H:/twilio-python/venv/Scripts/python.exe tests/test_appointment_flow.py
H:/twilio-python/venv/Scripts/python.exe tests/test_natural_dates.py
H:/twilio-python/venv/Scripts/python.exe tests/test_progressive_saving.py

# Ver documentación completa de tests
cat tests/README.md

# Probar webhook localmente con ngrok
ngrok http 8000
# Configurar URL webhook en Twilio
```

## 📈 Monitoreo

### Logs

Los logs se almacenan automáticamente en MongoDB:

-   Mensajes de conversación
-   Citas agendadas
-   Errores del sistema

### Métricas Disponibles

-   Número de conversaciones activas
-   Citas agendadas por período
-   Vehículos más consultados
-   Errores y excepciones

## 🔒 Seguridad

-   ✅ Validación de entrada de datos
-   ✅ Expiración automática de sesiones
-   ✅ Sanitización de mensajes
-   ✅ Variables de entorno para credenciales
-   ✅ Validación de webhooks de Twilio (recomendado implementar)

## 📝 Próximas Características

-   [ ] Autenticación de webhooks de Twilio
-   [ ] Panel de administración web
-   [ ] Notificaciones push para citas
-   [ ] Integración con CRM
-   [ ] Métricas en tiempo real
-   [ ] Soporte para múltiples idiomas
-   [ ] Integración con calendario
-   [ ] Recordatorios automáticos de citas

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Para soporte técnico:

-   📧 Email: contacto@toyota-sanjuan.com
-   📞 Teléfono: (787) 555-0123
-   🐛 Issues: [GitHub Issues](https://github.com/Juanmorales1810/twilio-python/issues)

## 👥 Equipo

-   **Desarrollo**: Tu nombre
-   **Diseño**: Toyota San Juan
-   **Testing**: Equipo QA

---

⭐ **¡Si este proyecto te fue útil, danos una estrella!** ⭐

## Dependencias

-   FastAPI
-   uvicorn
-   motor
-   twilio

## Instalacion y inicializacion

1. Clonar el repositorio

```bash
    git clone https://github.com/Juanmorales1810/twilio-python
```

2. Crear un entorno virtual

```bash
    cd twilio-python
    python -m venv venv
    source venv/bin/activate  # En Windows usa `venv\Scripts\Activate`
```

3. Instalar dependencias

```bash
    pip install -r requirements.txt
```

4. Crear un archivo .env que contenga:

```
TWILIO_ACCOUNT_SID=YOUR_TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN=YOUR_TWILIO_AUTH_TOKEN
TWILIO_PHONE_NUMBER=YOUR_TWILIO_PHONE_NUMBER
```

5. Iniciar el servidor

```bash
    uvicorn main:app --reload
```

## Como usar el WebHook de Twilio

1.  Hacer una cuenta en ngrok - [Ngrok](https://ngrok.com/)
2.  instalar ngrok
3.  Iniciar el programa ngrok
4.  Agregar el authtoken de ngrok al programa

```bash
   ngrok authtoken YOUR_NGROK_AUTH_TOKEN
```

5.  Iniciar el servidor en la consola

```bash
    uvicorn main:app --reload
```

6. Iniciar el servidor de ngrok

```bash
    ngrok http http://localhost:8000
```

7. Copiar el url de ngrok
8. Agregar el url de ngrok al sandbox setting de Twilio en la parte de When a message is received

## Contribuciones

Bienvenido a la comunidad de contribuciones! Por favor, lee el siguiente documento para comprender cómo contribuir a este proyecto.

1. Hacer Fork al repositorio
2. Crear una nueva rama para tus cambios
3. Haz tus cambios y haz el commit de ellos.
4. Envía tus cambios a tu repositorio bifurcado
5. Crea una pull request al main del repositorio original

## License

Este proyecto está bajo la licencia MIT. Consulte el archivo de LICENCIA para obtener más información.
