from datetime import datetime, timedelta

from database.connection import DatabaseManager
from fastapi import APIRouter, HTTPException
from schemas.schemaDashboard import (
    DashboardData,
    DashboardStats,
    RecentActivity,
    VehiclePopularity,
)

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats():
    """Obtiene las estadísticas principales del dashboard"""
    try:
        print("Iniciando obtención de estadísticas...")
        db = DatabaseManager()
        print("DatabaseManager creado exitosamente")
        
        # Fechas para comparaciones
        now = datetime.utcnow()
        thirty_days_ago = now - timedelta(days=30)
        yesterday = now - timedelta(days=1)
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        
        print(f"Fechas calculadas: now={now}, thirty_days_ago={thirty_days_ago}")
        
        # Total de usuarios
        try:
            total_users = db.users_collection.count_documents({})
            print(f"Total usuarios: {total_users}")
        except Exception as e:
            print(f"Error contando usuarios: {e}")
            total_users = 0
            
        try:
            users_last_month = db.users_collection.count_documents({
                "created_at": {"$gte": thirty_days_ago}
            })
            print(f"Usuarios último mes: {users_last_month}")
        except Exception as e:
            print(f"Error contando usuarios del mes: {e}")
            users_last_month = 0
            
        users_growth = (users_last_month / max(total_users - users_last_month, 1)) * 100 if total_users > 0 else 0
        
        # Citas pendientes
        try:
            pending_appointments = db.appointments_collection.count_documents({
                "status": "pendiente"
            })
            print(f"Citas pendientes: {pending_appointments}")
        except Exception as e:
            print(f"Error contando citas pendientes: {e}")
            pending_appointments = 0
        
        # Citas de hoy
        try:
            appointments_today = db.appointments_collection.count_documents({
                "preferred_date": {"$gte": today_start, "$lt": today_start + timedelta(days=1)}
            })
            print(f"Citas hoy: {appointments_today}")
        except Exception as e:
            print(f"Error contando citas de hoy: {e}")
            appointments_today = 0
        
        # Vehículos disponibles (valor fijo por ahora)
        available_vehicles = 6
        
        # Mensajes de hoy
        try:
            messages_today = db.messages_collection.count_documents({
                "timestamp": {"$gte": today_start}
            })
            print(f"Mensajes hoy: {messages_today}")
        except Exception as e:
            print(f"Error contando mensajes de hoy: {e}")
            messages_today = 0
        
        # Mensajes de ayer para calcular crecimiento
        try:
            messages_yesterday = db.messages_collection.count_documents({
                "timestamp": {"$gte": yesterday, "$lt": today_start}
            })
            print(f"Mensajes ayer: {messages_yesterday}")
        except Exception as e:
            print(f"Error contando mensajes de ayer: {e}")
            messages_yesterday = 0
        
        messages_growth = ((messages_today - messages_yesterday) / max(messages_yesterday, 1)) * 100 if messages_yesterday > 0 else 0
        
        stats = DashboardStats(
            total_users=total_users,
            total_users_growth=round(users_growth, 1),
            pending_appointments=pending_appointments,
            appointments_today=appointments_today,
            available_vehicles=available_vehicles,
            messages_today=messages_today,
            messages_growth=round(messages_growth, 1)
        )
        
        print(f"Estadísticas generadas: {stats}")
        return stats
        
    except Exception as e:
        print(f"Error completo en get_dashboard_stats: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error al obtener estadísticas: {str(e)}")


@router.get("/recent-activity", response_model=list[RecentActivity])
async def get_recent_activity():
    """Obtiene la actividad reciente del sistema"""
    try:
        print("Iniciando obtención de actividad reciente...")
        db = DatabaseManager()
        activities = []
        
        # Últimas citas creadas
        try:
            recent_appointments = list(db.appointments_collection.find({}).sort("created_at", -1).limit(3))
            print(f"Citas encontradas: {len(recent_appointments)}")
            
            for appointment in recent_appointments:
                activities.append(RecentActivity(
                    type="appointment",
                    description="Nueva cita agendada",
                    details=f"{appointment.get('customer_name', 'Usuario')} - {appointment.get('vehicle_interest', 'Vehículo')}",
                    timestamp=appointment.get('created_at', datetime.utcnow())
                ))
        except Exception as e:
            print(f"Error obteniendo citas: {e}")
        
        # Últimos usuarios registrados
        try:
            recent_users = list(db.users_collection.find({}).sort("created_at", -1).limit(2))
            print(f"Usuarios encontrados: {len(recent_users)}")
            
            for user in recent_users:
                activities.append(RecentActivity(
                    type="user",
                    description="Nuevo usuario registrado",
                    details=user.get('name', f"Usuario {user.get('phone_number', '')[-4:]}"),
                    timestamp=user.get('created_at', datetime.utcnow())
                ))
        except Exception as e:
            print(f"Error obteniendo usuarios: {e}")
        
        # Ordenar por timestamp descendente
        activities.sort(key=lambda x: x.timestamp, reverse=True)
        
        print(f"Actividades generadas: {len(activities)}")
        return activities[:5]  # Retornar solo los 5 más recientes
        
    except Exception as e:
        print(f"Error completo en get_recent_activity: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error al obtener actividad reciente: {str(e)}")


@router.get("/popular-vehicles", response_model=list[VehiclePopularity])
async def get_popular_vehicles():
    """Obtiene los vehículos más consultados"""
    try:
        print("Iniciando obtención de vehículos populares...")
        db = DatabaseManager()
        
        # Agregación para contar menciones de vehículos en conversaciones
        pipeline = [
            {
                "$match": {
                    "message": {"$regex": "prius|rav4|corolla|camry|highlander|4runner", "$options": "i"}
                }
            },
            {
                "$group": {
                    "_id": {
                        "$switch": {
                            "branches": [
                                {"case": {"$regexMatch": {"input": "$message", "regex": "prius", "options": "i"}}, "then": "Prius"},
                                {"case": {"$regexMatch": {"input": "$message", "regex": "rav4", "options": "i"}}, "then": "RAV4"},
                                {"case": {"$regexMatch": {"input": "$message", "regex": "corolla", "options": "i"}}, "then": "Corolla"},
                                {"case": {"$regexMatch": {"input": "$message", "regex": "camry", "options": "i"}}, "then": "Camry"},
                                {"case": {"$regexMatch": {"input": "$message", "regex": "highlander", "options": "i"}}, "then": "Highlander"},
                                {"case": {"$regexMatch": {"input": "$message", "regex": "4runner", "options": "i"}}, "then": "4Runner"}
                            ],
                            "default": "Otro"
                        }
                    },
                    "count": {"$sum": 1}
                }
            },
            {"$sort": {"count": -1}},
            {"$limit": 5}
        ]
        
        try:
            results = list(db.messages_collection.aggregate(pipeline))
            print(f"Resultados de agregación: {results}")
        except Exception as e:
            print(f"Error en agregación: {e}")
            # Si falla la agregación, devolver datos por defecto
            results = [
                {"_id": "Prius", "count": 45},
                {"_id": "RAV4", "count": 38},
                {"_id": "Corolla", "count": 32}
            ]
        
        # Mapear categorías
        category_map = {
            "Prius": "Híbrido",
            "RAV4": "SUV",
            "Corolla": "Sedán",
            "Camry": "Sedán",
            "Highlander": "SUV",
            "4Runner": "SUV"
        }
        
        popular_vehicles = []
        for result in results:
            if result["_id"] != "Otro":
                popular_vehicles.append(VehiclePopularity(
                    model=f"{result['_id']} 2024",
                    category=category_map.get(result["_id"], "Vehículo"),
                    consultations=result["count"]
                ))
        
        # Si no hay datos suficientes, agregar datos por defecto
        if len(popular_vehicles) < 3:
            default_vehicles = [
                VehiclePopularity(model="Prius 2024", category="Híbrido", consultations=45),
                VehiclePopularity(model="RAV4 2024", category="SUV", consultations=38),
                VehiclePopularity(model="Corolla 2024", category="Sedán", consultations=32)
            ]
            popular_vehicles = default_vehicles[:3]
        
        print(f"Vehículos populares generados: {len(popular_vehicles)}")
        return popular_vehicles
        
    except Exception as e:
        print(f"Error completo en get_popular_vehicles: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error al obtener vehículos populares: {str(e)}")


@router.get("/", response_model=DashboardData)
async def get_dashboard_data():
    """Obtiene todos los datos del dashboard en una sola llamada"""
    try:
        stats = await get_dashboard_stats()
        recent_activity = await get_recent_activity()
        popular_vehicles = await get_popular_vehicles()
        
        return DashboardData(
            stats=stats,
            recent_activity=recent_activity,
            popular_vehicles=popular_vehicles
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener datos del dashboard: {str(e)}")
