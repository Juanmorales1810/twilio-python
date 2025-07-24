"""
Utilidades de mantenimiento para el chatbot de Toyota
"""

import os
import asyncio
from datetime import datetime, timedelta
from typing import Dict, List
from dotenv import load_dotenv
from database.connection import DatabaseManager
from config import Config

load_dotenv()

class MaintenanceTools:
    """Herramientas de mantenimiento y administración"""
    
    def __init__(self):
        self.db = DatabaseManager()
    
    def cleanup_expired_data(self) -> Dict[str, int]:
        """Limpia todos los datos expirados"""
        print("🧹 Iniciando limpieza de datos expirados...")
        
        current_time = datetime.utcnow()
        
        # Limpiar usuarios expirados
        expired_users = self.db.users_collection.delete_many({
            "expires_at": {"$lt": current_time}
        })
        
        # Limpiar mensajes expirados
        expired_messages = self.db.messages_collection.delete_many({
            "expires_at": {"$lt": current_time}
        })
        
        result = {
            "users_deleted": expired_users.deleted_count,
            "messages_deleted": expired_messages.deleted_count,
            "cleanup_time": current_time.isoformat()
        }
        
        print(f"✅ Limpieza completada:")
        print(f"   - Usuarios eliminados: {result['users_deleted']}")
        print(f"   - Mensajes eliminados: {result['messages_deleted']}")
        
        return result
    
    def get_system_stats(self) -> Dict:
        """Obtiene estadísticas del sistema"""
        print("📊 Generando estadísticas del sistema...")
        
        current_time = datetime.utcnow()
        last_24h = current_time - timedelta(hours=24)
        last_7d = current_time - timedelta(days=7)
        
        stats = {
            "timestamp": current_time.isoformat(),
            "users": {
                "total_active": self.db.users_collection.count_documents({
                    "expires_at": {"$gt": current_time}
                }),
                "new_last_24h": self.db.users_collection.count_documents({
                    "created_at": {"$gte": last_24h}
                }),
                "total_ever": self.db.users_collection.count_documents({})
            },
            "messages": {
                "total_active": self.db.messages_collection.count_documents({
                    "expires_at": {"$gt": current_time}
                }),
                "last_24h": self.db.messages_collection.count_documents({
                    "timestamp": {"$gte": last_24h}
                }),
                "last_7d": self.db.messages_collection.count_documents({
                    "timestamp": {"$gte": last_7d}
                })
            },
            "appointments": {
                "total": self.db.appointments_collection.count_documents({}),
                "pending": self.db.appointments_collection.count_documents({
                    "status": "pendiente"
                }),
                "confirmed": self.db.appointments_collection.count_documents({
                    "status": "confirmada"
                }),
                "cancelled": self.db.appointments_collection.count_documents({
                    "status": "cancelada"
                }),
                "last_7d": self.db.appointments_collection.count_documents({
                    "created_at": {"$gte": last_7d}
                })
            }
        }
        
        return stats
    
    def print_stats(self, stats: Dict):
        """Imprime estadísticas formateadas"""
        print("\n📈 ESTADÍSTICAS DEL SISTEMA")
        print("=" * 50)
        
        print(f"\n👥 USUARIOS:")
        print(f"   Activos: {stats['users']['total_active']}")
        print(f"   Nuevos (24h): {stats['users']['new_last_24h']}")
        print(f"   Total histórico: {stats['users']['total_ever']}")
        
        print(f"\n💬 MENSAJES:")
        print(f"   Activos: {stats['messages']['total_active']}")
        print(f"   Últimas 24h: {stats['messages']['last_24h']}")
        print(f"   Últimos 7 días: {stats['messages']['last_7d']}")
        
        print(f"\n📅 CITAS:")
        print(f"   Total: {stats['appointments']['total']}")
        print(f"   Pendientes: {stats['appointments']['pending']}")
        print(f"   Confirmadas: {stats['appointments']['confirmed']}")
        print(f"   Canceladas: {stats['appointments']['cancelled']}")
        print(f"   Últimos 7 días: {stats['appointments']['last_7d']}")
        
        print(f"\n🕒 Generado: {stats['timestamp']}")
    
    def export_appointments(self, days_back: int = 30) -> List[Dict]:
        """Exporta citas de los últimos N días"""
        print(f"📋 Exportando citas de los últimos {days_back} días...")
        
        cutoff_date = datetime.utcnow() - timedelta(days=days_back)
        
        appointments = list(self.db.appointments_collection.find({
            "created_at": {"$gte": cutoff_date}
        }).sort("created_at", -1))
        
        # Convertir ObjectIds a strings para JSON
        for app in appointments:
            app["_id"] = str(app["_id"])
            if "created_at" in app:
                app["created_at"] = app["created_at"].isoformat()
            if "preferred_date" in app:
                app["preferred_date"] = app["preferred_date"].isoformat()
        
        print(f"✅ {len(appointments)} citas exportadas")
        return appointments
    
    def backup_database(self, backup_path: str = None):
        """Crea un respaldo básico de datos importantes"""
        if not backup_path:
            timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
            backup_path = f"backup_toyota_chatbot_{timestamp}.json"
        
        print(f"💾 Creando respaldo en: {backup_path}")
        
        import json
        
        backup_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "stats": self.get_system_stats(),
            "appointments": self.export_appointments(365),  # Último año
            "system_config": list(self.db.db.system_config.find({}))
        }
        
        # Convertir ObjectIds a strings
        for item in backup_data["system_config"]:
            if "_id" in item:
                item["_id"] = str(item["_id"])
            if "last_updated" in item:
                item["last_updated"] = item["last_updated"].isoformat()
        
        with open(backup_path, 'w', encoding='utf-8') as f:
            json.dump(backup_data, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Respaldo creado exitosamente")
        return backup_path
    
    def reset_user_session(self, phone_number: str):
        """Resetea la sesión de un usuario específico"""
        print(f"🔄 Reseteando sesión para: {phone_number}")
        
        self.db.reset_user_conversation(phone_number)
        
        print("✅ Sesión reseteada")
    
    def list_active_conversations(self) -> List[Dict]:
        """Lista conversaciones activas"""
        current_time = datetime.utcnow()
        
        active_users = list(self.db.users_collection.find({
            "expires_at": {"$gt": current_time}
        }, {
            "phone_number": 1,
            "current_step": 1,
            "updated_at": 1,
            "conversation_data.nombre": 1
        }))
        
        return active_users


def main():
    """Función principal para ejecutar mantenimiento"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Herramientas de mantenimiento Toyota Chatbot')
    parser.add_argument('--cleanup', action='store_true', help='Limpiar datos expirados')
    parser.add_argument('--stats', action='store_true', help='Mostrar estadísticas')
    parser.add_argument('--backup', action='store_true', help='Crear respaldo')
    parser.add_argument('--reset-user', type=str, help='Resetear sesión de usuario (teléfono)')
    parser.add_argument('--list-active', action='store_true', help='Listar conversaciones activas')
    parser.add_argument('--export-appointments', type=int, default=30, help='Exportar citas (días hacia atrás)')
    
    args = parser.parse_args()
    
    tools = MaintenanceTools()
    
    if args.cleanup:
        tools.cleanup_expired_data()
    
    if args.stats:
        stats = tools.get_system_stats()
        tools.print_stats(stats)
    
    if args.backup:
        tools.backup_database()
    
    if args.reset_user:
        tools.reset_user_session(args.reset_user)
    
    if args.list_active:
        active = tools.list_active_conversations()
        print(f"\n🔄 Conversaciones activas ({len(active)}):")
        for user in active:
            name = user.get('conversation_data', {}).get('nombre', 'Sin nombre')
            print(f"   📱 {user['phone_number']} | {user['current_step']} | {name}")
    
    if args.export_appointments:
        appointments = tools.export_appointments(args.export_appointments)
        filename = f"appointments_export_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.json"
        
        import json
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(appointments, f, indent=2, ensure_ascii=False)
        
        print(f"📋 Citas exportadas a: {filename}")
    
    if not any(vars(args).values()):
        print("🔧 Herramientas de mantenimiento disponibles:")
        print("   python maintenance.py --cleanup          # Limpiar datos expirados")
        print("   python maintenance.py --stats            # Mostrar estadísticas")
        print("   python maintenance.py --backup           # Crear respaldo")
        print("   python maintenance.py --list-active      # Listar conversaciones activas")
        print("   python maintenance.py --reset-user +5215551234567  # Resetear usuario")
        print("   python maintenance.py --export-appointments 30     # Exportar citas")


if __name__ == "__main__":
    main()
