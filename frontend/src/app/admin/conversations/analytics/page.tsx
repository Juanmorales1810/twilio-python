"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    AreaChart,
    Area,
} from "recharts";
import {
    Bot,
    TrendingUp,
    TrendingDown,
    MessageSquare,
    Clock,
    CheckCircle,
    AlertTriangle,
    Activity,
    Users,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Datos de ejemplo para los gráficos
const botPerformanceData = [
    { hour: "00:00", responses: 12, accuracy: 95, avgTime: 1.2 },
    { hour: "01:00", responses: 8, accuracy: 97, avgTime: 1.1 },
    { hour: "02:00", responses: 5, accuracy: 98, avgTime: 1.0 },
    { hour: "03:00", responses: 3, accuracy: 96, avgTime: 1.3 },
    { hour: "04:00", responses: 2, accuracy: 99, avgTime: 0.9 },
    { hour: "05:00", responses: 4, accuracy: 95, avgTime: 1.4 },
    { hour: "06:00", responses: 15, accuracy: 93, avgTime: 1.8 },
    { hour: "07:00", responses: 35, accuracy: 91, avgTime: 2.1 },
    { hour: "08:00", responses: 65, accuracy: 89, avgTime: 2.5 },
    { hour: "09:00", responses: 85, accuracy: 87, avgTime: 2.8 },
    { hour: "10:00", responses: 95, accuracy: 85, avgTime: 3.2 },
    { hour: "11:00", responses: 110, accuracy: 83, avgTime: 3.5 },
    { hour: "12:00", responses: 88, accuracy: 85, avgTime: 3.1 },
    { hour: "13:00", responses: 75, accuracy: 87, avgTime: 2.9 },
    { hour: "14:00", responses: 92, accuracy: 86, avgTime: 3.0 },
    { hour: "15:00", responses: 105, accuracy: 84, avgTime: 3.3 },
    { hour: "16:00", responses: 125, accuracy: 82, avgTime: 3.6 },
    { hour: "17:00", responses: 98, accuracy: 84, avgTime: 3.2 },
    { hour: "18:00", responses: 72, accuracy: 86, avgTime: 2.8 },
    { hour: "19:00", responses: 45, accuracy: 89, avgTime: 2.3 },
    { hour: "20:00", responses: 32, accuracy: 92, avgTime: 1.9 },
    { hour: "21:00", responses: 28, accuracy: 94, avgTime: 1.6 },
    { hour: "22:00", responses: 22, accuracy: 96, avgTime: 1.4 },
    { hour: "23:00", responses: 18, accuracy: 97, avgTime: 1.3 },
];

const intentRecognitionData = [
    { intent: "Información Vehículos", count: 245, accuracy: 92 },
    { intent: "Agendar Cita", count: 156, accuracy: 89 },
    { intent: "Precios", count: 134, accuracy: 95 },
    { intent: "Financiamiento", count: 98, accuracy: 87 },
    { intent: "Mantenimiento", count: 76, accuracy: 93 },
    { intent: "Otros", count: 45, accuracy: 78 },
];

const userSatisfactionData = [
    { rating: "5 Estrellas", value: 45, color: "#10b981" },
    { rating: "4 Estrellas", value: 32, color: "#84cc16" },
    { rating: "3 Estrellas", value: 15, color: "#eab308" },
    { rating: "2 Estrellas", value: 6, color: "#f97316" },
    { rating: "1 Estrella", value: 2, color: "#ef4444" },
];

const escalationData = [
    { day: "Lun", automated: 156, escalated: 12, resolved: 144 },
    { day: "Mar", automated: 178, escalated: 15, resolved: 163 },
    { day: "Mie", automated: 145, escalated: 8, resolved: 137 },
    { day: "Jue", automated: 167, escalated: 11, resolved: 156 },
    { day: "Vie", automated: 189, escalated: 18, resolved: 171 },
    { day: "Sab", automated: 98, escalated: 6, resolved: 92 },
    { day: "Dom", automated: 67, escalated: 4, resolved: 63 },
];

const chartConfig = {
    responses: {
        label: "Respuestas",
        color: "#2563eb",
    },
    accuracy: {
        label: "Precisión",
        color: "#16a34a",
    },
    avgTime: {
        label: "Tiempo Promedio",
        color: "#dc2626",
    },
    automated: {
        label: "Automatizadas",
        color: "#2563eb",
    },
    escalated: {
        label: "Escaladas",
        color: "#dc2626",
    },
    resolved: {
        label: "Resueltas",
        color: "#16a34a",
    },
};

export default function BotAnalyticsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Análisis de Bot
                        </h2>
                        <p className="text-muted-foreground">
                            Métricas de rendimiento y análisis del chatbot
                        </p>
                    </div>
                    <Button>
                        <Activity className="h-4 w-4 mr-2" />
                        Optimizar Bot
                    </Button>
                </div>

                {/* KPI Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 className="tracking-tight text-sm font-medium">
                                    Precisión General
                                </h3>
                                <Bot className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">87.5%</div>
                                <p className="text-xs text-muted-foreground flex items-center">
                                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                                    +2.3% desde la semana pasada
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 className="tracking-tight text-sm font-medium">
                                    Tiempo Respuesta
                                </h3>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">2.3s</div>
                                <p className="text-xs text-muted-foreground flex items-center">
                                    <TrendingDown className="h-3 w-3 mr-1 text-green-500" />
                                    -0.4s más rápido
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 className="tracking-tight text-sm font-medium">
                                    Resolución Automática
                                </h3>
                                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">91.2%</div>
                                <p className="text-xs text-muted-foreground">
                                    Sin escalación a agente
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
                                <div className="text-2xl font-bold">4.3/5</div>
                                <p className="text-xs text-muted-foreground">
                                    Calificación promedio
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <Tabs defaultValue="performance" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="performance">
                            Rendimiento
                        </TabsTrigger>
                        <TabsTrigger value="intents">Intenciones</TabsTrigger>
                        <TabsTrigger value="satisfaction">
                            Satisfacción
                        </TabsTrigger>
                        <TabsTrigger value="escalation">Escalación</TabsTrigger>
                    </TabsList>

                    <TabsContent value="performance" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            {/* Bot Performance by Hour */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Rendimiento por Hora</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ChartContainer
                                        config={chartConfig}
                                        className="h-[300px]"
                                    >
                                        <AreaChart data={botPerformanceData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="hour" />
                                            <YAxis />
                                            <ChartTooltip
                                                content={
                                                    <ChartTooltipContent />
                                                }
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="responses"
                                                stroke="var(--color-responses)"
                                                fill="var(--color-responses)"
                                                fillOpacity={0.6}
                                                name="Respuestas"
                                            />
                                        </AreaChart>
                                    </ChartContainer>
                                </CardContent>
                            </Card>

                            {/* Accuracy Trend */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Tendencia de Precisión
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ChartContainer
                                        config={chartConfig}
                                        className="h-[300px]"
                                    >
                                        <LineChart data={botPerformanceData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="hour" />
                                            <YAxis domain={[75, 100]} />
                                            <ChartTooltip
                                                content={
                                                    <ChartTooltipContent />
                                                }
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="accuracy"
                                                stroke="var(--color-accuracy)"
                                                strokeWidth={2}
                                                name="Precisión (%)"
                                            />
                                        </LineChart>
                                    </ChartContainer>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Response Time */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Tiempo de Respuesta por Hora
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer
                                    config={chartConfig}
                                    className="h-[300px] w-full"
                                >
                                    <BarChart data={botPerformanceData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="hour" />
                                        <YAxis />
                                        <ChartTooltip
                                            content={<ChartTooltipContent />}
                                        />
                                        <Bar
                                            dataKey="avgTime"
                                            fill="var(--color-avgTime)"
                                            name="Tiempo Promedio (s)"
                                        />
                                    </BarChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="intents" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Reconocimiento de Intenciones
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {intentRecognitionData.map(
                                        (intent, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-4 border rounded-lg"
                                            >
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <h3 className="font-medium">
                                                            {intent.intent}
                                                        </h3>
                                                        <div className="flex items-center gap-4">
                                                            <Badge variant="outline">
                                                                {intent.count}{" "}
                                                                consultas
                                                            </Badge>
                                                            <Badge
                                                                className={
                                                                    intent.accuracy >=
                                                                    90
                                                                        ? "bg-green-100 text-green-800"
                                                                        : intent.accuracy >=
                                                                          85
                                                                        ? "bg-yellow-100 text-yellow-800"
                                                                        : "bg-red-100 text-red-800"
                                                                }
                                                            >
                                                                {
                                                                    intent.accuracy
                                                                }
                                                                % precisión
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-blue-500 h-2 rounded-full"
                                                            style={{
                                                                width: `${
                                                                    (intent.count /
                                                                        245) *
                                                                    100
                                                                }%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="satisfaction" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Distribución de Satisfacción del Usuario
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer
                                    config={chartConfig}
                                    className="h-[400px] w-full"
                                >
                                    <PieChart>
                                        <Pie
                                            data={userSatisfactionData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={120}
                                            dataKey="value"
                                            label={({ rating, percent }) =>
                                                `${rating}: ${(
                                                    percent * 100
                                                ).toFixed(0)}%`
                                            }
                                        >
                                            {userSatisfactionData.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.color}
                                                    />
                                                )
                                            )}
                                        </Pie>
                                        <ChartTooltip
                                            content={<ChartTooltipContent />}
                                        />
                                    </PieChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="escalation" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Escalación vs Resolución Automática
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer
                                    config={chartConfig}
                                    className="h-[300px] w-full"
                                >
                                    <BarChart data={escalationData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="day" />
                                        <YAxis />
                                        <ChartTooltip
                                            content={<ChartTooltipContent />}
                                        />
                                        <ChartLegend
                                            content={<ChartLegendContent />}
                                        />
                                        <Bar
                                            dataKey="resolved"
                                            fill="var(--color-resolved)"
                                            name="Resueltas por Bot"
                                        />
                                        <Bar
                                            dataKey="escalated"
                                            fill="var(--color-escalated)"
                                            name="Escaladas a Agente"
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
