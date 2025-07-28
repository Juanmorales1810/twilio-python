"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Users,
    Calendar,
    Car,
    MessageSquare,
    RefreshCw,
    TrendingUp,
    TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useDashboardData } from "@/hooks/useDashboard";

function formatTimeAgo(timestamp: string): string {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor(
        (now.getTime() - time.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "hace un momento";
    if (diffInMinutes < 60) return `hace ${diffInMinutes} min`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `hace ${diffInHours}h`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `hace ${diffInDays}d`;
}

function getActivityIcon(type: string) {
    switch (type) {
        case "appointment":
            return "bg-green-500";
        case "user":
            return "bg-blue-500";
        case "message":
            return "bg-purple-500";
        default:
            return "bg-gray-500";
    }
}

export default function AdminPage() {
    const { data, loading, error, refetch } = useDashboardData();

    if (loading) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Dashboard Principal
                        </h2>
                        <p className="text-muted-foreground">
                            Cargando datos del sistema...
                        </p>
                    </div>

                    {/* Loading skeleton */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {[...Array(4)].map((_, i) => (
                            <Card key={i}>
                                <CardContent className="p-6">
                                    <div className="animate-pulse space-y-3">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight">
                                Dashboard Principal
                            </h2>
                            <p className="text-muted-foreground">
                                Error al cargar los datos del sistema
                            </p>
                        </div>
                        <Button onClick={refetch} variant="outline">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reintentar
                        </Button>
                    </div>

                    <Card>
                        <CardContent className="p-6">
                            <p className="text-red-600">Error: {error}</p>
                        </CardContent>
                    </Card>
                </div>
            </DashboardLayout>
        );
    }

    const stats = data?.stats;
    const recentActivity = data?.recent_activity || [];
    const popularVehicles = data?.popular_vehicles || [];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Dashboard Principal
                        </h2>
                        <p className="text-muted-foreground">
                            Resumen general del sistema de chatbot Toyota San
                            Juan
                        </p>
                    </div>
                    <Button onClick={refetch} variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Actualizar
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 className="tracking-tight text-sm font-medium">
                                    Total Usuarios
                                </h3>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">
                                    {stats?.total_users || 0}
                                </div>
                                <p className="text-xs text-muted-foreground flex items-center">
                                    {stats?.total_users_growth &&
                                    stats.total_users_growth > 0 ? (
                                        <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                                    ) : (
                                        <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                                    )}
                                    {stats?.total_users_growth
                                        ? `${Math.abs(
                                              stats.total_users_growth
                                          )}% desde el mes pasado`
                                        : "Sin datos previos"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 className="tracking-tight text-sm font-medium">
                                    Citas Pendientes
                                </h3>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">
                                    {stats?.pending_appointments || 0}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {stats?.appointments_today || 0} para hoy
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 className="tracking-tight text-sm font-medium">
                                    Vehículos Disponibles
                                </h3>
                                <Car className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">
                                    {stats?.available_vehicles || 6}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Todos los modelos
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 className="tracking-tight text-sm font-medium">
                                    Mensajes Hoy
                                </h3>
                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">
                                    {stats?.messages_today || 0}
                                </div>
                                <p className="text-xs text-muted-foreground flex items-center">
                                    {stats?.messages_growth &&
                                    stats.messages_growth > 0 ? (
                                        <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                                    ) : (
                                        <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                                    )}
                                    {stats?.messages_growth
                                        ? `${Math.abs(
                                              stats.messages_growth
                                          )}% desde ayer`
                                        : "Sin actividad previa"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Link href="/admin/users">
                        <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Users className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">
                                            Gestionar Usuarios
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Ver y administrar usuarios
                                            registrados
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/appointments">
                        <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Calendar className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">
                                            Ver Citas
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Administrar citas programadas
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/vehicles">
                        <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-orange-100 rounded-lg">
                                        <Car className="h-6 w-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">
                                            Vehículos
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Gestionar catálogo de vehículos
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/admin/conversations">
                        <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <MessageSquare className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">
                                            Conversaciones
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            Revisar historial de chats
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>

                {/* Recent Activity */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Actividad Reciente</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivity.length > 0 ? (
                                    recentActivity.map((activity, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center space-x-4"
                                        >
                                            <div
                                                className={`w-2 h-2 rounded-full ${getActivityIcon(
                                                    activity.type
                                                )}`}
                                            ></div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">
                                                    {activity.description}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {activity.details}
                                                </p>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {formatTimeAgo(
                                                    activity.timestamp
                                                )}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No hay actividad reciente
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Vehículos Más Consultados</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {popularVehicles.length > 0 ? (
                                    popularVehicles.map((vehicle, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between"
                                        >
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {vehicle.model}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {vehicle.category}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold">
                                                    {vehicle.consultations}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    consultas
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No hay datos de consultas disponibles
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
