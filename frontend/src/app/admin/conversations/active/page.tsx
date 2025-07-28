"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Activity,
    Search,
    Filter,
    MoreHorizontal,
    MessageSquare,
    Phone,
    Clock,
    User,
    Eye,
    Download,
    AlertCircle,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const activeConversations = [
    {
        id: 1,
        userName: "María González",
        phone: "+1-809-555-0123",
        status: "En línea",
        currentTopic: "Información Toyota Corolla",
        startTime: "14:23",
        duration: "12 min",
        messagesCount: 15,
        lastMessage: "¿Cuál es el precio del modelo base?",
        urgency: "Normal",
        assignedAgent: "Bot",
    },
    {
        id: 2,
        userName: "Carlos Rodríguez",
        phone: "+1-809-555-0124",
        status: "Escribiendo",
        currentTopic: "Test Drive RAV4",
        startTime: "14:15",
        duration: "20 min",
        messagesCount: 23,
        lastMessage: "Quiero agendar una cita para mañana",
        urgency: "Alta",
        assignedAgent: "Juan Pérez",
    },
    {
        id: 3,
        userName: "Ana Martínez",
        phone: "+1-809-555-0125",
        status: "En línea",
        currentTopic: "Financiamiento Camry",
        startTime: "14:30",
        duration: "8 min",
        messagesCount: 9,
        lastMessage: "¿Qué documentos necesito para el crédito?",
        urgency: "Normal",
        assignedAgent: "Bot",
    },
    {
        id: 4,
        userName: "Pedro Santos",
        phone: "+1-809-555-0126",
        status: "Esperando",
        currentTopic: "Cotización Hilux",
        startTime: "14:05",
        duration: "33 min",
        messagesCount: 18,
        lastMessage: "Esperando respuesta sobre precios...",
        urgency: "Alta",
        assignedAgent: "María López",
    },
    {
        id: 5,
        userName: "Laura Pérez",
        phone: "+1-809-555-0127",
        status: "En línea",
        currentTopic: "Mantenimiento",
        startTime: "14:20",
        duration: "15 min",
        messagesCount: 12,
        lastMessage: "¿Cuándo debo hacer el primer servicio?",
        urgency: "Baja",
        assignedAgent: "Bot",
    },
    {
        id: 6,
        userName: "Roberto Díaz",
        phone: "+1-809-555-0128",
        status: "Escribiendo",
        currentTopic: "Comparación Modelos",
        startTime: "14:25",
        duration: "10 min",
        messagesCount: 14,
        lastMessage: "¿Cuál es la diferencia entre Prius y Corolla Hybrid?",
        urgency: "Normal",
        assignedAgent: "Bot",
    },
];

function getStatusBadge(status: string) {
    switch (status) {
        case "En línea":
            return (
                <Badge className="bg-green-100 text-green-800">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    En línea
                </Badge>
            );
        case "Escribiendo":
            return (
                <Badge className="bg-blue-100 text-blue-800">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Escribiendo
                </Badge>
            );
        case "Esperando":
            return (
                <Badge className="bg-yellow-100 text-yellow-800">
                    <Clock className="w-3 h-3 mr-1" />
                    Esperando
                </Badge>
            );
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
}

function getUrgencyBadge(urgency: string) {
    switch (urgency) {
        case "Alta":
            return <Badge variant="destructive">Alta</Badge>;
        case "Normal":
            return <Badge variant="outline">Normal</Badge>;
        case "Baja":
            return <Badge variant="secondary">Baja</Badge>;
        default:
            return <Badge variant="outline">{urgency}</Badge>;
    }
}

function getAgentBadge(agent: string) {
    if (agent === "Bot") {
        return <Badge className="bg-purple-100 text-purple-800">Bot</Badge>;
    }
    return <Badge className="bg-blue-100 text-blue-800">{agent}</Badge>;
}

export default function ActiveConversationsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Conversaciones Activas
                        </h2>
                        <p className="text-muted-foreground">
                            Chats en tiempo real y conversaciones en curso
                        </p>
                    </div>
                    <Button>
                        <Activity className="h-4 w-4 mr-2" />
                        Monitor en Tiempo Real
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 className="tracking-tight text-sm font-medium">
                                    Conversaciones Activas
                                </h3>
                                <MessageSquare className="h-4 w-4 text-green-500" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">23</div>
                                <p className="text-xs text-muted-foreground">
                                    +5 en la última hora
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 className="tracking-tight text-sm font-medium">
                                    Tiempo Promedio
                                </h3>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">15 min</div>
                                <p className="text-xs text-muted-foreground">
                                    Por conversación
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 className="tracking-tight text-sm font-medium">
                                    Agentes Disponibles
                                </h3>
                                <User className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">4</div>
                                <p className="text-xs text-muted-foreground">
                                    De 6 total
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 className="tracking-tight text-sm font-medium">
                                    Prioridad Alta
                                </h3>
                                <AlertCircle className="h-4 w-4 text-red-500" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-red-600">
                                    3
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Requieren atención
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex gap-4 items-center">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Buscar conversaciones activas..."
                                        className="pl-8"
                                    />
                                </div>
                            </div>
                            <Button variant="outline">
                                <Filter className="h-4 w-4 mr-2" />
                                Filtros
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Active Conversations Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Conversaciones Activas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Usuario</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Tema Actual</TableHead>
                                    <TableHead>Duración</TableHead>
                                    <TableHead>Mensajes</TableHead>
                                    <TableHead>Último Mensaje</TableHead>
                                    <TableHead>Urgencia</TableHead>
                                    <TableHead>Agente</TableHead>
                                    <TableHead className="text-right">
                                        Acciones
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {activeConversations.map((conversation) => (
                                    <TableRow key={conversation.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">
                                                    {conversation.userName}
                                                </div>
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <Phone className="h-3 w-3" />
                                                    {conversation.phone}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(
                                                conversation.status
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {conversation.currentTopic}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="text-sm font-medium">
                                                    {conversation.duration}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    Desde{" "}
                                                    {conversation.startTime}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm font-medium">
                                                {conversation.messagesCount}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm max-w-[200px] truncate">
                                                {conversation.lastMessage}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getUrgencyBadge(
                                                conversation.urgency
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {getAgentBadge(
                                                conversation.assignedAgent
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <span className="sr-only">
                                                            Abrir menú
                                                        </span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>
                                                        Acciones
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuItem>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Ver conversación
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <User className="mr-2 h-4 w-4" />
                                                        Asignar agente
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <MessageSquare className="mr-2 h-4 w-4" />
                                                        Unirse al chat
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>
                                                        <Download className="mr-2 h-4 w-4" />
                                                        Exportar historial
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
