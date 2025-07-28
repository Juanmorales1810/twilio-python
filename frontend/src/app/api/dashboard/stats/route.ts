import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function GET(request: NextRequest) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/dashboard/stats`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);

        // Return fallback data if backend is not available
        const fallbackData = {
            total_users: 0,
            total_users_growth: 0,
            pending_appointments: 0,
            appointments_today: 0,
            available_vehicles: 6,
            messages_today: 0,
            messages_growth: 0,
        };

        return NextResponse.json(fallbackData);
    }
}
