"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Download,
    FileText,
    Calendar,
    TrendingUp,
    Users,
    MessageSquare,
    Car,
    Clock,
    Filter,
    Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const reports = [
    {
        id: 1,
        title: "Reporte Mensual de Conversaciones",
        description:
            "Análisis completo de todas las interacciones del chatbot durante el mes",
        type: "Conversaciones",
        period: "Julio 2025",
        status: "Disponible",
        generatedAt: "2025-07-26",
        size: "2.3 MB",
        format: "PDF",
    },
    {
        id: 2,
        title: "Reporte de Citas Programadas",
        description: "Detalle de todas las citas agendadas y su estado",
        type: "Citas",
        period: "Última semana",
        status: "Disponible",
        generatedAt: "2025-07-25",
        size: "1.8 MB",
        format: "Excel",
    },
    {
        id: 3,
        title: "Análisis de Satisfacción del Cliente",
        description: "Métricas de satisfacción basadas en feedback de usuarios",
        type: "Usuarios",
        period: "Julio 2025",
        status: "Generando",
        generatedAt: "-",
        size: "-",
        format: "PDF",
    },
    {
        id: 4,
        title: "Reporte de Vehículos Más Consultados",
        description: "Estadísticas de interés por modelo de vehículo",
        type: "Vehículos",
        period: "Último trimestre",
        status: "Disponible",
        generatedAt: "2025-07-24",
        size: "956 KB",
        format: "PDF",
    },
    {
        id: 5,
        title: "Reporte de Rendimiento del Bot",
        description: "Métricas de rendimiento y tiempo de respuesta",
        type: "Sistema",
        period: "Julio 2025",
        status: "Programado",
        generatedAt: "-",
        size: "-",
        format: "PDF",
    },
];

const quickReports = [
    {
        title: "Resumen Diario",
        description: "Actividad de hoy",
        icon: Calendar,
        count: "Hoy",
    },
    {
        title: "Usuarios Nuevos",
        description: "Esta semana",
        icon: Users,
        count: "+23",
    },
    {
        title: "Citas Confirmadas",
        description: "Últimas 24h",
        icon: TrendingUp,
        count: "12",
    },
    {
        title: "Mensajes Procesados",
        description: "Último hora",
        icon: MessageSquare,
        count: "87",
    },
];

function getStatusBadge(status: string) {
    switch (status) {
        case "Disponible":
            return (
                <Badge className="bg-green-100 text-green-800">
                    Disponible
                </Badge>
            );
        case "Generando":
            return (
                <Badge className="bg-yellow-100 text-yellow-800">
                    Generando
                </Badge>
            );
        case "Programado":
            return (
                <Badge className="bg-blue-100 text-blue-800">Programado</Badge>
            );
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
}

function getTypeColor(type: string) {
    switch (type) {
        case "Conversaciones":
            return "bg-purple-100 text-purple-800";
        case "Citas":
            return "bg-green-100 text-green-800";
        case "Usuarios":
            return "bg-blue-100 text-blue-800";
        case "Vehículos":
            return "bg-orange-100 text-orange-800";
        case "Sistema":
            return "bg-gray-100 text-gray-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
}

export default function ReportsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Reportes
                        </h2>
                        <p className="text-muted-foreground">
                            Genera y descarga reportes detallados del sistema
                        </p>
                    </div>
                    <Button>
                        <FileText className="h-4 w-4 mr-2" />
                        Generar Reporte
                    </Button>
                </div>

                {/* Quick Reports */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {quickReports.map((report, index) => (
                        <Card
                            key={index}
                            className="cursor-pointer hover:shadow-lg transition-shadow"
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <report.icon className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">
                                            {report.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {report.description}
                                        </p>
                                        <p className="text-lg font-bold text-blue-600 mt-1">
                                            {report.count}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filtros de Reportes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4 items-center">
                            <div className="flex-1">
                                <Input
                                    placeholder="Buscar reportes..."
                                    className="max-w-sm"
                                />
                            </div>
                            <Select>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Tipo de reporte" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="conversations">
                                        Conversaciones
                                    </SelectItem>
                                    <SelectItem value="appointments">
                                        Citas
                                    </SelectItem>
                                    <SelectItem value="users">
                                        Usuarios
                                    </SelectItem>
                                    <SelectItem value="vehicles">
                                        Vehículos
                                    </SelectItem>
                                    <SelectItem value="system">
                                        Sistema
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Select>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="available">
                                        Disponible
                                    </SelectItem>
                                    <SelectItem value="generating">
                                        Generando
                                    </SelectItem>
                                    <SelectItem value="scheduled">
                                        Programado
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Reports List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Reportes Disponibles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {reports.map((report) => (
                                <div
                                    key={report.id}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold">
                                                {report.title}
                                            </h3>
                                            <Badge
                                                variant="outline"
                                                className={getTypeColor(
                                                    report.type
                                                )}
                                            >
                                                {report.type}
                                            </Badge>
                                            {getStatusBadge(report.status)}
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-1">
                                            {report.description}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {report.period}
                                            </span>
                                            {report.generatedAt !== "-" && (
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    Generado:{" "}
                                                    {report.generatedAt}
                                                </span>
                                            )}
                                            {report.size !== "-" && (
                                                <span>
                                                    Tamaño: {report.size}
                                                </span>
                                            )}
                                            {report.format && (
                                                <span>
                                                    Formato: {report.format}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {report.status === "Disponible" && (
                                            <Button size="sm" variant="outline">
                                                <Download className="h-4 w-4 mr-2" />
                                                Descargar
                                            </Button>
                                        )}
                                        {report.status === "Generando" && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                disabled
                                            >
                                                <Clock className="h-4 w-4 mr-2" />
                                                Generando...
                                            </Button>
                                        )}
                                        {report.status === "Programado" && (
                                            <Button size="sm" variant="outline">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                Ver Programación
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
