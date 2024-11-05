# twilio-python

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
