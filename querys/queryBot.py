# query/whatsapp_flow.py
from twilio.twiml.messaging_response import MessagingResponse
from datetime import datetime

# Almacenamiento temporal del estado del usuario
user_state = {}

def handle_whatsapp_message(phone_number: str, incoming_msg: str) -> str:
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