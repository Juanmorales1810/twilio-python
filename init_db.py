#!/usr/bin/env python3
"""
Script de inicialización para el chatbot de Toyota
Configura la base de datos e inserta datos iniciales
"""

import os
import sys
from datetime import datetime
from dotenv import load_dotenv
from pymongo import MongoClient
from models.user import VehicleInfo

# Cargar variables de entorno
load_dotenv()

def init_database():
    """Inicializa la base de datos con datos básicos"""
    
    try:
        # Conectar a MongoDB
        client = MongoClient(os.getenv("MONGODB_URL", "mongodb://localhost:27017"))
        db = client.toyota_sanjuan
        
        print("🔗 Conectando a la base de datos...")
        
        # Crear índices para optimizar consultas
        print("📊 Creando índices...")
        
        # Índices para usuarios
        db.users.create_index("phone_number", unique=True)
        db.users.create_index("expires_at")
        
        # Índices para mensajes
        db.messages.create_index([("phone_number", 1), ("timestamp", -1)])
        db.messages.create_index("expires_at")
        
        # Índices para citas
        db.appointments.create_index("phone_number")
        db.appointments.create_index("status")
        db.appointments.create_index("preferred_date")
        
        print("✅ Índices creados exitosamente")
        
        # Insertar datos de vehículos de ejemplo (opcional)
        vehicles_collection = db.vehicles
        
        if vehicles_collection.count_documents({}) == 0:
            print("🚗 Insertando información de vehículos...")
            
            vehicles_data = [
                {
                    "model": "Corolla",
                    "year": 2024,
                    "price_range": "$23,000 - $28,000",
                    "description": "Sedán compacto confiable y eficiente en combustible",
                    "features": ["Toyota Safety Sense 2.0", "Sistema de entretenimiento", "Cámara de reversa"],
                    "category": "sedan",
                    "fuel_type": "gasolina",
                    "transmission": "automatica"
                },
                {
                    "model": "Camry",
                    "year": 2024,
                    "price_range": "$28,000 - $35,000",
                    "description": "Sedán mediano con tecnología avanzada y rendimiento superior",
                    "features": ["Sistema híbrido disponible", "Pantalla táctil de 9 pulgadas", "Asientos con calefacción"],
                    "category": "sedan",
                    "fuel_type": "gasolina/hibrido",
                    "transmission": "automatica"
                },
                {
                    "model": "RAV4",
                    "year": 2024,
                    "price_range": "$32,000 - $40,000",
                    "description": "SUV compacta perfecta para aventuras familiares",
                    "features": ["Tracción en las cuatro ruedas", "Amplio espacio de carga", "Excelente altura al suelo"],
                    "category": "suv",
                    "fuel_type": "gasolina",
                    "transmission": "automatica"
                },
                {
                    "model": "Highlander",
                    "year": 2024,
                    "price_range": "$38,000 - $48,000",
                    "description": "SUV de tres filas ideal para familias grandes",
                    "features": ["8 asientos", "Motor V6 potente", "Sistema de entretenimiento trasero"],
                    "category": "suv",
                    "fuel_type": "gasolina",
                    "transmission": "automatica"
                },
                {
                    "model": "Prius",
                    "year": 2024,
                    "price_range": "$28,000 - $33,000",
                    "description": "Híbrido líder en eficiencia de combustible",
                    "features": ["50+ MPG", "Tecnología híbrida avanzada", "Diseño aerodinámico"],
                    "category": "hibrido",
                    "fuel_type": "hibrido",
                    "transmission": "automatica"
                },
                {
                    "model": "Tacoma",
                    "year": 2024,
                    "price_range": "$35,000 - $45,000",
                    "description": "Pickup mediana resistente y confiable",
                    "features": ["Capacidad de remolque de 6,800 lbs", "Tracción 4x4", "Carrocería resistente"],
                    "category": "pickup",
                    "fuel_type": "gasolina",
                    "transmission": "automatica"
                }
            ]
            
            vehicles_collection.insert_many(vehicles_data)
            print(f"✅ {len(vehicles_data)} vehículos insertados")
        
        # Configurar colección de configuración del sistema
        config_collection = db.system_config
        
        if config_collection.count_documents({}) == 0:
            print("⚙️ Configurando sistema...")
            
            system_config = {
                "version": "1.0.0",
                "last_updated": datetime.utcnow(),
                "features": {
                    "ai_enabled": True,
                    "appointment_booking": True,
                    "vehicle_catalog": True,
                    "conversation_history": True
                },
                "business_hours": {
                    "monday_friday": {"start": 9, "end": 18},
                    "saturday": {"start": 9, "end": 14},
                    "sunday": "closed"
                }
            }
            
            config_collection.insert_one(system_config)
            print("✅ Configuración del sistema creada")
        
        print("\n🎉 Base de datos inicializada correctamente!")
        print(f"📊 Base de datos: {db.name}")
        print("📋 Colecciones creadas:")
        print("   - users (datos de usuarios)")
        print("   - messages (historial de mensajes)")
        print("   - appointments (citas agendadas)")
        print("   - vehicles (catálogo de vehículos)")
        print("   - system_config (configuración del sistema)")
        
        return True
        
    except Exception as e:
        print(f"❌ Error al inicializar la base de datos: {str(e)}")
        return False
    
    finally:
        try:
            client.close()
        except:
            pass


def verify_environment():
    """Verifica que todas las variables de entorno estén configuradas"""
    required_vars = [
        "MONGODB_URL",
        "TWILIO_ACCOUNT_SID",
        "TWILIO_AUTH_TOKEN",
        "TWILIO_PHONE_NUMBER",
        "GEMINI_API_KEY"
    ]
    
    missing_vars = []
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print("❌ Variables de entorno faltantes:")
        for var in missing_vars:
            print(f"   - {var}")
        print("\n💡 Crea un archivo .env basado en .env.example")
        return False
    
    print("✅ Variables de entorno configuradas correctamente")
    return True


if __name__ == "__main__":
    print("🚀 Inicializando Chatbot de Toyota San Juan")
    print("=" * 50)
    
    # Verificar variables de entorno
    if not verify_environment():
        sys.exit(1)
    
    # Inicializar base de datos
    if not init_database():
        sys.exit(1)
    
    print("\n🎯 ¡Todo listo! Puedes ejecutar el servidor con:")
    print("   python main.py")
    print("   o")
    print("   uvicorn main:app --reload")
