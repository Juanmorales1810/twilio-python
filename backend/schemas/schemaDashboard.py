from pydantic import BaseModel
from datetime import datetime

class DashboardStats(BaseModel):
    total_users: int
    total_users_growth: float
    pending_appointments: int
    appointments_today: int
    available_vehicles: int
    messages_today: int
    messages_growth: float


class RecentActivity(BaseModel):
    type: str  # "appointment", "user", "message"
    description: str
    details: str
    timestamp: datetime


class VehiclePopularity(BaseModel):
    model: str
    category: str
    consultations: int


class DashboardData(BaseModel):
    stats: DashboardStats
    recent_activity: list[RecentActivity]
    popular_vehicles: list[VehiclePopularity]