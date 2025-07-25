#!/usr/bin/env python3
"""
Script para poblar la base de datos con información de vehículos
"""

import os
from dotenv import load_dotenv
from database.connection import DatabaseManager

load_dotenv()

def init_vehicles_db():
    """Inicializa la base de datos con información de vehículos"""
    
    db = DatabaseManager()
    vehicles_collection = db.db.vehicles  # Acceder a la colección vehicles
    
    vehicles_data = [
        {
            "name": "Corolla 2024",
            "model": "Corolla",
            "year": 2024,
            "price": "$23,000-$28,000",
            "description": "Sedán compacto, confiable y eficiente con tecnología avanzada",
            "features": [
                "Motor 2.0L de 169 HP",
                "Transmisión CVT",
                "Toyota Safety Sense 2.0",
                "Pantalla táctil de 8 pulgadas",
                "Apple CarPlay/Android Auto",
                "Cámara de reversa"
            ],
            "fuel_economy": "32 ciudad / 41 carretera MPG",
            "category": "sedan",
            "available": True
        },
        {
            "name": "Camry 2024", 
            "model": "Camry",
            "year": 2024,
            "price": "$26,000-$35,000",
            "description": "Sedán mediano premium con diseño deportivo y amplio espacio interior",
            "features": [
                "Motor 2.5L de 203 HP",
                "Transmisión automática de 8 velocidades",
                "Toyota Safety Sense 2.0",
                "Pantalla táctil de 9 pulgadas",
                "Asientos de cuero disponibles",
                "Sistema de sonido JBL Premium"
            ],
            "fuel_economy": "28 ciudad / 39 carretera MPG",
            "category": "sedan",
            "available": True
        },
        {
            "name": "Prius 2024",
            "model": "Prius", 
            "year": 2024,
            "price": "$28,000-$33,000",
            "description": "Vehículo híbrido eco-friendly con tecnología innovadora y máxima eficiencia",
            "features": [
                "Sistema híbrido 2.0L + motor eléctrico",
                "Potencia combinada de 194 HP",
                "Pantalla táctil de 12.3 pulgadas",
                "Toyota Safety Sense 2.0",
                "Modo totalmente eléctrico",
                "Carga inalámbrica del teléfono"
            ],
            "fuel_economy": "57 ciudad / 56 carretera MPG",
            "category": "hybrid",
            "available": True
        },
        {
            "name": "RAV4 2024",
            "model": "RAV4",
            "year": 2024, 
            "price": "$29,000-$38,000",
            "description": "SUV compacta versátil y adventure-ready con capacidad todo terreno",
            "features": [
                "Motor 2.5L de 203 HP",
                "Tracción AWD disponible",
                "Clearance de 8.6 pulgadas",
                "Capacidad de remolque de 3,500 lbs",
                "Toyota Safety Sense 2.0",
                "Gran espacio de carga (69.8 pies cúbicos)"
            ],
            "fuel_economy": "27 ciudad / 35 carretera MPG",
            "category": "suv",
            "available": True
        },
        {
            "name": "Highlander 2024",
            "model": "Highlander",
            "year": 2024,
            "price": "$36,000-$48,000", 
            "description": "SUV familiar de 3 filas con amplio espacio y comodidad premium",
            "features": [
                "Motor V6 3.5L de 295 HP",
                "Capacidad para 8 pasajeros",
                "3 filas de asientos",
                "Tracción AWD estándar",
                "Capacidad de remolque de 5,000 lbs",
                "Pantalla táctil de 12.3 pulgadas"
            ],
            "fuel_economy": "21 ciudad / 29 carretera MPG",
            "category": "suv",
            "available": True
        },
        {
            "name": "Tacoma 2024",
            "model": "Tacoma",
            "year": 2024,
            "price": "$32,000-$45,000",
            "description": "Pickup resistente para trabajo y aventura con capacidad off-road superior",
            "features": [
                "Motor V6 3.5L de 278 HP",
                "Tracción 4WD disponible",
                "Capacidad de remolque de 6,800 lbs",
                "Multi-Terrain Select",
                "Crawl Control para off-road",
                "Caja robusta para carga"
            ],
            "fuel_economy": "20 ciudad / 23 carretera MPG",
            "category": "truck",
            "available": True
        }
    ]
    
    try:
        # Limpiar colección existente
        vehicles_collection.drop()
        print("🗑️  Colección de vehículos limpiada")
        
        # Insertar nuevos datos
        result = vehicles_collection.insert_many(vehicles_data)
        print(f"✅ {len(result.inserted_ids)} vehículos insertados en la base de datos")
        
        # Verificar inserción
        count = vehicles_collection.count_documents({})
        print(f"📊 Total de vehículos en la DB: {count}")
        
        # Mostrar algunos ejemplos
        print("\n🚗 Vehículos disponibles:")
        for vehicle in vehicles_collection.find({}, {"name": 1, "price": 1, "description": 1}):
            print(f"   • {vehicle['name']} - {vehicle['price']}")
            print(f"     {vehicle['description']}")
        
    except Exception as e:
        print(f"❌ Error al inicializar vehículos: {e}")

if __name__ == "__main__":
    init_vehicles_db()
