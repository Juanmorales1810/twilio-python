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
    CheckCircle2,
    Search,
    Filter,
    MoreHorizontal,
    Phone,
    Car,
    Star,
    MessageSquare,
    Calendar,
    ThumbsUp,
    Download,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const completedAppointments = [
    {
        id: 1,
        customerName: "María González",
        phone: "+1-809-555-0123",
        vehicle: "Toyota Corolla 2025",
        service: "Test Drive",
        date: "2025-07-25",
        time: "10:00 AM",
        status: "Completada",
        salesRep: "Juan Pérez",
        rating: 5,
        feedback: "Excelente atención, muy satisfecha con el test drive",
        outcome: "Interesada en compra",
        followUp: "Programar segunda cita",
        completedAt: "2025-07-25 11:30",
    },
    {
        id: 2,
        customerName: "Carlos Rodríguez",
        phone: "+1-809-555-0124",
        vehicle: "Toyota RAV4 2025",
        service: "Cotización",
        date: "2025-07-24",
        time: "2:00 PM",
        status: "Completada",
        salesRep: "María López",
        rating: 4,
        feedback: "Buen servicio, información clara sobre precios",
        outcome: "Solicitó tiempo para pensar",
        followUp: "Llamar en 3 días",
        completedAt: "2025-07-24 15:45",
    },
    {
        id: 3,
        customerName: "Ana Martínez",
        phone: "+1-809-555-0125",
        vehicle: "Toyota Camry 2025",
        service: "Información General",
        date: "2025-07-23",
        time: "11:30 AM",
        status: "Completada",
        salesRep: "Carlos Ruiz",
        rating: 5,
        feedback: "Información muy completa, excelente presentación",
        outcome: "Decidió comprar",
        followUp: "Procesar documentos",
        completedAt: "2025-07-23 12:15",
    },
    {
        id: 4,
        customerName: "Pedro Santos",
        phone: "+1-809-555-0126",
        vehicle: "Toyota Hilux 2025",
        service: "Test Drive",
        date: "2025-07-22",
        time: "4:00 PM",
        status: "Completada",
        salesRep: "Miguel Torres",
        rating: 4,
        feedback: "Vehículo cumple expectativas, buen manejo",
        outcome: "Interesado en financiamiento",
        followUp: "Enviar opciones de crédito",
        completedAt: "2025-07-22 17:20",
    },
    {
        id: 5,
        customerName: "Laura Pérez",
        phone: "+1-809-555-0127",
        vehicle: "Toyota Prius 2025",
        service: "Cotización",
        date: "2025-07-21",
        time: "9:00 AM",
        status: "Completada",
        salesRep: "Ana Rodríguez",
        rating: 5,
        feedback: "Atención personalizada excepcional",
        outcome: "Compra realizada",
        followUp: "Entregar vehículo",
        completedAt: "2025-07-21 10:30",
    },
    {
        id: 6,
        customerName: "Roberto Díaz",
        phone: "+1-809-555-0128",
        vehicle: "Toyota Yaris 2025",
        service: "Test Drive",
        date: "2025-07-20",
        time: "3:00 PM",
        status: "Completada",
        salesRep: "Juan Pérez",
        rating: 3,
        feedback:
            "Buen servicio pero el vehículo no se ajusta a mis necesidades",
        outcome: "No interesado",
        followUp: "Ofrecer otros modelos",
        completedAt: "2025-07-20 16:00",
    },
];

function getStatusBadge(status: string) {
    switch (status) {
        case "Completada":
            return (
                <Badge className="bg-green-100 text-green-800">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Completada
                </Badge>
            );
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
}

function getOutcomeBadge(outcome: string) {
    switch (outcome) {
        case "Compra realizada":
            return (
                <Badge className="bg-green-100 text-green-800">
                    Compra realizada
                </Badge>
            );
        case "Decidió comprar":
            return (
                <Badge className="bg-blue-100 text-blue-800">
                    Decidió comprar
                </Badge>
            );
        case "Interesada en compra":
        case "Interesado en financiamiento":
            return (
                <Badge className="bg-yellow-100 text-yellow-800">
                    Interesado
                </Badge>
            );
        case "Solicitó tiempo para pensar":
            return (
                <Badge className="bg-orange-100 text-orange-800">
                    Considerando
                </Badge>
            );
        case "No interesado":
            return (
                <Badge className="bg-gray-100 text-gray-800">
                    No interesado
                </Badge>
            );
        default:
            return <Badge variant="outline">{outcome}</Badge>;
    }
}

function getRatingStars(rating: number) {
    return (
        <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    className={`h-3 w-3 ${
                        i < rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                    }`}
                />
            ))}
            <span className="text-sm text-muted-foreground ml-1">
                ({rating}/5)
            </span>
        </div>
    );
}

export default function CompletedAppointmentsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Citas Completadas
                        </h2>
                        <p className="text-muted-foreground">
                            Historial de citas finalizadas y sus resultados
                        </p>
                    </div>
                    <Button>
                        <Download className="h-4 w-4 mr-2" />
                        Exportar Reporte
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 className="tracking-tight text-sm font-medium">
                                    Total Completadas
                                </h3>
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">156</div>
                                <p className="text-xs text-muted-foreground">
                                    Este mes
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 className="tracking-tight text-sm font-medium">
                                    Tasa de Conversión
                                </h3>
                                <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">68%</div>
                                <p className="text-xs text-muted-foreground">
                                    Citas que resultaron en venta
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 className="tracking-tight text-sm font-medium">
                                    Calificación Promedio
                                </h3>
                                <Star className="h-4 w-4 text-yellow-500" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">4.6</div>
                                <p className="text-xs text-muted-foreground">
                                    Satisfacción del cliente
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 className="tracking-tight text-sm font-medium">
                                    Seguimiento Pendiente
                                </h3>
                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">23</div>
                                <p className="text-xs text-muted-foreground">
                                    Requieren seguimiento
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
                                        placeholder="Buscar citas completadas..."
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

                {/* Completed Appointments Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Citas Completadas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Vehículo</TableHead>
                                    <TableHead>Servicio</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Vendedor</TableHead>
                                    <TableHead>Calificación</TableHead>
                                    <TableHead>Resultado</TableHead>
                                    <TableHead className="text-right">
                                        Acciones
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {completedAppointments.map((appointment) => (
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
                                            {getRatingStars(appointment.rating)}
                                        </TableCell>
                                        <TableCell>
                                            {getOutcomeBadge(
                                                appointment.outcome
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
                                                        <MessageSquare className="mr-2 h-4 w-4" />
                                                        Ver feedback completo
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Phone className="mr-2 h-4 w-4" />
                                                        Realizar seguimiento
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Calendar className="mr-2 h-4 w-4" />
                                                        Agendar nueva cita
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>
                                                        <Download className="mr-2 h-4 w-4" />
                                                        Descargar detalles
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
