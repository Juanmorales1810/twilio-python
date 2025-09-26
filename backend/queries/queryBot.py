from datetime import datetime

from config.connections import agent, coleccion
from models.modelPerson import Person
from pydantic_ai.tools import RunContext
from twilio.twiml.messaging_response import MessagingResponse


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
    print(result.all_messages())
    return result.data



def manejar_mensaje_con_ia(phone_number: str, incoming_msg: str) -> str:
    incoming_msg = incoming_msg.strip().lower()
    response = MessagingResponse()
    message = response.message() 
    respuesta_ia = process_ai_query(incoming_msg)

    message.body(respuesta_ia)

    return(str(response))
