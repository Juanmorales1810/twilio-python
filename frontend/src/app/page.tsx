"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Users, Calendar, MessageSquare, BarChart } from "lucide-react";
import Link from "next/link";

export default function Home() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                                <Car className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Toyota San Juan
                                </h1>
                                <p className="text-sm text-gray-600">
                                    Sistema de Gestión de Chatbot
                                </p>
                            </div>
                        </div>
                        <Link href="/admin/login">
                            <Button className="bg-red-600 hover:bg-red-700">
                                Acceder al Admin
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Panel de Administración
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Gestiona usuarios, citas, vehículos y conversaciones del
                        chatbot de WhatsApp de Toyota San Juan
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    <Card className="text-center hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                            <CardTitle className="text-lg">
                                Gestión de Usuarios
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                Administra usuarios registrados, revisa sus
                                datos y estado de conversaciones
                            </CardDescription>
                        </CardContent>
                    </Card>

                    <Card className="text-center hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Calendar className="h-6 w-6 text-green-600" />
                            </div>
                            <CardTitle className="text-lg">
                                Citas Programadas
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                Visualiza y gestiona todas las citas de prueba
                                de manejo programadas
                            </CardDescription>
                        </CardContent>
                    </Card>

                    <Card className="text-center hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Car className="h-6 w-6 text-orange-600" />
                            </div>
                            <CardTitle className="text-lg">
                                Catálogo Toyota
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                Administra el catálogo de vehículos disponibles
                                y sus especificaciones
                            </CardDescription>
                        </CardContent>
                    </Card>

                    <Card className="text-center hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <MessageSquare className="h-6 w-6 text-purple-600" />
                            </div>
                            <CardTitle className="text-lg">
                                Conversaciones
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                Revisa el historial completo de conversaciones
                                del chatbot
                            </CardDescription>
                        </CardContent>
                    </Card>
                </div>

                {/* Stats Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                        Estadísticas del Sistema
                    </h3>
                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-2">
                                245
                            </div>
                            <div className="text-gray-600">
                                Usuarios Registrados
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-600 mb-2">
                                15
                            </div>
                            <div className="text-gray-600">
                                Citas Pendientes
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-orange-600 mb-2">
                                6
                            </div>
                            <div className="text-gray-600">
                                Vehículos Disponibles
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600 mb-2">
                                127
                            </div>
                            <div className="text-gray-600">Mensajes Hoy</div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center">
                    <div className="bg-red-600 text-white rounded-2xl p-8">
                        <h3 className="text-2xl font-bold mb-4">
                            ¿Listo para comenzar?
                        </h3>
                        <p className="text-red-100 mb-6">
                            Accede al panel de administración para gestionar tu
                            sistema de chatbot
                        </p>
                        <Link href="/admin/login">
                            <Button
                                size="lg"
                                variant="secondary"
                                className="bg-white text-red-600 hover:bg-gray-50"
                            >
                                Iniciar Sesión
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <Car className="h-5 w-5" />
                        <span className="font-semibold">Toyota San Juan</span>
                    </div>
                    <p className="text-gray-400">
                        Sistema de administración de chatbot -{" "}
                        {new Date().getFullYear()}
                    </p>
                </div>
            </footer>
        </div>
    );
}
