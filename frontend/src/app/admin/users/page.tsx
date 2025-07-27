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
import { Search, Plus, Eye, Trash2, MessageCircle } from "lucide-react";

interface User {
    id: string;
    phone_number: string;
    name?: string;
    email?: string;
    current_step: string;
    conversation_data: {
        vehiculo_interes?: string;
        fecha?: string;
        hora?: string;
    };
    created_at: string;
    updated_at: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch("/api/users");
            const data = await response.json();
            setUsers(data.users || []);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(
        (user) =>
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone_number.includes(searchTerm) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStepBadge = (step: string) => {
        const stepColors: Record<string, string> = {
            inicio: "bg-gray-100 text-gray-800",
            conversacion_general: "bg-blue-100 text-blue-800",
            solicitar_nombre: "bg-yellow-100 text-yellow-800",
            solicitar_email: "bg-orange-100 text-orange-800",
            solicitar_fecha: "bg-purple-100 text-purple-800",
            solicitar_hora: "bg-indigo-100 text-indigo-800",
            confirmar_cita: "bg-green-100 text-green-800",
            cita_creada: "bg-emerald-100 text-emerald-800",
        };

        return (
            <Badge className={stepColors[step] || "bg-gray-100 text-gray-800"}>
                {step.replace("_", " ")}
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
                            Cargando usuarios...
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
                            Usuarios
                        </h2>
                        <p className="text-muted-foreground">
                            Gestiona todos los usuarios del chatbot
                        </p>
                    </div>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Usuario
                    </Button>
                </div>

                {/* Search */}
                <div className="flex items-center space-x-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar usuarios..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Lista de Usuarios ({filteredUsers.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Usuario</TableHead>
                                    <TableHead>Teléfono</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Vehículo de Interés</TableHead>
                                    <TableHead>Última Actividad</TableHead>
                                    <TableHead>Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">
                                                    {user.name || "Sin nombre"}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {user.email || "Sin email"}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono">
                                            {user.phone_number}
                                        </TableCell>
                                        <TableCell>
                                            {getStepBadge(user.current_step)}
                                        </TableCell>
                                        <TableCell>
                                            {user.conversation_data
                                                .vehiculo_interes ? (
                                                <Badge variant="outline">
                                                    {
                                                        user.conversation_data
                                                            .vehiculo_interes
                                                    }
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    -
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {new Date(
                                                    user.updated_at
                                                ).toLocaleDateString("es-ES", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                setSelectedUser(
                                                                    user
                                                                )
                                                            }
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-2xl">
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                Detalles del
                                                                Usuario
                                                            </DialogTitle>
                                                        </DialogHeader>
                                                        {selectedUser && (
                                                            <div className="space-y-4">
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <Label className="font-semibold">
                                                                            Nombre
                                                                        </Label>
                                                                        <p>
                                                                            {selectedUser.name ||
                                                                                "No especificado"}
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <Label className="font-semibold">
                                                                            Email
                                                                        </Label>
                                                                        <p>
                                                                            {selectedUser.email ||
                                                                                "No especificado"}
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <Label className="font-semibold">
                                                                            Teléfono
                                                                        </Label>
                                                                        <p>
                                                                            {
                                                                                selectedUser.phone_number
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <Label className="font-semibold">
                                                                            Estado
                                                                            Actual
                                                                        </Label>
                                                                        <div className="mt-1">
                                                                            {getStepBadge(
                                                                                selectedUser.current_step
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <Label className="font-semibold">
                                                                        Datos de
                                                                        Conversación
                                                                    </Label>
                                                                    <div className="mt-2 space-y-2">
                                                                        {Object.entries(
                                                                            selectedUser.conversation_data
                                                                        ).map(
                                                                            ([
                                                                                key,
                                                                                value,
                                                                            ]) => (
                                                                                <div
                                                                                    key={
                                                                                        key
                                                                                    }
                                                                                    className="flex justify-between"
                                                                                >
                                                                                    <span className="text-sm text-muted-foreground capitalize">
                                                                                        {key.replace(
                                                                                            "_",
                                                                                            " "
                                                                                        )}
                                                                                        :
                                                                                    </span>
                                                                                    <span className="text-sm font-medium">
                                                                                        {value ||
                                                                                            "-"}
                                                                                    </span>
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <Label className="font-semibold">
                                                                            Creado
                                                                        </Label>
                                                                        <p className="text-sm">
                                                                            {new Date(
                                                                                selectedUser.created_at
                                                                            ).toLocaleString(
                                                                                "es-ES"
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <Label className="font-semibold">
                                                                            Última
                                                                            Actualización
                                                                        </Label>
                                                                        <p className="text-sm">
                                                                            {new Date(
                                                                                selectedUser.updated_at
                                                                            ).toLocaleString(
                                                                                "es-ES"
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </DialogContent>
                                                </Dialog>

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <MessageCircle className="h-4 w-4" />
                                                </Button>

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Trash2 className="h-4 w-4" />
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
