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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, MessageSquare, User, Bot, Clock } from "lucide-react";

interface Message {
    message: string;
    response: string;
    timestamp: string;
}

interface Conversation {
    user_id: string;
    phone_number: string;
    username?: string;
    messages: Message[];
    last_activity: string;
    total_messages: number;
}

export default function ConversationsPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedConversation, setSelectedConversation] =
        useState<Conversation | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        try {
            // Obtener usuarios con sus conversaciones
            const response = await fetch("/api/users");
            const data = await response.json();

            // Transformar datos para mostrar conversaciones
            const conversationData = data.users
                .filter(
                    (user: any) => user.messages && user.messages.length > 0
                )
                .map((user: any) => ({
                    user_id: user._id,
                    phone_number: user.phone_number,
                    username: user.name || `Usuario ${user.phone_number}`,
                    messages: user.messages,
                    last_activity:
                        user.messages[user.messages.length - 1]?.timestamp ||
                        user.updated_at,
                    total_messages: user.messages.length,
                }))
                .sort(
                    (a: any, b: any) =>
                        new Date(b.last_activity).getTime() -
                        new Date(a.last_activity).getTime()
                );

            setConversations(conversationData);
        } catch (error) {
            console.error("Error fetching conversations:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredConversations = conversations.filter(
        (conv) =>
            conv.phone_number.includes(searchTerm) ||
            (conv.username &&
                conv.username.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours =
            Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 1) {
            return "Hace menos de 1 hora";
        } else if (diffInHours < 24) {
            return `Hace ${Math.floor(diffInHours)} horas`;
        } else {
            return date.toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        }
    };

    const getActivityStatus = (lastActivity: string) => {
        const date = new Date(lastActivity);
        const now = new Date();
        const diffInHours =
            Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 1) {
            return {
                label: "Muy Activo",
                color: "bg-green-100 text-green-800",
            };
        } else if (diffInHours < 24) {
            return { label: "Activo", color: "bg-blue-100 text-blue-800" };
        } else if (diffInHours < 168) {
            // 7 días
            return {
                label: "Reciente",
                color: "bg-yellow-100 text-yellow-800",
            };
        } else {
            return { label: "Inactivo", color: "bg-gray-100 text-gray-800" };
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-muted-foreground">
                            Cargando conversaciones...
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
                            Conversaciones
                        </h2>
                        <p className="text-muted-foreground">
                            Visualiza y analiza las conversaciones con el
                            chatbot
                        </p>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <MessageSquare className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="text-2xl font-bold">
                                        {conversations.length}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Conversaciones
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <MessageSquare className="h-5 w-5 text-green-600" />
                                <div>
                                    <p className="text-2xl font-bold">
                                        {conversations.reduce(
                                            (acc, conv) =>
                                                acc + conv.total_messages,
                                            0
                                        )}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Total Mensajes
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <Clock className="h-5 w-5 text-purple-600" />
                                <div>
                                    <p className="text-2xl font-bold">
                                        {
                                            conversations.filter((conv) => {
                                                const diffInHours =
                                                    Math.abs(
                                                        new Date().getTime() -
                                                            new Date(
                                                                conv.last_activity
                                                            ).getTime()
                                                    ) /
                                                    (1000 * 60 * 60);
                                                return diffInHours < 24;
                                            }).length
                                        }
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Activas Hoy
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <MessageSquare className="h-5 w-5 text-orange-600" />
                                <div>
                                    <p className="text-2xl font-bold">
                                        {conversations.length > 0
                                            ? Math.round(
                                                  conversations.reduce(
                                                      (acc, conv) =>
                                                          acc +
                                                          conv.total_messages,
                                                      0
                                                  ) / conversations.length
                                              )
                                            : 0}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Promedio/Usuario
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
                            placeholder="Buscar por teléfono o nombre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>

                {/* Conversations Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Historial de Conversaciones (
                            {filteredConversations.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Usuario</TableHead>
                                    <TableHead>Mensajes</TableHead>
                                    <TableHead>Última Actividad</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredConversations.map((conversation) => {
                                    const status = getActivityStatus(
                                        conversation.last_activity
                                    );
                                    return (
                                        <TableRow key={conversation.user_id}>
                                            <TableCell>
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                            <User className="h-4 w-4 text-primary" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">
                                                            {conversation.username ||
                                                                "Usuario sin nombre"}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {
                                                                conversation.phone_number
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {
                                                        conversation.total_messages
                                                    }{" "}
                                                    mensajes
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {formatDate(
                                                    conversation.last_activity
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={status.color}>
                                                    {status.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                setSelectedConversation(
                                                                    conversation
                                                                )
                                                            }
                                                        >
                                                            <MessageSquare className="h-4 w-4 mr-2" />
                                                            Ver Chat
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-4xl max-h-[80vh]">
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                Conversación con{" "}
                                                                {selectedConversation?.username ||
                                                                    "Usuario"}
                                                            </DialogTitle>
                                                            <p className="text-sm text-muted-foreground">
                                                                {
                                                                    selectedConversation?.phone_number
                                                                }{" "}
                                                                •{" "}
                                                                {
                                                                    selectedConversation?.total_messages
                                                                }{" "}
                                                                mensajes
                                                            </p>
                                                        </DialogHeader>
                                                        {selectedConversation && (
                                                            <ScrollArea className="h-[500px] pr-4">
                                                                <div className="space-y-4">
                                                                    {selectedConversation.messages.map(
                                                                        (
                                                                            message,
                                                                            index
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    index
                                                                                }
                                                                                className="space-y-2"
                                                                            >
                                                                                {/* Mensaje del usuario */}
                                                                                <div className="flex items-start space-x-2">
                                                                                    <div className="flex-shrink-0">
                                                                                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                                                                            <User className="h-3 w-3 text-blue-600" />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex-1">
                                                                                        <div className="bg-blue-50 rounded-lg p-3">
                                                                                            <p className="text-sm">
                                                                                                {
                                                                                                    message.message
                                                                                                }
                                                                                            </p>
                                                                                        </div>
                                                                                        <p className="text-xs text-muted-foreground mt-1">
                                                                                            {new Date(
                                                                                                message.timestamp
                                                                                            ).toLocaleString(
                                                                                                "es-ES"
                                                                                            )}
                                                                                        </p>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Respuesta del bot */}
                                                                                <div className="flex items-start space-x-2">
                                                                                    <div className="flex-shrink-0">
                                                                                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                                                                            <Bot className="h-3 w-3 text-green-600" />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex-1">
                                                                                        <div className="bg-green-50 rounded-lg p-3">
                                                                                            <p className="text-sm">
                                                                                                {
                                                                                                    message.response
                                                                                                }
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>
                                                            </ScrollArea>
                                                        )}
                                                    </DialogContent>
                                                </Dialog>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
