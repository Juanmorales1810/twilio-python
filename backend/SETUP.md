# 🚗 Guía de Configuración Rápida - Toyota Chatbot

## ⚡ Configuración en 5 minutos

### 1. Variables de Entorno Requeridas

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
# === OBLIGATORIO: Credenciales de Twilio ===
TWILIO_ACCOUNT_SID=tu_account_sid_de_twilio
TWILIO_AUTH_TOKEN=tu_auth_token_de_twilio
TWILIO_PHONE_NUMBER=+14155552671

# === OBLIGATORIO: Gemini AI ===
GEMINI_API_KEY=tu_api_key_de_gemini

# === OBLIGATORIO: Base de Datos ===
MONGODB_URL=mongodb://localhost:27017

# === OPCIONAL: Configuraciones adicionales ===
USER_SESSION_EXPIRY_HOURS=24
MESSAGE_HISTORY_EXPIRY_HOURS=168
AGENCY_PHONE=(787) 555-0123
AGENCY_EMAIL=contacto@toyota-sanjuan.com
```

### 2. Configurar Twilio

1. Ve a [Twilio Console](https://console.twilio.com/)
2. Obtén tu `Account SID` y `Auth Token`
3. Compra un número de WhatsApp Business o usa el Sandbox
4. Configura el webhook: `https://tu-dominio.com/bot/whatsapp`

### 3. Configurar Google Gemini

1. Ve a [Google AI Studio](https://aistudio.google.com/)
2. Crea una nueva API Key
3. Copia la key al archivo `.env`

### 4. Instalar MongoDB

**Opción A: Local**

```bash
# Descarga e instala MongoDB Community desde:
# https://www.mongodb.com/try/download/community
```

**Opción B: Docker**

```bash
docker run --name mongodb -p 27017:27017 -d mongo:latest
```

**Opción C: MongoDB Atlas (Gratis)**

1. Ve a [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crea un cluster gratuito
3. Obtén la connection string
4. Úsala como `MONGODB_URL`

### 5. Ejecutar el Proyecto

```bash
# Activar entorno virtual
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Instalar dependencias
pip install -r requirements.txt

# Inicializar base de datos
python init_db.py

# Verificar configuración
python test_chatbot.py --quick

# Ejecutar servidor
python main.py
```

## 🔧 Configuración de Webhook en Twilio

### Para Desarrollo (ngrok)

```bash
# Instalar ngrok
npm install -g ngrok
# o descargar desde https://ngrok.com/

# Exponer puerto local
ngrok http 8000

# Usar la URL https://xxxxx.ngrok.io/bot/whatsapp
```

### Para Producción

-   Deploy en Heroku, Railway, DigitalOcean, etc.
-   Configura HTTPS
-   Usa la URL: `https://tu-dominio.com/bot/whatsapp`

## 🧪 Probar el Chatbot

1. **Modo Sandbox de Twilio:**

    - Envía "join [palabra-clave]" al número de sandbox
    - Luego envía "Hola" para iniciar

2. **Usando la API directamente:**
    ```bash
    curl -X POST http://localhost:8000/bot/whatsapp \
      -H "Content-Type: application/x-www-form-urlencoded" \
      -d "From=whatsapp:+5215551234567&Body=Hola"
    ```

## 📱 Flujo de Conversación

```
Usuario: "Hola"
Bot: Menú principal (vehículos, citas, representante)

Usuario: "2" (agendar cita)
Bot: Solicita nombre
Usuario: "Juan Pérez"
Bot: Solicita email
Usuario: "juan@email.com"
Bot: Solicita fecha
Usuario: "25/12/2024"
Bot: Solicita hora
Usuario: "10:30"
Bot: Solicita vehículo de interés
Usuario: "Corolla"
Bot: Muestra resumen y solicita confirmación
Usuario: "Sí"
Bot: Confirma cita creada
```

## 🛠️ Mantenimiento

### Limpiar Datos Expirados

```bash
python maintenance.py --cleanup
```

### Ver Estadísticas

```bash
python maintenance.py --stats
```

### Crear Respaldo

```bash
python maintenance.py --backup
```

### Resetear Usuario

```bash
python maintenance.py --reset-user +5215551234567
```

## 🚨 Solución de Problemas Comunes

### "No se puede conectar a MongoDB"

-   Verifica que MongoDB esté ejecutándose
-   Revisa la URL de conexión en `.env`
-   Para Docker: `docker ps` para ver si el contenedor está activo

### "Error de autenticación con Twilio"

-   Verifica `TWILIO_ACCOUNT_SID` y `TWILIO_AUTH_TOKEN`
-   Asegúrate de que no tengan espacios extras

### "No responde la IA"

-   Verifica `GEMINI_API_KEY`
-   Revisa los límites de tu cuenta de Google AI

### "Webhook no recibe mensajes"

-   Verifica que la URL del webhook esté configurada en Twilio
-   Para ngrok, asegúrate de que esté ejecutándose
-   Verifica que el servidor esté escuchando en el puerto correcto

## 📞 Soporte

Si tienes problemas:

1. Ejecuta `python test_chatbot.py` para diagnósticos
2. Revisa los logs del servidor
3. Verifica todas las variables de entorno
4. Consulta la documentación completa en README.md

---

🎉 **¡Ya tienes tu chatbot de Toyota funcionando!** 🎉
