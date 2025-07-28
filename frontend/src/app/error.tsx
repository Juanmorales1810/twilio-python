"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    AlertTriangle,
    RefreshCw,
    Home,
    Bug,
    Car,
    ArrowLeft,
} from "lucide-react";
import Link from "next/link";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Application error:", error);
    }, [error]);

    const handleRefresh = () => {
        // Intentar resetear el error
        reset();
    };

    const handleReload = () => {
        // Recargar la página completamente
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="bg-orange-500 text-white flex items-center justify-center rounded-full w-20 h-20">
                            <AlertTriangle className="w-10 h-10" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            ¡Algo salió mal!
                        </h1>
                        <p className="text-lg text-gray-600">
                            Ha ocurrido un error inesperado en la aplicación.
                        </p>
                    </div>
                </div>

                {/* Error Details */}
                <Card className="border-orange-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-orange-700">
                            <Bug className="w-5 h-5" />
                            Detalles del Error
                        </CardTitle>
                        <CardDescription>
                            Información técnica para ayudar a resolver el
                            problema
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert className="border-orange-200 bg-orange-50">
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                            <AlertDescription className="text-orange-800">
                                <strong>Error:</strong>{" "}
                                {error.message || "Error desconocido"}
                            </AlertDescription>
                        </Alert>

                        {error.digest && (
                            <div className="text-sm text-gray-500">
                                <strong>ID del Error:</strong> {error.digest}
                            </div>
                        )}

                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded border">
                            <strong>¿Qué puedes hacer?</strong>
                            <ul className="mt-2 space-y-1 list-disc list-inside">
                                <li>Intenta recargar la página</li>
                                <li>Verifica tu conexión a internet</li>
                                <li>
                                    Si el problema persiste, contacta al soporte
                                    técnico
                                </li>
                                <li>Intenta volver a la página anterior</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        onClick={handleRefresh}
                        className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Intentar de Nuevo
                    </Button>

                    <Button
                        onClick={handleReload}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Recargar Página
                    </Button>

                    <Button
                        onClick={() => window.history.back()}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver Atrás
                    </Button>
                </div>

                {/* Navigation Links */}
                <Card className="bg-white/70 backdrop-blur">
                    <CardHeader>
                        <CardTitle className="text-center">
                            Páginas Alternativas
                        </CardTitle>
                        <CardDescription className="text-center">
                            Mientras solucionamos el problema, puedes visitar
                            estas páginas
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Link href="/" className="group">
                                <div className="flex items-center gap-3 p-4 rounded-lg border hover:border-orange-300 hover:bg-orange-50 transition-colors">
                                    <Home className="w-5 h-5 text-orange-600" />
                                    <div>
                                        <div className="font-medium group-hover:text-orange-700">
                                            Página Principal
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Volver al inicio
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            <Link href="/admin" className="group">
                                <div className="flex items-center gap-3 p-4 rounded-lg border hover:border-orange-300 hover:bg-orange-50 transition-colors">
                                    <Car className="w-5 h-5 text-orange-600" />
                                    <div>
                                        <div className="font-medium group-hover:text-orange-700">
                                            Panel de Admin
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Dashboard administrativo
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Support Information */}
                <div className="text-center text-sm text-gray-500 space-y-2">
                    <p>
                        Si el problema persiste, por favor contacta al soporte
                        técnico:
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <span>📧 soporte@toyotasanjuan.com</span>
                        <span>📞 +1 (787) 123-4567</span>
                    </div>
                    <p className="text-xs mt-4">
                        Toyota San Juan - Sistema de Gestión de Chatbot
                    </p>
                </div>
            </div>
        </div>
    );
}
