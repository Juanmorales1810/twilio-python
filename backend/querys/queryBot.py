# query/whatsapp_flow.py
import os
from datetime import datetime

from pydantic import BaseModel
from pydantic_ai import Agent
from pydantic_ai.models.gemini import GeminiModel
from pydantic_ai.tools import RunContext
from pymongo import MongoClient
from twilio.twiml.messaging_response import MessagingResponse


class Person(BaseModel):
    name: str
    age: int

coleccion = MongoClient(os.getenv("MONGODB_URL")).pydanticAI

model= GeminiModel(os.getenv("model"), api_key=os.getenv("GEMINI_API_KEY"))
agent = Agent(model=model, system_prompt="""Eres un asistente especializado en consultas de base de datos de personas. 
SOLO puedes responder preguntas relacionadas con:
- Encontrar la persona más vieja
- Buscar personas mayores a cierta edad
- Listar personas con la misma edad

SIEMPRE responde en español. Sé amable y profesional.

Si el usuario te hace una pregunta que NO está relacionada con estas funciones específicas de consulta de personas, responde únicamente: 
"Lo siento, solo puedo ayudarte con consultas sobre personas en la base de datos. Puedo encontrar la persona más vieja, buscar personas mayores a cierta edad, o listar personas con la misma edad. ¿En qué puedo ayudarte?"

NO generes código, NO hagas cálculos matemáticos, NO respondas preguntas generales. Solo usa las herramientas disponibles para consultas de personas.""") #, tools=[RunContext()])

# Almacenamiento temporal del estado del usuario
user_state = {}


@agent.tool
def find_oldest_person(ctx: RunContext):
    """Function to find the oldest person in the database."""
    result = list(coleccion.personas.find().sort("age", -1).limit(1))
    if result:
        person = result[0]
        return f"The oldest person is {person['name']} who is {person['age']} years old."
    return "No people found in the database."

@agent.tool
def find_people_over_age(ctx: RunContext, age: int):
    """Function to find people older than a certain age."""
    results = list(coleccion.personas.find({"age": {"$gt": age}}))
    return [Person(name=p["name"], age=p["age"]) for p in results]

@agent.tool
def list_people_same_age(ctx: RunContext, age: int):
    """Function to list people with the same age."""
    results = list(coleccion.personas.find({"age": {"$eq": age}}))
    return [Person(name=p["name"], age=p["age"]) for p in results]

# Función para procesar consultas con la IA
def process_ai_query(query: str):
    result = agent.run_sync(query)
    return result.data



def manejar_mensaje_con_ia(phone_number: str, incoming_msg: str) -> str:
    incoming_msg = incoming_msg.strip().lower()
    response = MessagingResponse()
    message = response.message()
    respuesta_ia = process_ai_query(incoming_msg)

    message.body(respuesta_ia)

    return(str(response))


    incoming_msg = incoming_msg.strip()
    response = MessagingResponse()
    message = response.message()

    # Obtener el estado actual del usuario o inicializarlo
    if phone_number not in user_state:
        user_state[phone_number] = {"step": 0}

    user_data = user_state[phone_number]

    # Flujo de registro de cita
    if user_data["step"] == 0:
        message.body("¡Hola! Soy tu asistente virtual. ¿Para qué fecha te gustaría agendar la cita? (por favor, escribe en formato DD-MM-YYYY)")
        user_data["step"] = 1

    elif user_data["step"] == 1:
        try:
            # Validar fecha
            appointment_date = datetime.strptime(incoming_msg, "%d-%m-%Y")
            user_data["date"] = appointment_date
            message.body("Perfecto. ¿A qué hora? (por favor, escribe en formato HH:MM, por ejemplo, 14:30)")
            user_data["step"] = 2
        except ValueError:
            message.body("Lo siento, el formato de fecha no es correcto. Por favor, usa el formato DD-MM-YYYY.")

    elif user_data["step"] == 2:
        try:
            # Validar hora
            appointment_time = datetime.strptime(incoming_msg, "%H:%M").time()
            user_data["time"] = appointment_time
            message.body("¿Cuál es tu nombre completo?")
            user_data["step"] = 3
        except ValueError:
            message.body("Lo siento, el formato de hora no es correcto. Por favor, usa el formato HH:MM.")

    elif user_data["step"] == 3:
        user_data["name"] = incoming_msg
        message.body("Gracias, {}. ¿Podrías proporcionarme un número de contacto adicional?".format(user_data["name"]))
        user_data["step"] = 4

    elif user_data["step"] == 4:
        user_data["contact_number"] = incoming_msg
        # Confirmar la cita
        appointment_details = (
            f"Cita registrada:\n"
            f"Fecha: {user_data['date'].strftime('%d-%m-%Y')}\n"
            f"Hora: {user_data['time'].strftime('%H:%M')}\n"
            f"Nombre: {user_data['name']}\n"
            f"Contacto: {user_data['contact_number']}\n"
            f"Nos pondremos en contacto para confirmar."
        )
        message.body(appointment_details)
        
        # Reiniciar el estado del usuario
        user_state[phone_number] = {"step": 0}

    return str(response)