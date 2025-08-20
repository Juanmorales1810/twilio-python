from typing import Dict, List
from models.user import VehicleInfo


class ToyotaVehicleService:
    """Servicio para manejar información de vehículos Toyota"""
    
    def __init__(self):
        self.vehicles_data = {}

    def get_vehicle_info(self, model_name: str) -> VehicleInfo:
        """Obtiene información de un vehículo específico"""
        model_key = model_name.lower().replace(" ", "")
        return self.vehicles_data.get(model_key)

    def get_all_vehicles(self) -> List[VehicleInfo]:
        """Obtiene información de todos los vehículos"""
        return list(self.vehicles_data.values())

    def search_vehicles_by_budget(self, min_price: int, max_price: int) -> List[VehicleInfo]:
        """Busca vehículos dentro de un rango de presupuesto"""
        suitable_vehicles = []
        for vehicle in self.vehicles_data.values():
            # Extraer precio mínimo del rango (simplificado)
            price_range = vehicle.price_range.replace("$", "").replace(",", "")
            min_vehicle_price = int(price_range.split(" - ")[0])
            if min_price <= min_vehicle_price <= max_price:
                suitable_vehicles.append(vehicle)
        return suitable_vehicles

    def get_vehicle_categories(self) -> Dict[str, List[str]]:
        """Obtiene categorías de vehículos"""
        return {
            "sedanes": ["corolla", "camry"],
            "suv": ["rav4", "highlander"],
            "hibridos": ["prius"],
            "pickups": ["tacoma"]
        }

    def get_vehicles_by_category(self, category: str) -> List[VehicleInfo]:
        """Obtiene vehículos por categoría"""
        categories = self.get_vehicle_categories()
        vehicle_names = categories.get(category.lower(), [])
        return [self.vehicles_data[name] for name in vehicle_names if name in self.vehicles_data]
