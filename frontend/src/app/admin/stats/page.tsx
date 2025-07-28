"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";
import {
    TrendingUp,
    TrendingDown,
    Users,
    MessageSquare,
    Calendar,
    Car,
    BarChart3,
    Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Datos de ejemplo para los gráficos
const messagesData = [
    { month: "Ene", messages: 186, responses: 180 },
    { month: "Feb", messages: 305, responses: 298 },
    { month: "Mar", messages: 237, responses: 230 },
    { month: "Abr", messages: 273, responses: 265 },
    { month: "May", messages: 209, responses: 203 },
    { month: "Jun", messages: 214, responses: 210 },
    { month: "Jul", messages: 280, responses: 275 },
];

const appointmentsData = [
    { day: "Lun", appointments: 12, completed: 10 },
    { day: "Mar", appointments: 15, completed: 14 },
    { day: "Mie", appointments: 8, completed: 8 },
    { day: "Jue", appointments: 14, completed: 12 },
    { day: "Vie", appointments: 16, completed: 15 },
    { day: "Sab", appointments: 10, completed: 9 },
    { day: "Dom", appointments: 5, completed: 5 },
];

const vehicleInterestData = [
    { name: "Corolla", value: 35, color: "#0088FE" },
    { name: "Camry", value: 25, color: "#00C49F" },
    { name: "RAV4", value: 20, color: "#FFBB28" },
    { name: "Hilux", value: 15, color: "#FF8042" },
    { name: "Otros", value: 5, color: "#8884D8" },
];

const hourlyActivityData = [
    { hour: "08:00", activity: 15 },
    { hour: "09:00", activity: 45 },
    { hour: "10:00", activity: 65 },
    { hour: "11:00", activity: 85 },
    { hour: "12:00", activity: 70 },
    { hour: "13:00", activity: 45 },
    { hour: "14:00", activity: 55 },
    { hour: "15:00", activity: 75 },
    { hour: "16:00", activity: 90 },
    { hour: "17:00", activity: 65 },
    { hour: "18:00", activity: 40 },
    { hour: "19:00", activity: 25 },
];

const conversionRateData = [
    { step: "Inicio Chat", value: 100, color: "#8884d8" },
    { step: "Interés en Vehículo", value: 75, color: "#82ca9d" },
    { step: "Solicitud de Cita", value: 45, color: "#ffc658" },
    { step: "Cita Confirmada", value: 35, color: "#ff7300" },
];

const chartConfig = {
    messages: {
        label: "Mensajes",
        color: "#2563eb",
    },
    responses: {
        label: "Respuestas",
        color: "#60a5fa",
    },
    appointments: {
        label: "Citas",
        color: "#dc2626",
    },
    completed: {
        label: "Completadas",
        color: "#16a34a",
    },
    activity: {
        label: "Actividad",
        color: "#ca8a04",
    },
};

export default function StatsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Estadísticas y Análisis
                        </h2>
                        <p className="text-muted-foreground">
                            Análisis detallado del rendimiento del chatbot y
                            comportamiento de usuarios
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            Exportar Datos
                        </Button>
                        <Button size="sm">
                            <Activity className="h-4 w-4 mr-2" />
                            Actualizar
                        </Button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 className="tracking-tight text-sm font-medium">
                                    Tasa de Conversión
                                </h3>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">35%</div>
                                <p className="text-xs text-muted-foreground flex items-center">
                                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                                    +2.5% desde la semana pasada
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 className="tracking-tight text-sm font-medium">
                                    Tiempo Respuesta Promedio
                                </h3>
                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">1.2s</div>
                                <p className="text-xs text-muted-foreground flex items-center">
                                    <TrendingDown className="h-3 w-3 mr-1 text-green-500" />
                                    -0.3s más rápido
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 className="tracking-tight text-sm font-medium">
                                    Satisfacción Usuario
                                </h3>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">4.8/5</div>
                                <p className="text-xs text-muted-foreground">
                                    Basado en 234 calificaciones
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 className="tracking-tight text-sm font-medium">
                                    Citas Completadas
                                </h3>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">89%</div>
                                <p className="text-xs text-muted-foreground flex items-center">
                                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                                    +5% este mes
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">
                            Vista General
                        </TabsTrigger>
                        <TabsTrigger value="messages">Mensajes</TabsTrigger>
                        <TabsTrigger value="appointments">Citas</TabsTrigger>
                        <TabsTrigger value="behavior">
                            Comportamiento
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            {/* Mensajes por Mes */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart3 className="h-5 w-5" />
                                        Mensajes por Mes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ChartContainer
                                        config={chartConfig}
                                        className="h-[300px]"
                                    >
                                        <BarChart data={messagesData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <ChartTooltip
                                                content={
                                                    <ChartTooltipContent />
                                                }
                                            />
                                            <ChartLegend
                                                content={<ChartLegendContent />}
                                            />
                                            <Bar
                                                dataKey="messages"
                                                fill="var(--color-messages)"
                                                name="Mensajes"
                                            />
                                            <Bar
                                                dataKey="responses"
                                                fill="var(--color-responses)"
                                                name="Respuestas"
                                            />
                                        </BarChart>
                                    </ChartContainer>
                                </CardContent>
                            </Card>

                            {/* Interés por Vehículos */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Car className="h-5 w-5" />
                                        Interés por Vehículos
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ChartContainer
                                        config={chartConfig}
                                        className="h-[300px]"
                                    >
                                        <PieChart>
                                            <Pie
                                                data={vehicleInterestData}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                dataKey="value"
                                                label={({ name, percent }) =>
                                                    `${name} ${(
                                                        percent * 100
                                                    ).toFixed(0)}%`
                                                }
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
                                            <ChartTooltip
                                                content={
                                                    <ChartTooltipContent />
                                                }
                                            />
                                        </PieChart>
                                    </ChartContainer>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Actividad por Hora */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5" />
                                    Actividad por Hora del Día
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer
                                    config={chartConfig}
                                    className="h-[300px] w-full"
                                >
                                    <AreaChart data={hourlyActivityData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="hour" />
                                        <YAxis />
                                        <ChartTooltip
                                            content={<ChartTooltipContent />}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="activity"
                                            stroke="var(--color-activity)"
                                            fill="var(--color-activity)"
                                            fillOpacity={0.6}
                                            name="Actividad"
                                        />
                                    </AreaChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="messages" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            {/* Tendencia de Mensajes */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Tendencia de Mensajes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ChartContainer
                                        config={chartConfig}
                                        className="h-[300px]"
                                    >
                                        <LineChart data={messagesData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <ChartTooltip
                                                content={
                                                    <ChartTooltipContent />
                                                }
                                            />
                                            <ChartLegend
                                                content={<ChartLegendContent />}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="messages"
                                                stroke="var(--color-messages)"
                                                strokeWidth={2}
                                                name="Mensajes"
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="responses"
                                                stroke="var(--color-responses)"
                                                strokeWidth={2}
                                                name="Respuestas"
                                            />
                                        </LineChart>
                                    </ChartContainer>
                                </CardContent>
                            </Card>

                            {/* Tipos de Consultas */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Tipos de Consultas</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                                <span className="text-sm">
                                                    Información de Vehículos
                                                </span>
                                            </div>
                                            <Badge variant="secondary">
                                                45%
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                <span className="text-sm">
                                                    Agendar Citas
                                                </span>
                                            </div>
                                            <Badge variant="secondary">
                                                30%
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                                <span className="text-sm">
                                                    Precios y Financiamiento
                                                </span>
                                            </div>
                                            <Badge variant="secondary">
                                                15%
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                                <span className="text-sm">
                                                    Soporte General
                                                </span>
                                            </div>
                                            <Badge variant="secondary">
                                                10%
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="appointments" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            {/* Citas por Día */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Citas por Día de la Semana
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ChartContainer
                                        config={chartConfig}
                                        className="h-[300px]"
                                    >
                                        <BarChart data={appointmentsData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="day" />
                                            <YAxis />
                                            <ChartTooltip
                                                content={
                                                    <ChartTooltipContent />
                                                }
                                            />
                                            <ChartLegend
                                                content={<ChartLegendContent />}
                                            />
                                            <Bar
                                                dataKey="appointments"
                                                fill="var(--color-appointments)"
                                                name="Programadas"
                                            />
                                            <Bar
                                                dataKey="completed"
                                                fill="var(--color-completed)"
                                                name="Completadas"
                                            />
                                        </BarChart>
                                    </ChartContainer>
                                </CardContent>
                            </Card>

                            {/* Estado de Citas */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Estado de Citas</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">
                                                Completadas
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-20 h-2 bg-gray-200 rounded-full">
                                                    <div className="w-[89%] h-2 bg-green-500 rounded-full"></div>
                                                </div>
                                                <span className="text-sm font-medium">
                                                    89%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">
                                                Canceladas
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-20 h-2 bg-gray-200 rounded-full">
                                                    <div className="w-[8%] h-2 bg-red-500 rounded-full"></div>
                                                </div>
                                                <span className="text-sm font-medium">
                                                    8%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">
                                                No presentadas
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-20 h-2 bg-gray-200 rounded-full">
                                                    <div className="w-[3%] h-2 bg-orange-500 rounded-full"></div>
                                                </div>
                                                <span className="text-sm font-medium">
                                                    3%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="behavior" className="space-y-4">
                        {/* Embudo de Conversión */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Embudo de Conversión</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer
                                    config={chartConfig}
                                    className="h-[400px]"
                                >
                                    <BarChart
                                        data={conversionRateData}
                                        layout="horizontal"
                                        margin={{ left: 100 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis type="category" dataKey="step" />
                                        <ChartTooltip
                                            content={<ChartTooltipContent />}
                                        />
                                        <Bar
                                            dataKey="value"
                                            fill="#8884d8"
                                            name="Usuarios"
                                        />
                                    </BarChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}
