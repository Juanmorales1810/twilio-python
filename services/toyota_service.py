from typing import Dict, List
from models.user import VehicleInfo


class ToyotaVehicleService:
    """Servicio para manejar información de vehículos Toyota"""
    
    def __init__(self):
        self.vehicles_data = {
            "corolla": VehicleInfo(
                model="Corolla",
                year=2024,
                price_range="$23,000 - $28,000",
                description="Sedán compacto confiable y eficiente en combustible",
                features=["Toyota Safety Sense 2.0", "Sistema de entretenimiento", "Cámara de reversa"]
            ),
            "camry": VehicleInfo(
                model="Camry",
                year=2024,
                price_range="$28,000 - $35,000",
                description="Sedán mediano con tecnología avanzada y rendimiento superior",
                features=["Sistema híbrido disponible", "Pantalla táctil de 9 pulgadas", "Asientos con calefacción"]
            ),
            "rav4": VehicleInfo(
                model="RAV4",
                year=2024,
                price_range="$32,000 - $40,000",
                description="SUV compacta perfecta para aventuras familiares",
                features=["Tracción en las cuatro ruedas", "Amplio espacio de carga", "Excelente altura al suelo"]
            ),
            "highlander": VehicleInfo(
                model="Highlander",
                year=2024,
                price_range="$38,000 - $48,000",
                description="SUV de tres filas ideal para familias grandes",
                features=["8 asientos", "Motor V6 potente", "Sistema de entretenimiento trasero"]
            ),
            "prius": VehicleInfo(
                model="Prius",
                year=2024,
                price_range="$28,000 - $33,000",
                description="Híbrido líder en eficiencia de combustible",
                features=["50+ MPG", "Tecnología híbrida avanzada", "Diseño aerodinámico"]
            ),
            "tacoma": VehicleInfo(
                model="Tacoma",
                year=2024,
                price_range="$35,000 - $45,000",
                description="Pickup mediana resistente y confiable",
                features=["Capacidad de remolque de 6,800 lbs", "Tracción 4x4", "Carrocería resistente"]
            )
        }

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
