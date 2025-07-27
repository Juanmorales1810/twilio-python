"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Car, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        Dashboard
                    </h2>
                    <p className="text-muted-foreground">
                        Resumen general del sistema de chatbot Toyota San Juan
                    </p>
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
                                <div className="text-2xl font-bold">245</div>
                                <p className="text-xs text-muted-foreground">
                                    +12% desde el mes pasado
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
                                <div className="text-2xl font-bold">15</div>
                                <p className="text-xs text-muted-foreground">
                                    3 para hoy
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
                                <div className="text-2xl font-bold">6</div>
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
                                <div className="text-2xl font-bold">127</div>
                                <p className="text-xs text-muted-foreground">
                                    +23% desde ayer
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
                                <div className="flex items-center space-x-4">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">
                                            Nueva cita agendada
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Juan Morales - Prius 2024
                                        </p>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        hace 5 min
                                    </p>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">
                                            Nuevo usuario registrado
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            María García
                                        </p>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        hace 15 min
                                    </p>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">
                                            Cita confirmada
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Carlos López - RAV4 2024
                                        </p>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        hace 30 min
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Vehículos Más Consultados</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium">
                                            Prius 2024
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Híbrido
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold">45</p>
                                        <p className="text-xs text-muted-foreground">
                                            consultas
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium">
                                            RAV4 2024
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            SUV
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold">38</p>
                                        <p className="text-xs text-muted-foreground">
                                            consultas
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium">
                                            Corolla 2024
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Sedán
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold">32</p>
                                        <p className="text-xs text-muted-foreground">
                                            consultas
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
