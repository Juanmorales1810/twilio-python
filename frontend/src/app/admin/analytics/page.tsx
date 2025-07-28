"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
} from "recharts";
import {
    TrendingUp,
    TrendingDown,
    Users,
    MessageSquare,
    Calendar,
    Car,
    Activity,
    Target,
    Clock,
    Star,
    Download,
    Filter,
} from "lucide-react";

// Datos para los gráficos
const conversationData = [
    { month: "Ene", conversaciones: 1200, satisfaccion: 4.2, resueltas: 1080 },
    { month: "Feb", conversaciones: 1350, satisfaccion: 4.3, resueltas: 1215 },
    { month: "Mar", conversaciones: 1180, satisfaccion: 4.1, resueltas: 1062 },
    { month: "Abr", conversaciones: 1420, satisfaccion: 4.4, resueltas: 1278 },
    { month: "May", conversaciones: 1580, satisfaccion: 4.5, resueltas: 1422 },
    { month: "Jun", conversaciones: 1750, satisfaccion: 4.6, resueltas: 1575 },
];

const appointmentData = [
    { day: "Lun", agendadas: 45, completadas: 42, canceladas: 3 },
    { day: "Mar", agendadas: 52, completadas: 48, canceladas: 4 },
    { day: "Mié", agendadas: 38, completadas: 35, canceladas: 3 },
    { day: "Jue", agendadas: 61, completadas: 56, canceladas: 5 },
    { day: "Vie", agendadas: 58, completadas: 54, canceladas: 4 },
    { day: "Sáb", agendadas: 33, completadas: 30, canceladas: 3 },
    { day: "Dom", agendadas: 28, completadas: 25, canceladas: 3 },
];

const vehicleInterestData = [
    { name: "Corolla", value: 35, color: "#dc2626" },
    { name: "Camry", value: 28, color: "#ea580c" },
    { name: "RAV4", value: 20, color: "#ca8a04" },
    { name: "Highlander", value: 12, color: "#16a34a" },
    { name: "Prius", value: 5, color: "#2563eb" },
];

const userEngagementData = [
    { hour: "00", usuarios: 12, interacciones: 45 },
    { hour: "06", usuarios: 18, interacciones: 72 },
    { hour: "12", usuarios: 145, interacciones: 580 },
    { hour: "18", usuarios: 98, interacciones: 392 },
    { hour: "24", usuarios: 25, interacciones: 100 },
];

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Analytics Avanzado
                    </h1>
                    <p className="text-muted-foreground">
                        Análisis profundo del rendimiento y comportamiento del
                        sistema
                    </p>
                </div>
                <div className="flex gap-2">
                    <Select defaultValue="30d">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7d">Últimos 7 días</SelectItem>
                            <SelectItem value="30d">Últimos 30 días</SelectItem>
                            <SelectItem value="90d">Últimos 90 días</SelectItem>
                            <SelectItem value="1y">Último año</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline">
                        <Filter className="h-4 w-4 mr-2" />
                        Filtros
                    </Button>
                    <Button>
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                    </Button>
                </div>
            </div>

            {/* KPIs Principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Conversaciones Totales
                        </CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8,480</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="inline-flex items-center text-green-600">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                +14.2%
                            </span>
                            desde el mes pasado
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Tasa de Resolución
                        </CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">89.7%</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="inline-flex items-center text-green-600">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                +2.1%
                            </span>
                            desde el mes pasado
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Tiempo Promedio de Respuesta
                        </CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2.3s</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="inline-flex items-center text-red-600">
                                <TrendingDown className="h-3 w-3 mr-1" />
                                -0.4s
                            </span>
                            desde el mes pasado
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Satisfacción del Cliente
                        </CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4.5/5</div>
                        <p className="text-xs text-muted-foreground">
                            <span className="inline-flex items-center text-green-600">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                +0.2
                            </span>
                            desde el mes pasado
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="conversations" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="conversations">
                        Conversaciones
                    </TabsTrigger>
                    <TabsTrigger value="appointments">Citas</TabsTrigger>
                    <TabsTrigger value="vehicles">Vehículos</TabsTrigger>
                    <TabsTrigger value="users">Usuarios</TabsTrigger>
                </TabsList>

                <TabsContent value="conversations" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Tendencia de Conversaciones
                                </CardTitle>
                                <CardDescription>
                                    Volumen mensual de conversaciones y tasa de
                                    resolución
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart data={conversationData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar
                                                dataKey="conversaciones"
                                                fill="#dc2626"
                                                name="Conversaciones"
                                            />
                                            <Bar
                                                dataKey="resueltas"
                                                fill="#16a34a"
                                                name="Resueltas"
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Satisfacción del Cliente</CardTitle>
                                <CardDescription>
                                    Evolución de la puntuación de satisfacción
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <LineChart data={conversationData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis domain={[3.5, 5]} />
                                            <Tooltip />
                                            <Line
                                                type="monotone"
                                                dataKey="satisfaccion"
                                                stroke="#2563eb"
                                                strokeWidth={3}
                                                name="Satisfacción"
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Métricas de Rendimiento</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm">
                                            Precisión del Bot
                                        </span>
                                        <span className="text-sm font-medium">
                                            94.2%
                                        </span>
                                    </div>
                                    <Progress value={94.2} className="h-2" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm">
                                            Tasa de Escalación
                                        </span>
                                        <span className="text-sm font-medium">
                                            12.3%
                                        </span>
                                    </div>
                                    <Progress value={12.3} className="h-2" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm">
                                            Tiempo de Primera Respuesta
                                        </span>
                                        <span className="text-sm font-medium">
                                            1.8s
                                        </span>
                                    </div>
                                    <Progress value={85} className="h-2" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Intenciones Principales</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {[
                                    {
                                        name: "Información de Vehículos",
                                        count: 3420,
                                        percent: 32,
                                    },
                                    {
                                        name: "Agendar Cita",
                                        count: 2180,
                                        percent: 20,
                                    },
                                    {
                                        name: "Precios",
                                        count: 1890,
                                        percent: 18,
                                    },
                                    {
                                        name: "Ubicación",
                                        count: 1250,
                                        percent: 12,
                                    },
                                    {
                                        name: "Financiamiento",
                                        count: 980,
                                        percent: 9,
                                    },
                                ].map((intent, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">
                                                {intent.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {intent.count} consultas
                                            </p>
                                        </div>
                                        <Badge variant="secondary">
                                            {intent.percent}%
                                        </Badge>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Horarios de Mayor Actividad
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {[
                                    { hour: "9:00 - 10:00", activity: 95 },
                                    { hour: "14:00 - 15:00", activity: 88 },
                                    { hour: "11:00 - 12:00", activity: 82 },
                                    { hour: "16:00 - 17:00", activity: 76 },
                                    { hour: "10:00 - 11:00", activity: 71 },
                                ].map((slot, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm">
                                                {slot.hour}
                                            </span>
                                            <span className="text-sm font-medium">
                                                {slot.activity}%
                                            </span>
                                        </div>
                                        <Progress
                                            value={slot.activity}
                                            className="h-2"
                                        />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="appointments" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Citas por Día de la Semana
                                </CardTitle>
                                <CardDescription>
                                    Distribución semanal de citas agendadas y
                                    completadas
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart data={appointmentData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="day" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar
                                                dataKey="agendadas"
                                                fill="#2563eb"
                                                name="Agendadas"
                                            />
                                            <Bar
                                                dataKey="completadas"
                                                fill="#16a34a"
                                                name="Completadas"
                                            />
                                            <Bar
                                                dataKey="canceladas"
                                                fill="#dc2626"
                                                name="Canceladas"
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Tasa de Conversión</CardTitle>
                                <CardDescription>
                                    De consulta inicial a cita agendada
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <AreaChart data={conversationData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip />
                                            <Area
                                                type="monotone"
                                                dataKey="conversaciones"
                                                stackId="1"
                                                stroke="#2563eb"
                                                fill="#2563eb"
                                                fillOpacity={0.6}
                                                name="Conversaciones"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="vehicles" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Vehículos Más Consultados</CardTitle>
                                <CardDescription>
                                    Distribución de interés por modelo
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <PieChart>
                                            <Pie
                                                data={vehicleInterestData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) =>
                                                    `${name} ${percent.toFixed(
                                                        0
                                                    )}%`
                                                }
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {vehicleInterestData.map(
                                                    (entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={entry.color}
                                                        />
                                                    )
                                                )}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Análisis de Preferencias</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {vehicleInterestData.map((vehicle, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-4 h-4 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        vehicle.color,
                                                }}
                                            ></div>
                                            <span className="font-medium">
                                                {vehicle.name}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium">
                                                {vehicle.value}%
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                ~
                                                {Math.round(vehicle.value * 30)}{" "}
                                                consultas
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="users" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Actividad de Usuarios por Hora
                                </CardTitle>
                                <CardDescription>
                                    Patrón de uso durante el día
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <AreaChart data={userEngagementData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="hour" />
                                            <YAxis />
                                            <Tooltip />
                                            <Area
                                                type="monotone"
                                                dataKey="usuarios"
                                                stroke="#2563eb"
                                                fill="#2563eb"
                                                fillOpacity={0.6}
                                                name="Usuarios Activos"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Métricas de Engagement</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">
                                            2,840
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Usuarios Únicos
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600">
                                            4.2
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Sesiones Promedio
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-purple-600">
                                            6.5min
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Duración Promedio
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-orange-600">
                                            73%
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Tasa de Retorno
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
