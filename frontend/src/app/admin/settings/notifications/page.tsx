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
    Bell,
    Mail,
    MessageSquare,
    AlertTriangle,
    CheckCircle,
    Clock,
    Users,
    Settings,
    Volume2,
    Smartphone,
    Monitor,
    Save,
} from "lucide-react";

export default function NotificationsPage() {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(true);

    const handleSaveSettings = () => {
        console.log("Guardando configuración de notificaciones...");
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Configuración de Notificaciones
                    </h1>
                    <p className="text-muted-foreground">
                        Gestiona cómo y cuándo recibir notificaciones del
                        sistema
                    </p>
                </div>
                <Button onClick={handleSaveSettings}>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
                </Button>
            </div>

            <Tabs defaultValue="general" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="chatbot">Chatbot</TabsTrigger>
                    <TabsTrigger value="appointments">Citas</TabsTrigger>
                    <TabsTrigger value="system">Sistema</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bell className="h-5 w-5" />
                                    Preferencias Generales
                                </CardTitle>
                                <CardDescription>
                                    Configura tus preferencias básicas de
                                    notificación
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Notificaciones por Email</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Recibir notificaciones en tu correo
                                            electrónico
                                        </p>
                                    </div>
                                    <Switch
                                        checked={emailNotifications}
                                        onCheckedChange={setEmailNotifications}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Notificaciones Push</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Recibir notificaciones en tiempo
                                            real
                                        </p>
                                    </div>
                                    <Switch
                                        checked={pushNotifications}
                                        onCheckedChange={setPushNotifications}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Sonidos de Notificación</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Reproducir sonidos para
                                            notificaciones
                                        </p>
                                    </div>
                                    <Switch
                                        checked={soundEnabled}
                                        onCheckedChange={setSoundEnabled}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Mail className="h-5 w-5" />
                                    Configuración de Email
                                </CardTitle>
                                <CardDescription>
                                    Configura las opciones de envío de emails
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email-address">
                                        Dirección de Email
                                    </Label>
                                    <Input
                                        id="email-address"
                                        type="email"
                                        defaultValue="admin@toyotasanjuan.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email-frequency">
                                        Frecuencia de Resumen
                                    </Label>
                                    <Select defaultValue="daily">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="immediate">
                                                Inmediato
                                            </SelectItem>
                                            <SelectItem value="hourly">
                                                Cada Hora
                                            </SelectItem>
                                            <SelectItem value="daily">
                                                Diario
                                            </SelectItem>
                                            <SelectItem value="weekly">
                                                Semanal
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email-time">
                                        Hora de Envío (Resumen Diario)
                                    </Label>
                                    <Input
                                        id="email-time"
                                        type="time"
                                        defaultValue="09:00"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="chatbot" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5" />
                                Notificaciones del Chatbot
                            </CardTitle>
                            <CardDescription>
                                Configura las alertas relacionadas con el
                                chatbot
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="font-medium">
                                        Conversaciones
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>
                                                    Nuevas Conversaciones
                                                </Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Cuando un usuario inicia una
                                                    conversación
                                                </p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>
                                                    Escalaciones a Humano
                                                </Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Cuando el bot deriva a un
                                                    agente
                                                </p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>
                                                    Conversaciones Sin Respuesta
                                                </Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Usuarios que no responden en
                                                    15 min
                                                </p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-medium">
                                        Rendimiento del Bot
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>
                                                    Baja Confianza en Respuestas
                                                </Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Cuando la confianza es menor
                                                    al 70%
                                                </p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Errores del Bot</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Errores técnicos o fallos
                                                    del sistema
                                                </p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>
                                                    Nuevas Intenciones
                                                    Detectadas
                                                </Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Patrones de conversación no
                                                    reconocidos
                                                </p>
                                            </div>
                                            <Switch />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <h4 className="font-medium">
                                    Umbrales de Alerta
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="conversation-threshold">
                                            Conversaciones por Hora
                                        </Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                id="conversation-threshold"
                                                type="number"
                                                defaultValue="50"
                                            />
                                            <Badge variant="secondary">
                                                máx
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="response-time">
                                            Tiempo de Respuesta (seg)
                                        </Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                id="response-time"
                                                type="number"
                                                defaultValue="3"
                                            />
                                            <Badge variant="secondary">
                                                máx
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="error-rate">
                                            Tasa de Error (%)
                                        </Label>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                id="error-rate"
                                                type="number"
                                                defaultValue="5"
                                            />
                                            <Badge variant="secondary">
                                                máx
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="appointments" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    Gestión de Citas
                                </CardTitle>
                                <CardDescription>
                                    Notificaciones sobre el sistema de citas
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Nuevas Citas Agendadas</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Cuando se agenda una nueva cita
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Citas Modificadas</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Cambios en citas existentes
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Citas Canceladas</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Cancelaciones de citas
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Recordatorios de Citas</Label>
                                        <p className="text-sm text-muted-foreground">
                                            24 horas antes de la cita
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Alertas de Capacidad
                                </CardTitle>
                                <CardDescription>
                                    Monitoreo de disponibilidad y capacidad
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Agenda Completa</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Cuando no hay horarios disponibles
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Baja Disponibilidad</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Menos del 20% de horarios libres
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="capacity-threshold">
                                        Umbral de Capacidad (%)
                                    </Label>
                                    <Input
                                        id="capacity-threshold"
                                        type="number"
                                        defaultValue="80"
                                        min="0"
                                        max="100"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="advance-notice">
                                        Aviso Anticipado (días)
                                    </Label>
                                    <Input
                                        id="advance-notice"
                                        type="number"
                                        defaultValue="3"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="system" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5" />
                                    Alertas del Sistema
                                </CardTitle>
                                <CardDescription>
                                    Notificaciones críticas del sistema
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Errores del Sistema</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Fallos críticos y errores 500
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Alto Uso de Recursos</Label>
                                        <p className="text-sm text-muted-foreground">
                                            CPU o memoria por encima del 80%
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>
                                            Actualizaciones Disponibles
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Nuevas versiones del sistema
                                        </p>
                                    </div>
                                    <Switch />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Backup Completado</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Confirmación de respaldos exitosos
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="h-5 w-5" />
                                    Canales de Notificación
                                </CardTitle>
                                <CardDescription>
                                    Configura por dónde recibir las alertas
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-4">
                                    <h4 className="font-medium flex items-center gap-2">
                                        <Monitor className="h-4 w-4" />
                                        Dashboard Web
                                    </h4>
                                    <div className="flex items-center justify-between ml-6">
                                        <Label>
                                            Notificaciones en tiempo real
                                        </Label>
                                        <Switch defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between ml-6">
                                        <Label>Badge de contador</Label>
                                        <Switch defaultChecked />
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h4 className="font-medium flex items-center gap-2">
                                        <Smartphone className="h-4 w-4" />
                                        WhatsApp Business
                                    </h4>
                                    <div className="flex items-center justify-between ml-6">
                                        <Label>
                                            Alertas críticas únicamente
                                        </Label>
                                        <Switch />
                                    </div>
                                    <div className="space-y-2 ml-6">
                                        <Label htmlFor="whatsapp-number">
                                            Número de WhatsApp
                                        </Label>
                                        <Input
                                            id="whatsapp-number"
                                            placeholder="+1234567890"
                                        />
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h4 className="font-medium flex items-center gap-2">
                                        <Volume2 className="h-4 w-4" />
                                        Sonidos
                                    </h4>
                                    <div className="space-y-2 ml-6">
                                        <Label htmlFor="notification-sound">
                                            Tono de Notificación
                                        </Label>
                                        <Select defaultValue="default">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="default">
                                                    Por Defecto
                                                </SelectItem>
                                                <SelectItem value="chime">
                                                    Campanita
                                                </SelectItem>
                                                <SelectItem value="beep">
                                                    Beep
                                                </SelectItem>
                                                <SelectItem value="ding">
                                                    Ding
                                                </SelectItem>
                                                <SelectItem value="none">
                                                    Sin Sonido
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
