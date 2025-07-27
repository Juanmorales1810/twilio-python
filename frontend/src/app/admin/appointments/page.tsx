"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";
import {
    Search,
    Plus,
    Eye,
    Edit,
    Trash2,
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
} from "lucide-react";

interface Appointment {
    id: string;
    phone_number: string;
    customer_name: string;
    customer_email?: string;
    preferred_date: string;
    preferred_time: string;
    vehicle_interest?: string;
    status: "pendiente" | "confirmada" | "cancelada";
    created_at: string;
}

const statusOptions = [
    { value: "pendiente", label: "Pendiente" },
    { value: "confirmada", label: "Confirmada" },
    { value: "cancelada", label: "Cancelada" },
];

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAppointment, setSelectedAppointment] =
        useState<Appointment | null>(null);
    const [editingStatus, setEditingStatus] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await fetch("/api/appointments");
            const data = await response.json();
            setAppointments(data.appointments || []);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateAppointmentStatus = async (
        appointmentId: string,
        newStatus: string
    ) => {
        try {
            const response = await fetch("/api/appointments", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: appointmentId, status: newStatus }),
            });

            if (response.ok) {
                setAppointments((prev) =>
                    prev.map((apt) =>
                        apt.id === appointmentId
                            ? {
                                  ...apt,
                                  status: newStatus as
                                      | "pendiente"
                                      | "confirmada"
                                      | "cancelada",
                              }
                            : apt
                    )
                );
            }
        } catch (error) {
            console.error("Error updating appointment status:", error);
        }
    };

    const filteredAppointments = appointments.filter(
        (appointment) =>
            appointment.customer_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            appointment.phone_number.includes(searchTerm) ||
            appointment.vehicle_interest
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pendiente: {
                icon: Clock,
                className: "bg-yellow-100 text-yellow-800",
                label: "Pendiente",
            },
            confirmada: {
                icon: CheckCircle,
                className: "bg-green-100 text-green-800",
                label: "Confirmada",
            },
            cancelada: {
                icon: XCircle,
                className: "bg-red-100 text-red-800",
                label: "Cancelada",
            },
        };

        const config = statusConfig[status as keyof typeof statusConfig];
        const Icon = config?.icon || Clock;

        return (
            <Badge className={config?.className || "bg-gray-100 text-gray-800"}>
                <Icon className="w-3 h-3 mr-1" />
                {config?.label || status}
            </Badge>
        );
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-muted-foreground">
                            Cargando citas...
                        </p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Citas
                        </h2>
                        <p className="text-muted-foreground">
                            Gestiona todas las citas de pruebas de manejo
                        </p>
                    </div>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva Cita
                    </Button>
                </div>

                {/* Quick Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <Clock className="h-5 w-5 text-yellow-600" />
                                <div>
                                    <p className="text-2xl font-bold">
                                        {
                                            appointments.filter(
                                                (apt) =>
                                                    apt.status === "pendiente"
                                            ).length
                                        }
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Pendientes
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <div>
                                    <p className="text-2xl font-bold">
                                        {
                                            appointments.filter(
                                                (apt) =>
                                                    apt.status === "confirmada"
                                            ).length
                                        }
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Confirmadas
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="text-2xl font-bold">
                                        {
                                            appointments.filter(
                                                (apt) =>
                                                    apt.status ===
                                                        "confirmada" &&
                                                    new Date(
                                                        apt.preferred_date
                                                    ).toDateString() ===
                                                        new Date().toDateString()
                                            ).length
                                        }
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Hoy
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search */}
                <div className="flex items-center space-x-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar citas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>

                {/* Appointments Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Lista de Citas ({filteredAppointments.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Vehículo</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Hora</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAppointments.map((appointment) => (
                                    <TableRow key={appointment.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">
                                                    {appointment.customer_name}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {appointment.customer_email}
                                                </div>
                                                <div className="text-xs text-muted-foreground font-mono">
                                                    {appointment.phone_number}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {appointment.vehicle_interest ? (
                                                <Badge variant="outline">
                                                    {
                                                        appointment.vehicle_interest
                                                    }
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    -
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                appointment.preferred_date
                                            ).toLocaleDateString("es-ES", {
                                                weekday: "short",
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            })}
                                        </TableCell>
                                        <TableCell className="font-mono">
                                            {appointment.preferred_time}
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(appointment.status)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedAppointment(
                                                                    appointment
                                                                );
                                                                setEditingStatus(
                                                                    appointment.status
                                                                );
                                                            }}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-2xl">
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                Detalles de la
                                                                Cita
                                                            </DialogTitle>
                                                        </DialogHeader>
                                                        {selectedAppointment && (
                                                            <div className="space-y-4">
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <Label className="font-semibold">
                                                                            Cliente
                                                                        </Label>
                                                                        <p>
                                                                            {
                                                                                selectedAppointment.customer_name
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <Label className="font-semibold">
                                                                            Email
                                                                        </Label>
                                                                        <p>
                                                                            {selectedAppointment.customer_email ||
                                                                                "No especificado"}
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <Label className="font-semibold">
                                                                            Teléfono
                                                                        </Label>
                                                                        <p className="font-mono">
                                                                            {
                                                                                selectedAppointment.phone_number
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <Label className="font-semibold">
                                                                            Vehículo
                                                                        </Label>
                                                                        <p>
                                                                            {selectedAppointment.vehicle_interest ||
                                                                                "No especificado"}
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <Label className="font-semibold">
                                                                            Fecha
                                                                        </Label>
                                                                        <p>
                                                                            {new Date(
                                                                                selectedAppointment.preferred_date
                                                                            ).toLocaleDateString(
                                                                                "es-ES",
                                                                                {
                                                                                    weekday:
                                                                                        "long",
                                                                                    day: "2-digit",
                                                                                    month: "long",
                                                                                    year: "numeric",
                                                                                }
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <Label className="font-semibold">
                                                                            Hora
                                                                        </Label>
                                                                        <p className="font-mono">
                                                                            {
                                                                                selectedAppointment.preferred_time
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <Label className="font-semibold">
                                                                        Estado
                                                                    </Label>
                                                                    <div className="mt-2">
                                                                        <Combobox
                                                                            options={
                                                                                statusOptions
                                                                            }
                                                                            value={
                                                                                editingStatus
                                                                            }
                                                                            onValueChange={
                                                                                setEditingStatus
                                                                            }
                                                                            placeholder="Seleccionar estado..."
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="flex justify-between items-center pt-4">
                                                                    <div>
                                                                        <p className="text-sm text-muted-foreground">
                                                                            Creada:{" "}
                                                                            {new Date(
                                                                                selectedAppointment.created_at
                                                                            ).toLocaleString(
                                                                                "es-ES"
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                    <Button
                                                                        onClick={() =>
                                                                            updateAppointmentStatus(
                                                                                selectedAppointment.id,
                                                                                editingStatus
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            editingStatus ===
                                                                            selectedAppointment.status
                                                                        }
                                                                    >
                                                                        Actualizar
                                                                        Estado
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </DialogContent>
                                                </Dialog>

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        updateAppointmentStatus(
                                                            appointment.id,
                                                            "confirmada"
                                                        )
                                                    }
                                                    disabled={
                                                        appointment.status ===
                                                        "confirmada"
                                                    }
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                </Button>

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        updateAppointmentStatus(
                                                            appointment.id,
                                                            "cancelada"
                                                        )
                                                    }
                                                    disabled={
                                                        appointment.status ===
                                                        "cancelada"
                                                    }
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                </Button>
                                            </div>
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
