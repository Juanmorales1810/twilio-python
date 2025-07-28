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
import { Textarea } from "@/components/ui/textarea";
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
    Bot,
    MessageSquare,
    Brain,
    Settings,
    Clock,
    Users,
    Zap,
    Shield,
    Globe,
    Save,
    RefreshCw,
    TestTube,
} from "lucide-react";

export default function BotConfigPage() {
    const [isTraining, setIsTraining] = useState(false);
    const [testMode, setTestMode] = useState(false);

    const handleSaveConfig = () => {
        // Lógica para guardar configuración
        console.log("Guardando configuración del bot...");
    };

    const handleTrainBot = () => {
        setIsTraining(true);
        // Simular entrenamiento
        setTimeout(() => setIsTraining(false), 3000);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Configuración del Bot
                    </h1>
                    <p className="text-muted-foreground">
                        Configura el comportamiento y personalidad del chatbot
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={handleTrainBot}
                        disabled={isTraining}
                    >
                        {isTraining ? (
                            <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Entrenando...
                            </>
                        ) : (
                            <>
                                <Brain className="h-4 w-4 mr-2" />
                                Entrenar Bot
                            </>
                        )}
                    </Button>
                    <Button onClick={handleSaveConfig}>
                        <Save className="h-4 w-4 mr-2" />
                        Guardar Cambios
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="personality" className="space-y-4">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="personality">Personalidad</TabsTrigger>
                    <TabsTrigger value="responses">Respuestas</TabsTrigger>
                    <TabsTrigger value="intents">Intenciones</TabsTrigger>
                    <TabsTrigger value="integrations">
                        Integraciones
                    </TabsTrigger>
                    <TabsTrigger value="advanced">Avanzado</TabsTrigger>
                </TabsList>

                <TabsContent value="personality" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bot className="h-5 w-5" />
                                    Información Básica
                                </CardTitle>
                                <CardDescription>
                                    Configura la identidad del bot
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="bot-name">
                                        Nombre del Bot
                                    </Label>
                                    <Input
                                        id="bot-name"
                                        defaultValue="Toyota Assistant"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bot-greeting">
                                        Saludo Inicial
                                    </Label>
                                    <Textarea
                                        id="bot-greeting"
                                        defaultValue="¡Hola! Soy tu asistente de Toyota San Juan. ¿En qué puedo ayudarte hoy?"
                                        rows={3}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bot-tone">
                                        Tono de Comunicación
                                    </Label>
                                    <Select defaultValue="friendly">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="friendly">
                                                Amigable
                                            </SelectItem>
                                            <SelectItem value="professional">
                                                Profesional
                                            </SelectItem>
                                            <SelectItem value="casual">
                                                Casual
                                            </SelectItem>
                                            <SelectItem value="formal">
                                                Formal
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5" />
                                    Comportamiento
                                </CardTitle>
                                <CardDescription>
                                    Ajusta cómo interactúa el bot
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Respuestas Automáticas</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Responder automáticamente a saludos
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Sugerencias Proactivas</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Ofrecer ayuda adicional
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Modo de Aprendizaje</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Aprender de las conversaciones
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confidence-threshold">
                                        Umbral de Confianza
                                    </Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="confidence-threshold"
                                            type="number"
                                            defaultValue="0.8"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                        />
                                        <Badge variant="secondary">80%</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="responses" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Plantillas de Respuesta</CardTitle>
                            <CardDescription>
                                Configura respuestas predeterminadas para
                                diferentes situaciones
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="no-understand">
                                        No Entiendo
                                    </Label>
                                    <Textarea
                                        id="no-understand"
                                        defaultValue="No estoy seguro de entender tu consulta. ¿Podrías ser más específico? Puedo ayudarte con información sobre vehículos, agendar citas o resolver dudas generales."
                                        rows={3}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="escalation">
                                        Escalación a Humano
                                    </Label>
                                    <Textarea
                                        id="escalation"
                                        defaultValue="Voy a conectarte con uno de nuestros especialistas para que pueda asistirte mejor. Por favor espera un momento."
                                        rows={2}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="goodbye">Despedida</Label>
                                    <Textarea
                                        id="goodbye"
                                        defaultValue="¡Gracias por contactar Toyota San Juan! ¿Hay algo más en lo que pueda ayudarte?"
                                        rows={2}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="out-of-hours">
                                        Fuera de Horario
                                    </Label>
                                    <Textarea
                                        id="out-of-hours"
                                        defaultValue="Gracias por contactarnos. Actualmente estamos fuera del horario de atención. Nuestro horario es de Lunes a Viernes de 8:00 AM a 6:00 PM y Sábados de 9:00 AM a 2:00 PM."
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="intents" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Intenciones del Usuario</CardTitle>
                            <CardDescription>
                                Gestiona las intenciones que el bot puede
                                reconocer
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    {
                                        name: "Saludo",
                                        confidence: "95%",
                                        examples: 32,
                                        status: "active",
                                    },
                                    {
                                        name: "Información de Vehículos",
                                        confidence: "88%",
                                        examples: 156,
                                        status: "active",
                                    },
                                    {
                                        name: "Agendar Cita",
                                        confidence: "92%",
                                        examples: 89,
                                        status: "active",
                                    },
                                    {
                                        name: "Precios",
                                        confidence: "85%",
                                        examples: 67,
                                        status: "active",
                                    },
                                    {
                                        name: "Ubicación",
                                        confidence: "90%",
                                        examples: 43,
                                        status: "active",
                                    },
                                    {
                                        name: "Horarios",
                                        confidence: "87%",
                                        examples: 38,
                                        status: "active",
                                    },
                                    {
                                        name: "Financiamiento",
                                        confidence: "82%",
                                        examples: 29,
                                        status: "training",
                                    },
                                    {
                                        name: "Servicio Técnico",
                                        confidence: "79%",
                                        examples: 21,
                                        status: "review",
                                    },
                                ].map((intent, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-4 border rounded-lg"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-medium">
                                                    {intent.name}
                                                </h4>
                                                <Badge
                                                    variant={
                                                        intent.status ===
                                                        "active"
                                                            ? "default"
                                                            : intent.status ===
                                                              "training"
                                                            ? "secondary"
                                                            : "outline"
                                                    }
                                                >
                                                    {intent.status === "active"
                                                        ? "Activo"
                                                        : intent.status ===
                                                          "training"
                                                        ? "Entrenando"
                                                        : "Revisión"}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                Confianza: {intent.confidence} •{" "}
                                                {intent.examples} ejemplos
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm">
                                                Editar
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                Entrenar
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="integrations" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Zap className="h-5 w-5" />
                                    APIs Externas
                                </CardTitle>
                                <CardDescription>
                                    Configura integraciones con servicios
                                    externos
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Sistema de Inventario</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Consulta disponibilidad en tiempo
                                            real
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Sistema de Citas</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Agendamiento automático
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>CRM Toyota</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Sincronización de clientes
                                        </p>
                                    </div>
                                    <Switch />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Globe className="h-5 w-5" />
                                    Canales de Comunicación
                                </CardTitle>
                                <CardDescription>
                                    Configura los canales disponibles
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>WhatsApp Business</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Conexión vía Twilio
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Web Chat</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Chat en sitio web
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Facebook Messenger</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Integración con Facebook
                                        </p>
                                    </div>
                                    <Switch />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="h-5 w-5" />
                                    Configuración Avanzada
                                </CardTitle>
                                <CardDescription>
                                    Opciones avanzadas del bot
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="max-conversation-time">
                                        Tiempo Máximo de Conversación (min)
                                    </Label>
                                    <Input
                                        id="max-conversation-time"
                                        type="number"
                                        defaultValue="30"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="session-timeout">
                                        Timeout de Sesión (min)
                                    </Label>
                                    <Input
                                        id="session-timeout"
                                        type="number"
                                        defaultValue="15"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="max-retry-attempts">
                                        Intentos Máximos de Reintento
                                    </Label>
                                    <Input
                                        id="max-retry-attempts"
                                        type="number"
                                        defaultValue="3"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Modo de Prueba</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Activar para testing
                                        </p>
                                    </div>
                                    <Switch
                                        checked={testMode}
                                        onCheckedChange={setTestMode}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TestTube className="h-5 w-5" />
                                    Pruebas del Bot
                                </CardTitle>
                                <CardDescription>
                                    Prueba el comportamiento del bot
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="test-message">
                                        Mensaje de Prueba
                                    </Label>
                                    <Textarea
                                        id="test-message"
                                        placeholder="Escribe un mensaje para probar el bot..."
                                        rows={3}
                                    />
                                </div>
                                <Button className="w-full">
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Probar Mensaje
                                </Button>
                                <Separator />
                                <div className="space-y-2">
                                    <h4 className="font-medium">
                                        Respuesta del Bot:
                                    </h4>
                                    <div className="p-3 bg-muted rounded-lg">
                                        <p className="text-sm text-muted-foreground">
                                            Las respuestas de prueba aparecerán
                                            aquí...
                                        </p>
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
