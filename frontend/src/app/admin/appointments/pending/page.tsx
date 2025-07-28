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
    Clock,
    Search,
    Filter,
    MoreHorizontal,
    Phone,
    Car,
    Calendar,
    MapPin,
    CheckCircle,
    XCircle,
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

const pendingAppointments = [
    {
        id: 1,
        customerName: "María González",
        phone: "+1-809-555-0123",
        vehicle: "Toyota Corolla 2025",
        service: "Test Drive",
        requestedDate: "2025-07-28",
        requestedTime: "10:00 AM",
        status: "Pendiente Confirmación",
        priority: "Normal",
        notes: "Interesada en financiamiento",
        createdAt: "2025-07-27 09:15",
    },
    {
        id: 2,
        customerName: "Carlos Rodríguez",
        phone: "+1-809-555-0124",
        vehicle: "Toyota RAV4 2025",
        service: "Cotización",
        requestedDate: "2025-07-29",
        requestedTime: "2:00 PM",
        status: "Esperando Cliente",
        priority: "Alta",
        notes: "Cliente prefiere contacto por WhatsApp",
        createdAt: "2025-07-26 16:30",
    },
    {
        id: 3,
        customerName: "Ana Martínez",
        phone: "+1-809-555-0125",
        vehicle: "Toyota Camry 2025",
        service: "Información General",
        requestedDate: "2025-07-30",
        requestedTime: "11:30 AM",
        status: "Pendiente Confirmación",
        priority: "Normal",
        notes: "Preguntó por opciones híbridas",
        createdAt: "2025-07-27 14:22",
    },
    {
        id: 4,
        customerName: "Pedro Santos",
        phone: "+1-809-555-0126",
        vehicle: "Toyota Hilux 2025",
        service: "Test Drive",
        requestedDate: "2025-07-28",
        requestedTime: "4:00 PM",
        status: "Reagendar",
        priority: "Normal",
        notes: "Cliente canceló cita anterior",
        createdAt: "2025-07-25 11:45",
    },
    {
        id: 5,
        customerName: "Laura Pérez",
        phone: "+1-809-555-0127",
        vehicle: "Toyota Prius 2025",
        service: "Cotización",
        requestedDate: "2025-07-31",
        requestedTime: "9:00 AM",
        status: "Pendiente Confirmación",
        priority: "Alta",
        notes: "Cliente VIP - primera compra",
        createdAt: "2025-07-27 10:33",
    },
];

function getStatusBadge(status: string) {
    switch (status) {
        case "Pendiente Confirmación":
            return (
                <Badge className="bg-yellow-100 text-yellow-800">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Pendiente Confirmación
                </Badge>
            );
        case "Esperando Cliente":
            return (
                <Badge className="bg-blue-100 text-blue-800">
                    <Clock className="w-3 h-3 mr-1" />
                    Esperando Cliente
                </Badge>
            );
        case "Reagendar":
            return (
                <Badge className="bg-orange-100 text-orange-800">
                    <Calendar className="w-3 h-3 mr-1" />
                    Reagendar
                </Badge>
            );
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
}

function getPriorityBadge(priority: string) {
    switch (priority) {
        case "Alta":
            return <Badge variant="destructive">Alta</Badge>;
        case "Normal":
            return <Badge variant="outline">Normal</Badge>;
        case "Baja":
            return <Badge variant="secondary">Baja</Badge>;
        default:
            return <Badge variant="outline">{priority}</Badge>;
    }
}

export default function PendingAppointmentsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Citas Pendientes
                        </h2>
                        <p className="text-muted-foreground">
                            Citas que requieren confirmación o seguimiento
                        </p>
                    </div>
                    <Button>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirmar Todas
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 className="tracking-tight text-sm font-medium">
                                    Total Pendientes
                                </h3>
                                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">12</div>
                                <p className="text-xs text-muted-foreground">
                                    +3 desde ayer
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
                                    Requieren atención inmediata
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 className="tracking-tight text-sm font-medium">
                                    Para Hoy
                                </h3>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">2</div>
                                <p className="text-xs text-muted-foreground">
                                    Citas programadas para hoy
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
                                <div className="text-2xl font-bold">2.5h</div>
                                <p className="text-xs text-muted-foreground">
                                    Para confirmación
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
                                        placeholder="Buscar citas pendientes..."
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

                {/* Pending Appointments Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Citas Pendientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Vehículo</TableHead>
                                    <TableHead>Servicio</TableHead>
                                    <TableHead>Fecha/Hora Solicitada</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Prioridad</TableHead>
                                    <TableHead>Creada</TableHead>
                                    <TableHead className="text-right">
                                        Acciones
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pendingAppointments.map((appointment) => (
                                    <TableRow key={appointment.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">
                                                    {appointment.customerName}
                                                </div>
                                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                    <Phone className="h-3 w-3" />
                                                    {appointment.phone}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Car className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">
                                                    {appointment.vehicle}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {appointment.service}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="text-sm font-medium">
                                                    {appointment.requestedDate}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {appointment.requestedTime}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(appointment.status)}
                                        </TableCell>
                                        <TableCell>
                                            {getPriorityBadge(
                                                appointment.priority
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {appointment.createdAt}
                                            </div>
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
                                                        <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                                        Confirmar cita
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Calendar className="mr-2 h-4 w-4" />
                                                        Reagendar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Phone className="mr-2 h-4 w-4" />
                                                        Contactar cliente
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-600">
                                                        <XCircle className="mr-2 h-4 w-4" />
                                                        Cancelar cita
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
