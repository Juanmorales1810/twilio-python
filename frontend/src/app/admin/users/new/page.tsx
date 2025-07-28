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
    UserPlus,
    Search,
    Filter,
    MoreHorizontal,
    Mail,
    Phone,
    Calendar,
    Eye,
    Edit,
    Trash2,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const newUsers = [
    {
        id: 1,
        name: "María González",
        email: "maria.gonzalez@email.com",
        phone: "+1-809-555-0123",
        registeredAt: "2025-07-27",
        source: "WhatsApp",
        status: "Activo",
        lastActivity: "Hace 2 horas",
        interactions: 3,
    },
    {
        id: 2,
        name: "Carlos Rodríguez",
        email: "carlos.rodriguez@email.com",
        phone: "+1-809-555-0124",
        registeredAt: "2025-07-26",
        source: "Web",
        status: "Pendiente",
        lastActivity: "Hace 1 día",
        interactions: 1,
    },
    {
        id: 3,
        name: "Ana Martínez",
        email: "ana.martinez@email.com",
        phone: "+1-809-555-0125",
        registeredAt: "2025-07-25",
        source: "WhatsApp",
        status: "Activo",
        lastActivity: "Hace 3 horas",
        interactions: 7,
    },
    {
        id: 4,
        name: "Pedro Santos",
        email: "pedro.santos@email.com",
        phone: "+1-809-555-0126",
        registeredAt: "2025-07-24",
        source: "Referido",
        status: "Inactivo",
        lastActivity: "Hace 3 días",
        interactions: 2,
    },
    {
        id: 5,
        name: "Laura Pérez",
        email: "laura.perez@email.com",
        phone: "+1-809-555-0127",
        registeredAt: "2025-07-23",
        source: "WhatsApp",
        status: "Activo",
        lastActivity: "Hace 1 hora",
        interactions: 5,
    },
];

function getStatusBadge(status: string) {
    switch (status) {
        case "Activo":
            return (
                <Badge className="bg-green-100 text-green-800">Activo</Badge>
            );
        case "Pendiente":
            return (
                <Badge className="bg-yellow-100 text-yellow-800">
                    Pendiente
                </Badge>
            );
        case "Inactivo":
            return (
                <Badge className="bg-gray-100 text-gray-800">Inactivo</Badge>
            );
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
}

function getSourceBadge(source: string) {
    switch (source) {
        case "WhatsApp":
            return (
                <Badge variant="outline" className="bg-green-50 text-green-700">
                    WhatsApp
                </Badge>
            );
        case "Web":
            return (
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Web
                </Badge>
            );
        case "Referido":
            return (
                <Badge
                    variant="outline"
                    className="bg-purple-50 text-purple-700"
                >
                    Referido
                </Badge>
            );
        default:
            return <Badge variant="outline">{source}</Badge>;
    }
}

export default function NewUsersPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Nuevos Registros
                        </h2>
                        <p className="text-muted-foreground">
                            Usuarios registrados recientemente en el sistema
                        </p>
                    </div>
                    <Button>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Invitar Usuario
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 className="tracking-tight text-sm font-medium">
                                    Registros Hoy
                                </h3>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">3</div>
                                <p className="text-xs text-muted-foreground">
                                    +2 desde ayer
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 className="tracking-tight text-sm font-medium">
                                    Esta Semana
                                </h3>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">15</div>
                                <p className="text-xs text-muted-foreground">
                                    +25% vs semana anterior
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 className="tracking-tight text-sm font-medium">
                                    Pendientes Activación
                                </h3>
                                <Mail className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">4</div>
                                <p className="text-xs text-muted-foreground">
                                    Requieren verificación
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 className="tracking-tight text-sm font-medium">
                                    Tasa de Activación
                                </h3>
                                <UserPlus className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">87%</div>
                                <p className="text-xs text-muted-foreground">
                                    Últimos 30 días
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
                                        placeholder="Buscar usuarios..."
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

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Usuarios Registrados Recientemente
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Usuario</TableHead>
                                    <TableHead>Contacto</TableHead>
                                    <TableHead>Fecha Registro</TableHead>
                                    <TableHead>Origen</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Última Actividad</TableHead>
                                    <TableHead>Interacciones</TableHead>
                                    <TableHead className="text-right">
                                        Acciones
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {newUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">
                                                    {user.name}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    ID: {user.id}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Mail className="h-3 w-3" />
                                                    {user.email}
                                                </div>
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Phone className="h-3 w-3" />
                                                    {user.phone}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {user.registeredAt}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getSourceBadge(user.source)}
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(user.status)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {user.lastActivity}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm font-medium">
                                                {user.interactions}
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
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Ver perfil
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Mail className="mr-2 h-4 w-4" />
                                                        Enviar mensaje
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-600">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Eliminar
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
