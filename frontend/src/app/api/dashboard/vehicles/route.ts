import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function GET(request: NextRequest) {
    try {
        const response = await fetch(
            `${BACKEND_URL}/api/dashboard/popular-vehicles`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching popular vehicles:", error);

        // Return fallback data if backend is not available
        const fallbackData = [
            {
                model: "Prius 2024",
                category: "Híbrido",
                consultations: 0,
            },
            {
                model: "RAV4 2024",
                category: "SUV",
                consultations: 0,
            },
            {
                model: "Corolla 2024",
                category: "Sedán",
                consultations: 0,
            },
        ];

        return NextResponse.json(fallbackData);
    }
}
