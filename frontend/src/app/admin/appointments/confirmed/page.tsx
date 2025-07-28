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
    Calendar,
    Search,
    Filter,
    MoreHorizontal,
    Phone,
    Car,
    CheckCircle,
    Clock,
    MapPin,
    Edit,
    XCircle,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const confirmedAppointments = [
    {
        id: 1,
        customerName: "María González",
        phone: "+1-809-555-0123",
        vehicle: "Toyota Corolla 2025",
        service: "Test Drive",
        date: "2025-07-28",
        time: "10:00 AM",
        status: "Confirmada",
        salesRep: "Juan Pérez",
        location: "Showroom Principal",
        notes: "Cliente confirmó por WhatsApp",
        confirmedAt: "2025-07-27 15:30",
    },
    {
        id: 2,
        customerName: "Ana Martínez",
        phone: "+1-809-555-0125",
        vehicle: "Toyota Camry 2025",
        service: "Cotización",
        date: "2025-07-28",
        time: "2:00 PM",
        status: "Confirmada",
        salesRep: "María López",
        location: "Oficina de Ventas",
        notes: "Interesada en financiamiento",
        confirmedAt: "2025-07-27 12:15",
    },
    {
        id: 3,
        customerName: "Roberto Díaz",
        phone: "+1-809-555-0128",
        vehicle: "Toyota RAV4 2025",
        service: "Test Drive",
        date: "2025-07-29",
        time: "11:00 AM",
        status: "Confirmada",
        salesRep: "Carlos Ruiz",
        location: "Área de Pruebas",
        notes: "Segunda visita - cliente decidido",
        confirmedAt: "2025-07-26 18:45",
    },
    {
        id: 4,
        customerName: "Laura Pérez",
        phone: "+1-809-555-0127",
        vehicle: "Toyota Prius 2025",
        service: "Información General",
        date: "2025-07-29",
        time: "3:30 PM",
        status: "Confirmada",
        salesRep: "Ana Rodríguez",
        location: "Showroom Principal",
        notes: "Cliente VIP - primera compra",
        confirmedAt: "2025-07-27 09:22",
    },
    {
        id: 5,
        customerName: "Pedro Santos",
        phone: "+1-809-555-0126",
        vehicle: "Toyota Hilux 2025",
        service: "Cotización",
        date: "2025-07-30",
        time: "9:00 AM",
        status: "Confirmada",
        salesRep: "Miguel Torres",
        location: "Oficina de Ventas",
        notes: "Necesita cotización para empresa",
        confirmedAt: "2025-07-27 16:10",
    },
    {
        id: 6,
        customerName: "Carmen Silva",
        phone: "+1-809-555-0129",
        vehicle: "Toyota Yaris 2025",
        service: "Test Drive",
        date: "2025-07-30",
        time: "4:00 PM",
        status: "Confirmada",
        salesRep: "Juan Pérez",
        location: "Área de Pruebas",
        notes: "Primera compra de auto",
        confirmedAt: "2025-07-27 14:55",
    },
];

function getStatusBadge(status: string) {
    switch (status) {
        case "Confirmada":
            return (
                <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Confirmada
                </Badge>
            );
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
}

function getServiceColor(service: string) {
    switch (service) {
        case "Test Drive":
            return "bg-blue-100 text-blue-800";
        case "Cotización":
            return "bg-green-100 text-green-800";
        case "Información General":
            return "bg-purple-100 text-purple-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
}

export default function ConfirmedAppointmentsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Citas Confirmadas
                        </h2>
                        <p className="text-muted-foreground">
                            Citas confirmadas y programadas en el calendario
                        </p>
                    </div>
                    <Button>
                        <Calendar className="h-4 w-4 mr-2" />
                        Ver Calendario
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 className="tracking-tight text-sm font-medium">
                                    Total Confirmadas
                                </h3>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">24</div>
                                <p className="text-xs text-muted-foreground">
                                    Esta semana
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
                                <div className="text-2xl font-bold">6</div>
                                <p className="text-xs text-muted-foreground">
                                    Citas programadas
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 className="tracking-tight text-sm font-medium">
                                    Test Drives
                                </h3>
                                <Car className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">15</div>
                                <p className="text-xs text-muted-foreground">
                                    Programados esta semana
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 className="tracking-tight text-sm font-medium">
                                    Tasa de Asistencia
                                </h3>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">92%</div>
                                <p className="text-xs text-muted-foreground">
                                    Último mes
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
                                        placeholder="Buscar citas confirmadas..."
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

                {/* Confirmed Appointments Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Citas Confirmadas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Vehículo</TableHead>
                                    <TableHead>Servicio</TableHead>
                                    <TableHead>Fecha/Hora</TableHead>
                                    <TableHead>Vendedor</TableHead>
                                    <TableHead>Ubicación</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">
                                        Acciones
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {confirmedAppointments.map((appointment) => (
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
                                            <Badge
                                                variant="outline"
                                                className={getServiceColor(
                                                    appointment.service
                                                )}
                                            >
                                                {appointment.service}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="text-sm font-medium">
                                                    {appointment.date}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {appointment.time}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {appointment.salesRep}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                                <span className="text-sm">
                                                    {appointment.location}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(appointment.status)}
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
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Editar cita
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Phone className="mr-2 h-4 w-4" />
                                                        Contactar cliente
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Calendar className="mr-2 h-4 w-4" />
                                                        Reagendar
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
