import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        console.log("Login attempt:", { username, password });

        // Credenciales predeterminadas para el administrador
        const adminUsername = process.env.ADMIN_USERNAME || "admin";
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

        console.log("Expected credentials:", { adminUsername, adminPassword });

        if (username === adminUsername && password === adminPassword) {
            // Crear JWT token
            const token = jwt.sign(
                { username, role: "admin" },
                process.env.NEXTAUTH_SECRET || "your-secret-key",
                { expiresIn: "24h" }
            );

            console.log("Creating token:", token);

            const response = NextResponse.json({
                success: true,
                message: "Login successful",
                user: { username, role: "admin" },
            });

            // Establecer cookie con el token
            response.cookies.set({
                name: "auth-token",
                value: token,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax", // Cambiar de 'strict' a 'lax'
                maxAge: 86400, // 24 horas
                path: "/",
            });

            console.log("Cookie set in response");

            return response;
        }

        return NextResponse.json(
            { success: false, error: "Credenciales incorrectas" },
            { status: 401 }
        );
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { success: false, error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}

export async function DELETE() {
    try {
        const response = NextResponse.json({
            success: true,
            message: "Logout successful",
        });

        // Limpiar cookie de autenticación
        response.cookies.delete("auth-token");

        return response;
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
