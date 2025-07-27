#!/usr/bin/env python3
"""
Test simple para confirmar citas con 18:00
"""

import sys
import os
from dotenv import load_dotenv

# Agregar el directorio padre al path para imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Configurar variables de entorno
os.environ["GEMINI_API_KEY"] = "test_key" 
os.environ["MONGODB_URL"] = "mongodb://localhost:27017"

# Importar después de configurar env vars
from utils.validators import validate_time

def test_time_validation():
    """Test básico de validación de tiempo"""
    print("=== PRUEBA DE VALIDACIÓN DE TIEMPO ===")
    
    test_times = ["18:00", "6:00 PM", "6 PM", "10:30", "14:30", "25:00", "invalid"]
    
    for time_str in test_times:
        is_valid = validate_time(time_str)
        print(f"🕐 '{time_str}' -> {'✅ Válido' if is_valid else '❌ Inválido'}")

def test_appointment_model():
    """Test del modelo Appointment"""
    print("\n=== PRUEBA DEL MODELO APPOINTMENT ===")
    
    try:
        from models.user import Appointment
        from datetime import datetime
        
        appointment = Appointment(
            phone_number="+1234567890",
            customer_name="Juan Morales",
            customer_email="juan@test.com", 
            preferred_date=datetime(2025, 7, 28),
            preferred_time="18:00",
            vehicle_interest="Corolla"
        )
        
        print(f"✅ Appointment creado:")
        print(f"   Nombre: {appointment.customer_name}")
        print(f"   Fecha: {appointment.preferred_date}")
        print(f"   Hora: {appointment.preferred_time}")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_time_validation()
    test_appointment_model()
