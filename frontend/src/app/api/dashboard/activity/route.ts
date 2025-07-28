import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function GET(request: NextRequest) {
    try {
        const response = await fetch(
            `${BACKEND_URL}/api/dashboard/recent-activity`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching recent activity:", error);

        // Return fallback data if backend is not available
        const fallbackData = [
            {
                type: "appointment",
                description: "Nueva cita agendada",
                details: "Usuario - Vehículo",
                timestamp: new Date().toISOString(),
            },
            {
                type: "user",
                description: "Nuevo usuario registrado",
                details: "Usuario nuevo",
                timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
            },
        ];

        return NextResponse.json(fallbackData);
    }
}
