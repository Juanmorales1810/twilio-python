"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Car, Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        console.log("Submitting login:", { username, password });

        try {
            const response = await fetch("/api/auth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            console.log("Response status:", response.status);
            const data = await response.json();
            console.log("Response data:", data);

            if (data.success) {
                console.log("Login successful, redirecting...");

                // Intentar múltiples métodos de redirección
                setTimeout(() => {
                    window.location.href = "/admin";
                }, 100);

                // También intentar con router
                router.replace("/admin");
            } else {
                setError(data.error || "Error de autenticación");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                        <Car className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-bold">
                            Toyota Admin
                        </CardTitle>
                        <CardDescription>
                            Accede al panel de administración del chatbot
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Usuario</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Ingresa tu usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Ingresa tu contraseña"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                    disabled={loading}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    disabled={loading}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-red-600 hover:bg-red-700"
                            disabled={loading}
                        >
                            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        <p>Credenciales por defecto:</p>
                        <p>
                            Usuario:{" "}
                            <code className="bg-muted px-1 rounded">admin</code>
                        </p>
                        <p>
                            Contraseña:{" "}
                            <code className="bg-muted px-1 rounded">
                                admin123
                            </code>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
