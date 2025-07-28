"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Home,
    ArrowLeft,
    Settings,
    Users,
    Calendar,
    Car,
    MessageSquare,
    BarChart3,
    Shield,
} from "lucide-react";
import Link from "next/link";

export default function AdminNotFound() {
    const adminRoutes = [
        {
            href: "/admin",
            icon: Home,
            title: "Dashboard",
            description: "Panel principal",
        },
        {
            href: "/admin/users",
            icon: Users,
            title: "Usuarios",
            description: "Gestión de usuarios",
        },
        {
            href: "/admin/appointments",
            icon: Calendar,
            title: "Citas",
            description: "Sistema de citas",
        },
        {
            href: "/admin/vehicles",
            icon: Car,
            title: "Vehículos",
            description: "Catálogo de vehículos",
        },
        {
            href: "/admin/conversations",
            icon: MessageSquare,
            title: "Conversaciones",
            description: "Historial de chats",
        },
        {
            href: "/admin/stats",
            icon: BarChart3,
            title: "Estadísticas",
            description: "Métricas y reportes",
        },
        {
            href: "/admin/settings",
            icon: Settings,
            title: "Configuración",
            description: "Ajustes del sistema",
        },
        {
            href: "/admin/analytics",
            icon: BarChart3,
            title: "Analytics",
            description: "Análisis avanzado",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="bg-red-600 text-white flex items-center justify-center rounded-full w-20 h-20">
                            <Shield className="w-10 h-10" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Página no encontrada
                    </h1>
                    <p className="text-xl text-gray-600 mb-4">
                        La página del panel de administración que buscas no
                        existe.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                            onClick={() => window.history.back()}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Volver Atrás
                        </Button>
                        <Link href="/admin">
                            <Button className="flex items-center gap-2 bg-red-600 hover:bg-red-700">
                                <Home className="w-4 h-4" />
                                Dashboard Principal
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Admin Routes Grid */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Páginas Disponibles del Panel de Administración
                        </CardTitle>
                        <CardDescription>
                            Selecciona una de las siguientes páginas para
                            continuar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {adminRoutes.map((route, index) => {
                                const Icon = route.icon;
                                return (
                                    <Link
                                        key={index}
                                        href={route.href}
                                        className="group"
                                    >
                                        <div className="flex flex-col items-center p-6 rounded-lg border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200 group-hover:scale-105">
                                            <Icon className="w-8 h-8 text-red-600 mb-3" />
                                            <h3 className="font-semibold text-gray-900 group-hover:text-red-700 mb-1">
                                                {route.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 text-center">
                                                {route.description}
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Additional Help */}
                <div className="mt-8 text-center">
                    <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-center gap-2 mb-3">
                                <Shield className="w-5 h-5 text-blue-600" />
                                <h3 className="font-semibold text-blue-900">
                                    ¿Necesitas ayuda?
                                </h3>
                            </div>
                            <p className="text-blue-700 mb-4">
                                Si necesitas acceso a una función específica o
                                tienes problemas de permisos, contacta al
                                administrador del sistema.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                <Link href="/admin/settings/permissions">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-blue-300 text-blue-700 hover:bg-blue-100"
                                    >
                                        <Users className="w-4 h-4 mr-2" />
                                        Gestión de Permisos
                                    </Button>
                                </Link>
                                <Link href="/admin/settings">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-blue-300 text-blue-700 hover:bg-blue-100"
                                    >
                                        <Settings className="w-4 h-4 mr-2" />
                                        Configuración
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>Panel de Administración - Toyota San Juan</p>
                </div>
            </div>
        </div>
    );
}
