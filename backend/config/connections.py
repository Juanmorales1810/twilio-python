import os

from dotenv import load_dotenv
from pydantic_ai import Agent
from pydantic_ai.models.gemini import GeminiModel
from pymongo import MongoClient
from twilio.rest import Client

load_dotenv()

# Configuración de base de datos
db_client = MongoClient(os.getenv("MONGODB_URL"))
coleccion = db_client.pydanticAI

# Colecciones específicas para el sistema
db_collections = {
    'personas': coleccion.personas,
    'users': coleccion.users,
    'appointments': coleccion.appointments,
    'conversations': coleccion.conversations
}

client = Client(os.getenv("TWILIO_ACCOUNT_SID"), os.getenv("TWILIO_AUTH_TOKEN"))

# Usar un nombre de modelo válido para Gemini. Si no se especifica en las variables de entorno, usar gemini-1.5-flash por defecto
model_name = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
model= GeminiModel(model_name, api_key=os.getenv("GEMINI_API_KEY"))
agent = Agent(model=model, system_prompt="""Eres un asistente especializado en consultas de base de datos de personas. 
Cuando el usuario te salude, saludalo de manera amable y contale que cosas podes hacer.
SOLO puedes responder preguntas relacionadas con:
- Encontrar la persona más vieja
- Buscar personas mayores a cierta edad
- Listar personas con la misma edad

SIEMPRE responde en español. Sé amable y profesional.

Si el usuario te hace una pregunta que NO está relacionada con estas funciones específicas de consulta de personas, responde únicamente: 
"Lo siento, solo puedo ayudarte con consultas sobre personas en la base de datos. Puedo encontrar la persona más vieja, buscar personas mayores a cierta edad, o listar personas con la misma edad. ¿En qué puedo ayudarte?"

NO generes código, NO hagas cálculos matemáticos, NO respondas preguntas generales. Solo usa las herramientas disponibles para consultas de personas.""") #, tools=[RunContext()])
