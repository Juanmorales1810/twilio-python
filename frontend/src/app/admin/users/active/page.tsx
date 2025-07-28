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
    Mail,
    Phone,
    MessageSquare,
    Clock,
    Eye,
    Edit,
    UserX,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const activeUsers = [
    {
        id: 1,
        name: "María González",
        email: "maria.gonzalez@email.com",
        phone: "+1-809-555-0123",
        lastActivity: "Hace 5 min",
        status: "En línea",
        totalSessions: 28,
        currentSession: "15 min",
        interactions: 145,
        joinedDate: "2025-01-15",
    },
    {
        id: 2,
        name: "Carlos Rodríguez",
        email: "carlos.rodriguez@email.com",
        phone: "+1-809-555-0124",
        lastActivity: "Hace 2 horas",
        status: "Activo",
        totalSessions: 42,
        currentSession: "-",
        interactions: 298,
        joinedDate: "2024-11-20",
    },
    {
        id: 3,
        name: "Ana Martínez",
        email: "ana.martinez@email.com",
        phone: "+1-809-555-0125",
        lastActivity: "Hace 1 hora",
        status: "En línea",
        totalSessions: 67,
        currentSession: "8 min",
        interactions: 423,
        joinedDate: "2024-09-10",
    },
    {
        id: 4,
        name: "Pedro Santos",
        email: "pedro.santos@email.com",
        phone: "+1-809-555-0126",
        lastActivity: "Hace 30 min",
        status: "Activo",
        totalSessions: 15,
        currentSession: "-",
        interactions: 89,
        joinedDate: "2025-03-22",
    },
    {
        id: 5,
        name: "Laura Pérez",
        email: "laura.perez@email.com",
        phone: "+1-809-555-0127",
        lastActivity: "Hace 10 min",
        status: "En línea",
        totalSessions: 33,
        currentSession: "25 min",
        interactions: 187,
        joinedDate: "2025-02-08",
    },
    {
        id: 6,
        name: "Roberto Díaz",
        email: "roberto.diaz@email.com",
        phone: "+1-809-555-0128",
        lastActivity: "Hace 45 min",
        status: "Activo",
        totalSessions: 51,
        currentSession: "-",
        interactions: 312,
        joinedDate: "2024-12-05",
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
        case "Activo":
            return <Badge className="bg-blue-100 text-blue-800">Activo</Badge>;
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
}

export default function ActiveUsersPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Usuarios Activos
                        </h2>
                        <p className="text-muted-foreground">
                            Usuarios que han interactuado recientemente con el
                            sistema
                        </p>
                    </div>
                    <Button>
                        <Activity className="h-4 w-4 mr-2" />
                        Ver Actividad en Tiempo Real
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 className="tracking-tight text-sm font-medium">
                                    Usuarios En Línea
                                </h3>
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
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
                                    Activos Hoy
                                </h3>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">157</div>
                                <p className="text-xs text-muted-foreground">
                                    +12% vs ayer
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
                                <div className="text-2xl font-bold">18 min</div>
                                <p className="text-xs text-muted-foreground">
                                    Por sesión activa
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 className="tracking-tight text-sm font-medium">
                                    Interacciones/Usuario
                                </h3>
                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">8.5</div>
                                <p className="text-xs text-muted-foreground">
                                    Promedio por sesión
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
                                        placeholder="Buscar usuarios activos..."
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

                {/* Active Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Usuarios Activos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Usuario</TableHead>
                                    <TableHead>Contacto</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Última Actividad</TableHead>
                                    <TableHead>Sesión Actual</TableHead>
                                    <TableHead>Total Sesiones</TableHead>
                                    <TableHead>Interacciones</TableHead>
                                    <TableHead className="text-right">
                                        Acciones
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {activeUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">
                                                    {user.name}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    Miembro desde{" "}
                                                    {user.joinedDate}
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
                                            {getStatusBadge(user.status)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {user.lastActivity}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {user.currentSession ||
                                                    "Sin sesión activa"}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm font-medium">
                                                {user.totalSessions}
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
                                                        Ver actividad
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <MessageSquare className="mr-2 h-4 w-4" />
                                                        Ver conversaciones
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Editar perfil
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-600">
                                                        <UserX className="mr-2 h-4 w-4" />
                                                        Suspender usuario
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
