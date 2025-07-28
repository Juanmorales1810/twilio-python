export interface DashboardStats {
    total_users: number;
    total_users_growth: number;
    pending_appointments: number;
    appointments_today: number;
    available_vehicles: number;
    messages_today: number;
    messages_growth: number;
}

export interface RecentActivity {
    type: "appointment" | "user" | "message";
    description: string;
    details: string;
    timestamp: string;
}

export interface VehiclePopularity {
    model: string;
    category: string;
    consultations: number;
}

export interface DashboardData {
    stats: DashboardStats;
    recent_activity: RecentActivity[];
    popular_vehicles: VehiclePopularity[];
}
