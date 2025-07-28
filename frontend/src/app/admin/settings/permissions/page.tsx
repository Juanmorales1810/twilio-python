"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Users,
    Shield,
    Key,
    UserPlus,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    Lock,
    Unlock,
    Crown,
    User,
    Settings,
    MoreHorizontal,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function PermissionsPage() {
    const [showPasswords, setShowPasswords] = useState(false);

    const adminUsers = [
        {
            id: 1,
            name: "Carlos Rodriguez",
            email: "carlos.rodriguez@toyota.com",
            role: "Super Admin",
            status: "active",
            lastLogin: "2024-01-15 10:30",
            permissions: ["all"],
        },
        {
            id: 2,
            name: "Maria Gonzalez",
            email: "maria.gonzalez@toyota.com",
            role: "Admin",
            status: "active",
            lastLogin: "2024-01-15 09:15",
            permissions: ["dashboard", "users", "appointments", "vehicles"],
        },
        {
            id: 3,
            name: "Luis Martinez",
            email: "luis.martinez@toyota.com",
            role: "Moderator",
            status: "active",
            lastLogin: "2024-01-14 16:45",
            permissions: ["dashboard", "conversations", "appointments"],
        },
        {
            id: 4,
            name: "Ana Perez",
            email: "ana.perez@toyota.com",
            role: "Viewer",
            status: "inactive",
            lastLogin: "2024-01-10 14:20",
            permissions: ["dashboard"],
        },
    ];

    const roles = [
        {
            name: "Super Admin",
            description: "Acceso completo a todas las funciones del sistema",
            permissions: [
                "dashboard",
                "users",
                "appointments",
                "vehicles",
                "conversations",
                "settings",
                "analytics",
            ],
            userCount: 1,
            color: "bg-red-500",
        },
        {
            name: "Admin",
            description: "Gestión de usuarios, citas y vehículos",
            permissions: [
                "dashboard",
                "users",
                "appointments",
                "vehicles",
                "conversations",
            ],
            userCount: 3,
            color: "bg-blue-500",
        },
        {
            name: "Moderator",
            description: "Gestión de conversaciones y citas",
            permissions: ["dashboard", "conversations", "appointments"],
            userCount: 2,
            color: "bg-green-500",
        },
        {
            name: "Viewer",
            description: "Solo lectura del dashboard y reportes",
            permissions: ["dashboard"],
            userCount: 1,
            color: "bg-gray-500",
        },
    ];

    const permissions = [
        {
            id: "dashboard",
            name: "Dashboard",
            description: "Ver estadísticas generales",
        },
        {
            id: "users",
            name: "Gestión de Usuarios",
            description: "Crear, editar y eliminar usuarios",
        },
        {
            id: "appointments",
            name: "Gestión de Citas",
            description: "Administrar sistema de citas",
        },
        {
            id: "vehicles",
            name: "Gestión de Vehículos",
            description: "Administrar catálogo de vehículos",
        },
        {
            id: "conversations",
            name: "Conversaciones",
            description: "Monitorear chats y conversaciones",
        },
        {
            id: "settings",
            name: "Configuración",
            description: "Acceso a configuraciones del sistema",
        },
        {
            id: "analytics",
            name: "Analytics",
            description: "Ver reportes y análisis avanzados",
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Usuarios y Permisos
                    </h1>
                    <p className="text-muted-foreground">
                        Gestiona usuarios administrativos y sus permisos de
                        acceso
                    </p>
                </div>
                <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Agregar Usuario
                </Button>
            </div>

            <Tabs defaultValue="users" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="users">Usuarios</TabsTrigger>
                    <TabsTrigger value="roles">Roles</TabsTrigger>
                    <TabsTrigger value="security">Seguridad</TabsTrigger>
                </TabsList>

                <TabsContent value="users" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Usuarios Administrativos
                            </CardTitle>
                            <CardDescription>
                                Lista de usuarios con acceso al panel de
                                administración
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <Input
                                        placeholder="Buscar usuarios..."
                                        className="max-w-sm"
                                    />
                                    <Select defaultValue="all">
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                Todos los roles
                                            </SelectItem>
                                            <SelectItem value="super-admin">
                                                Super Admin
                                            </SelectItem>
                                            <SelectItem value="admin">
                                                Admin
                                            </SelectItem>
                                            <SelectItem value="moderator">
                                                Moderator
                                            </SelectItem>
                                            <SelectItem value="viewer">
                                                Viewer
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select defaultValue="all">
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                Todos los estados
                                            </SelectItem>
                                            <SelectItem value="active">
                                                Activos
                                            </SelectItem>
                                            <SelectItem value="inactive">
                                                Inactivos
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="rounded-md border">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b bg-muted/50">
                                                    <th className="h-12 px-4 text-left align-middle font-medium">
                                                        Usuario
                                                    </th>
                                                    <th className="h-12 px-4 text-left align-middle font-medium">
                                                        Rol
                                                    </th>
                                                    <th className="h-12 px-4 text-left align-middle font-medium">
                                                        Estado
                                                    </th>
                                                    <th className="h-12 px-4 text-left align-middle font-medium">
                                                        Último Acceso
                                                    </th>
                                                    <th className="h-12 px-4 text-left align-middle font-medium">
                                                        Acciones
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {adminUsers.map((user) => (
                                                    <tr
                                                        key={user.id}
                                                        className="border-b"
                                                    >
                                                        <td className="p-4">
                                                            <div className="space-y-1">
                                                                <div className="font-medium">
                                                                    {user.name}
                                                                </div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    {user.email}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            <Badge
                                                                variant={
                                                                    user.role ===
                                                                    "Super Admin"
                                                                        ? "default"
                                                                        : user.role ===
                                                                          "Admin"
                                                                        ? "secondary"
                                                                        : user.role ===
                                                                          "Moderator"
                                                                        ? "outline"
                                                                        : "destructive"
                                                                }
                                                            >
                                                                {user.role ===
                                                                    "Super Admin" && (
                                                                    <Crown className="h-3 w-3 mr-1" />
                                                                )}
                                                                {user.role ===
                                                                    "Admin" && (
                                                                    <Shield className="h-3 w-3 mr-1" />
                                                                )}
                                                                {user.role ===
                                                                    "Moderator" && (
                                                                    <Key className="h-3 w-3 mr-1" />
                                                                )}
                                                                {user.role ===
                                                                    "Viewer" && (
                                                                    <User className="h-3 w-3 mr-1" />
                                                                )}
                                                                {user.role}
                                                            </Badge>
                                                        </td>
                                                        <td className="p-4">
                                                            <Badge
                                                                variant={
                                                                    user.status ===
                                                                    "active"
                                                                        ? "default"
                                                                        : "secondary"
                                                                }
                                                            >
                                                                {user.status ===
                                                                "active"
                                                                    ? "Activo"
                                                                    : "Inactivo"}
                                                            </Badge>
                                                        </td>
                                                        <td className="p-4 text-sm text-muted-foreground">
                                                            {user.lastLogin}
                                                        </td>
                                                        <td className="p-4">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger
                                                                    asChild
                                                                >
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                    >
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem>
                                                                        <Edit className="h-4 w-4 mr-2" />
                                                                        Editar
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem>
                                                                        <Key className="h-4 w-4 mr-2" />
                                                                        Permisos
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem>
                                                                        {user.status ===
                                                                        "active" ? (
                                                                            <>
                                                                                <Lock className="h-4 w-4 mr-2" />
                                                                                Desactivar
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <Unlock className="h-4 w-4 mr-2" />
                                                                                Activar
                                                                            </>
                                                                        )}
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem className="text-destructive">
                                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                                        Eliminar
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="roles" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {roles.map((role, index) => (
                            <Card key={index}>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`w-3 h-3 rounded-full ${role.color}`}
                                            ></div>
                                            {role.name}
                                        </div>
                                        <Badge variant="secondary">
                                            {role.userCount} usuarios
                                        </Badge>
                                    </CardTitle>
                                    <CardDescription>
                                        {role.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Permisos:</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {role.permissions.map(
                                                (permission) => (
                                                    <Badge
                                                        key={permission}
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        {permissions.find(
                                                            (p) =>
                                                                p.id ===
                                                                permission
                                                        )?.name || permission}
                                                    </Badge>
                                                )
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">
                                            <Edit className="h-4 w-4 mr-2" />
                                            Editar Rol
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <Users className="h-4 w-4 mr-2" />
                                            Ver Usuarios
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Gestión de Permisos</CardTitle>
                            <CardDescription>
                                Define qué puede hacer cada rol en el sistema
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                    {permissions.map((permission) => (
                                        <div
                                            key={permission.id}
                                            className="flex items-center justify-between p-4 border rounded-lg"
                                        >
                                            <div className="space-y-1">
                                                <h4 className="font-medium">
                                                    {permission.name}
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {permission.description}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                {roles.map((role) => (
                                                    <div
                                                        key={role.name}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <Switch
                                                            checked={role.permissions.includes(
                                                                permission.id
                                                            )}
                                                        />
                                                        <span className="text-xs text-muted-foreground">
                                                            {role.name}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Políticas de Seguridad
                                </CardTitle>
                                <CardDescription>
                                    Configura las políticas de seguridad para
                                    usuarios
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>
                                            Autenticación de Dos Factores
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Requerir 2FA para todos los usuarios
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Sesiones Múltiples</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Permitir múltiples sesiones activas
                                        </p>
                                    </div>
                                    <Switch />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="session-timeout">
                                        Timeout de Sesión (minutos)
                                    </Label>
                                    <Input
                                        id="session-timeout"
                                        type="number"
                                        defaultValue="60"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="max-attempts">
                                        Intentos Máximos de Login
                                    </Label>
                                    <Input
                                        id="max-attempts"
                                        type="number"
                                        defaultValue="5"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Key className="h-5 w-5" />
                                    Políticas de Contraseña
                                </CardTitle>
                                <CardDescription>
                                    Define los requisitos para contraseñas
                                    seguras
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="min-length">
                                        Longitud Mínima
                                    </Label>
                                    <Input
                                        id="min-length"
                                        type="number"
                                        defaultValue="8"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Requerir Mayúsculas</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Al menos una letra mayúscula
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Requerir Números</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Al menos un número
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Requerir Símbolos</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Al menos un carácter especial
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password-expiry">
                                        Expiración (días)
                                    </Label>
                                    <Input
                                        id="password-expiry"
                                        type="number"
                                        defaultValue="90"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Registro de Actividad</CardTitle>
                            <CardDescription>
                                Historial de acciones de seguridad recientes
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    {
                                        action: "Login exitoso",
                                        user: "carlos.rodriguez@toyota.com",
                                        ip: "192.168.1.100",
                                        time: "2024-01-15 10:30:15",
                                        type: "success",
                                    },
                                    {
                                        action: "Cambio de permisos",
                                        user: "maria.gonzalez@toyota.com",
                                        ip: "192.168.1.101",
                                        time: "2024-01-15 09:45:22",
                                        type: "warning",
                                    },
                                    {
                                        action: "Intento de login fallido",
                                        user: "unknown@gmail.com",
                                        ip: "203.0.113.42",
                                        time: "2024-01-15 08:20:33",
                                        type: "error",
                                    },
                                    {
                                        action: "Usuario creado",
                                        user: "admin@toyota.com",
                                        ip: "192.168.1.100",
                                        time: "2024-01-14 16:15:44",
                                        type: "info",
                                    },
                                ].map((log, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 border rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Badge
                                                variant={
                                                    log.type === "success"
                                                        ? "default"
                                                        : log.type === "warning"
                                                        ? "secondary"
                                                        : log.type === "error"
                                                        ? "destructive"
                                                        : "outline"
                                                }
                                            >
                                                {log.type === "success" && "✓"}
                                                {log.type === "warning" && "⚠"}
                                                {log.type === "error" && "✗"}
                                                {log.type === "info" && "ℹ"}
                                            </Badge>
                                            <div>
                                                <div className="font-medium">
                                                    {log.action}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {log.user} desde {log.ip}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {log.time}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
