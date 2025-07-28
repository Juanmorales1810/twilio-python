"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Settings,
    Save,
    RotateCcw,
    Upload,
    Download,
    Shield,
    Globe,
    Mail,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Configuración General
                        </h2>
                        <p className="text-muted-foreground">
                            Configuración global del sistema y parámetros
                            generales
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Restablecer
                        </Button>
                        <Button>
                            <Save className="h-4 w-4 mr-2" />
                            Guardar Cambios
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="general" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="company">Empresa</TabsTrigger>
                        <TabsTrigger value="notifications">
                            Notificaciones
                        </TabsTrigger>
                        <TabsTrigger value="security">Seguridad</TabsTrigger>
                        <TabsTrigger value="backup">Respaldo</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            {/* System Settings */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Configuración del Sistema
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Nombre del Sistema
                                        </label>
                                        <Input defaultValue="Toyota San Juan Chatbot" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Versión
                                        </label>
                                        <Input defaultValue="2.1.0" disabled />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Zona Horaria
                                        </label>
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                                            <option value="America/Santo_Domingo">
                                                GMT-4 (República Dominicana)
                                            </option>
                                            <option value="America/New_York">
                                                GMT-5 (New York)
                                            </option>
                                            <option value="America/Mexico_City">
                                                GMT-6 (México)
                                            </option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Idioma por Defecto
                                        </label>
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                                            <option value="es">Español</option>
                                            <option value="en">English</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Modo de Mantenimiento
                                        </label>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                className="rounded"
                                            />
                                            <span className="text-sm">
                                                Activar modo de mantenimiento
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Performance Settings */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Configuración de Rendimiento
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Límite de Conexiones Simultáneas
                                        </label>
                                        <Input
                                            type="number"
                                            defaultValue="100"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Tiempo de Sesión (minutos)
                                        </label>
                                        <Input
                                            type="number"
                                            defaultValue="30"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Caché de Respuestas
                                        </label>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                defaultChecked
                                                className="rounded"
                                            />
                                            <span className="text-sm">
                                                Habilitar caché de respuestas
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Tiempo de Caché (horas)
                                        </label>
                                        <Input
                                            type="number"
                                            defaultValue="24"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Logs de Depuración
                                        </label>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                className="rounded"
                                            />
                                            <span className="text-sm">
                                                Habilitar logs detallados
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Database Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Configuración de Base de Datos
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Servidor
                                        </label>
                                        <Input defaultValue="localhost" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Puerto
                                        </label>
                                        <Input defaultValue="27017" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Base de Datos
                                        </label>
                                        <Input defaultValue="toyota_chatbot" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Pool de Conexiones
                                        </label>
                                        <Input
                                            type="number"
                                            defaultValue="10"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="company" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            {/* Company Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Información de la Empresa
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Nombre de la Empresa
                                        </label>
                                        <Input defaultValue="Toyota San Juan" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            RNC
                                        </label>
                                        <Input defaultValue="123456789" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Dirección
                                        </label>
                                        <textarea
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            rows={3}
                                            defaultValue="Av. 27 de Febrero, San Juan, República Dominicana"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Teléfono Principal
                                        </label>
                                        <Input defaultValue="+1-809-555-0100" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Email de Contacto
                                        </label>
                                        <Input defaultValue="info@toyotasanjuan.com" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Sitio Web
                                        </label>
                                        <Input defaultValue="https://toyotasanjuan.com" />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Business Hours */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Horarios de Atención</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        {[
                                            {
                                                day: "Lunes",
                                                start: "08:00",
                                                end: "18:00",
                                                active: true,
                                            },
                                            {
                                                day: "Martes",
                                                start: "08:00",
                                                end: "18:00",
                                                active: true,
                                            },
                                            {
                                                day: "Miércoles",
                                                start: "08:00",
                                                end: "18:00",
                                                active: true,
                                            },
                                            {
                                                day: "Jueves",
                                                start: "08:00",
                                                end: "18:00",
                                                active: true,
                                            },
                                            {
                                                day: "Viernes",
                                                start: "08:00",
                                                end: "18:00",
                                                active: true,
                                            },
                                            {
                                                day: "Sábado",
                                                start: "08:00",
                                                end: "14:00",
                                                active: true,
                                            },
                                            {
                                                day: "Domingo",
                                                start: "00:00",
                                                end: "00:00",
                                                active: false,
                                            },
                                        ].map((schedule, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-4"
                                            >
                                                <div className="w-20">
                                                    <span className="text-sm font-medium">
                                                        {schedule.day}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        defaultChecked={
                                                            schedule.active
                                                        }
                                                        className="rounded"
                                                    />
                                                    <Input
                                                        type="time"
                                                        defaultValue={
                                                            schedule.start
                                                        }
                                                        className="w-24"
                                                        disabled={
                                                            !schedule.active
                                                        }
                                                    />
                                                    <span className="text-sm">
                                                        -
                                                    </span>
                                                    <Input
                                                        type="time"
                                                        defaultValue={
                                                            schedule.end
                                                        }
                                                        className="w-24"
                                                        disabled={
                                                            !schedule.active
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Logo and Branding */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Logo y Marca</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">
                                                Logo Principal
                                            </label>
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                                <p className="text-sm text-gray-600">
                                                    Logo actual
                                                </p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="mt-2"
                                                >
                                                    Cambiar Logo
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">
                                                Colores de Marca
                                            </label>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <label className="text-sm">
                                                        Color Primario:
                                                    </label>
                                                    <input
                                                        type="color"
                                                        defaultValue="#dc2626"
                                                        className="w-12 h-8 rounded"
                                                    />
                                                    <Input
                                                        defaultValue="#dc2626"
                                                        className="w-24"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <label className="text-sm">
                                                        Color Secundario:
                                                    </label>
                                                    <input
                                                        type="color"
                                                        defaultValue="#ffffff"
                                                        className="w-12 h-8 rounded"
                                                    />
                                                    <Input
                                                        defaultValue="#ffffff"
                                                        className="w-24"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="notifications" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            {/* Email Notifications */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Mail className="h-5 w-5" />
                                        Notificaciones por Email
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        {[
                                            {
                                                name: "Nuevas citas programadas",
                                                checked: true,
                                            },
                                            {
                                                name: "Mensajes de alta prioridad",
                                                checked: true,
                                            },
                                            {
                                                name: "Errores del sistema",
                                                checked: true,
                                            },
                                            {
                                                name: "Reportes diarios",
                                                checked: false,
                                            },
                                            {
                                                name: "Actualizaciones del bot",
                                                checked: true,
                                            },
                                            {
                                                name: "Nuevos usuarios registrados",
                                                checked: false,
                                            },
                                        ].map((notification, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center space-x-2"
                                            >
                                                <input
                                                    type="checkbox"
                                                    defaultChecked={
                                                        notification.checked
                                                    }
                                                    className="rounded"
                                                />
                                                <span className="text-sm">
                                                    {notification.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-2 pt-4 border-t">
                                        <label className="text-sm font-medium">
                                            Frecuencia de Reportes
                                        </label>
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                                            <option value="daily">
                                                Diario
                                            </option>
                                            <option value="weekly">
                                                Semanal
                                            </option>
                                            <option value="monthly">
                                                Mensual
                                            </option>
                                        </select>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* System Alerts */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Alertas del Sistema</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        {[
                                            {
                                                name: "Alto volumen de conversaciones",
                                                threshold: "100",
                                                checked: true,
                                            },
                                            {
                                                name: "Tiempo de respuesta elevado",
                                                threshold: "5s",
                                                checked: true,
                                            },
                                            {
                                                name: "Errores de conexión",
                                                threshold: "5",
                                                checked: true,
                                            },
                                            {
                                                name: "Espacio en disco bajo",
                                                threshold: "10%",
                                                checked: true,
                                            },
                                            {
                                                name: "Memoria insuficiente",
                                                threshold: "90%",
                                                checked: true,
                                            },
                                        ].map((alert, index) => (
                                            <div
                                                key={index}
                                                className="space-y-2"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        defaultChecked={
                                                            alert.checked
                                                        }
                                                        className="rounded"
                                                    />
                                                    <span className="text-sm flex-1">
                                                        {alert.name}
                                                    </span>
                                                    <Input
                                                        defaultValue={
                                                            alert.threshold
                                                        }
                                                        className="w-20 text-xs"
                                                        disabled={
                                                            !alert.checked
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="security" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            {/* Security Settings */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="h-5 w-5" />
                                        Configuración de Seguridad
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Autenticación de Dos Factores
                                        </label>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                defaultChecked
                                                className="rounded"
                                            />
                                            <span className="text-sm">
                                                Requerir 2FA para
                                                administradores
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Duración de Sesión Admin (horas)
                                        </label>
                                        <Input type="number" defaultValue="8" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Intentos de Login Fallidos
                                        </label>
                                        <Input type="number" defaultValue="5" />
                                        <p className="text-xs text-gray-500">
                                            Número máximo antes de bloquear la
                                            cuenta
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Tiempo de Bloqueo (minutos)
                                        </label>
                                        <Input
                                            type="number"
                                            defaultValue="30"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            HTTPS
                                        </label>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                defaultChecked
                                                className="rounded"
                                            />
                                            <span className="text-sm">
                                                Forzar conexiones HTTPS
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Privacy Settings */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Configuración de Privacidad
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Retención de Datos (días)
                                        </label>
                                        <Input
                                            type="number"
                                            defaultValue="365"
                                        />
                                        <p className="text-xs text-gray-500">
                                            Tiempo que se mantienen los
                                            registros
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Anonimización de Datos
                                        </label>
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    defaultChecked
                                                    className="rounded"
                                                />
                                                <span className="text-sm">
                                                    Anonimizar datos de usuarios
                                                    inactivos
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    className="rounded"
                                                />
                                                <span className="text-sm">
                                                    Encriptar conversaciones
                                                    sensibles
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Cumplimiento GDPR
                                        </label>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                defaultChecked
                                                className="rounded"
                                            />
                                            <span className="text-sm">
                                                Habilitar funciones GDPR
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Logs de Auditoría
                                        </label>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                defaultChecked
                                                className="rounded"
                                            />
                                            <span className="text-sm">
                                                Registrar todas las acciones de
                                                admin
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="backup" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            {/* Backup Settings */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Configuración de Respaldos
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Respaldos Automáticos
                                        </label>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                defaultChecked
                                                className="rounded"
                                            />
                                            <span className="text-sm">
                                                Habilitar respaldos automáticos
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Frecuencia
                                        </label>
                                        <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                                            <option value="daily">
                                                Diario
                                            </option>
                                            <option value="weekly">
                                                Semanal
                                            </option>
                                            <option value="monthly">
                                                Mensual
                                            </option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Hora de Respaldo
                                        </label>
                                        <Input
                                            type="time"
                                            defaultValue="02:00"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Retener Respaldos (días)
                                        </label>
                                        <Input
                                            type="number"
                                            defaultValue="30"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Ubicación de Respaldos
                                        </label>
                                        <Input defaultValue="/backups/toyota-chatbot" />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Backup Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Acciones de Respaldo</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-4">
                                        <div className="p-4 border rounded-lg">
                                            <h4 className="font-medium mb-2">
                                                Último Respaldo
                                            </h4>
                                            <p className="text-sm text-gray-600 mb-2">
                                                27 de julio, 2025 - 02:00 AM
                                            </p>
                                            <Badge className="bg-green-100 text-green-800">
                                                Exitoso
                                            </Badge>
                                        </div>

                                        <Button className="w-full">
                                            <Download className="h-4 w-4 mr-2" />
                                            Crear Respaldo Manual
                                        </Button>

                                        <Button
                                            variant="outline"
                                            className="w-full"
                                        >
                                            <Upload className="h-4 w-4 mr-2" />
                                            Restaurar desde Respaldo
                                        </Button>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">
                                                Verificar Integridad
                                            </label>
                                            <Button
                                                variant="outline"
                                                className="w-full"
                                            >
                                                Verificar Último Respaldo
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Backups */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Respaldos Recientes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {[
                                        {
                                            date: "27 Jul 2025",
                                            time: "02:00",
                                            size: "156 MB",
                                            status: "Exitoso",
                                        },
                                        {
                                            date: "26 Jul 2025",
                                            time: "02:00",
                                            size: "154 MB",
                                            status: "Exitoso",
                                        },
                                        {
                                            date: "25 Jul 2025",
                                            time: "02:00",
                                            size: "152 MB",
                                            status: "Exitoso",
                                        },
                                        {
                                            date: "24 Jul 2025",
                                            time: "02:00",
                                            size: "148 MB",
                                            status: "Error",
                                        },
                                        {
                                            date: "23 Jul 2025",
                                            time: "02:00",
                                            size: "150 MB",
                                            status: "Exitoso",
                                        },
                                    ].map((backup, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 border rounded"
                                        >
                                            <div>
                                                <p className="font-medium">
                                                    {backup.date} -{" "}
                                                    {backup.time}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Tamaño: {backup.size}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    className={
                                                        backup.status ===
                                                        "Exitoso"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                    }
                                                >
                                                    {backup.status}
                                                </Badge>
                                                {backup.status ===
                                                    "Exitoso" && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                    >
                                                        <Download className="h-3 w-3" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}
