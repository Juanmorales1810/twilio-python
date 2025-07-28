"use client";

import * as React from "react";
import {
    BarChart3,
    Bot,
    Calendar,
    Car,
    Command,
    LifeBuoy,
    MessageSquare,
    Send,
    Settings2,
    Users,
    Home,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
    user: {
        name: "Admin",
        email: "admin@toyota.com",
        avatar: "/avatars/admin.jpg",
    },
    navMain: [
        {
            title: "Dashboard",
            url: "/admin",
            icon: Home,
            isActive: true,
            items: [
                {
                    title: "Resumen General",
                    url: "/admin",
                },
                {
                    title: "Estadísticas",
                    url: "/admin/stats",
                },
                {
                    title: "Reportes",
                    url: "/admin/reports",
                },
            ],
        },
        {
            title: "Usuarios",
            url: "/admin/users",
            icon: Users,
            items: [
                {
                    title: "Todos los Usuarios",
                    url: "/admin/users",
                },
                {
                    title: "Nuevos Registros",
                    url: "/admin/users/new",
                },
                {
                    title: "Usuarios Activos",
                    url: "/admin/users/active",
                },
            ],
        },
        {
            title: "Citas",
            url: "/admin/appointments",
            icon: Calendar,
            items: [
                {
                    title: "Todas las Citas",
                    url: "/admin/appointments",
                },
                {
                    title: "Pendientes",
                    url: "/admin/appointments/pending",
                },
                {
                    title: "Confirmadas",
                    url: "/admin/appointments/confirmed",
                },
                {
                    title: "Completadas",
                    url: "/admin/appointments/completed",
                },
            ],
        },
        {
            title: "Vehículos",
            url: "/admin/vehicles",
            icon: Car,
            items: [
                {
                    title: "Catálogo",
                    url: "/admin/vehicles",
                },
                {
                    title: "Agregar Vehículo",
                    url: "/admin/vehicles/new",
                },
                {
                    title: "Modelos Populares",
                    url: "/admin/vehicles/popular",
                },
            ],
        },
        {
            title: "Conversaciones",
            url: "/admin/conversations",
            icon: MessageSquare,
            items: [
                {
                    title: "Historial de Chats",
                    url: "/admin/conversations",
                },
                {
                    title: "Conversaciones Activas",
                    url: "/admin/conversations/active",
                },
                {
                    title: "Análisis de Bot",
                    url: "/admin/conversations/analytics",
                },
            ],
        },
        {
            title: "Configuración",
            url: "/admin/settings",
            icon: Settings2,
            items: [
                {
                    title: "General",
                    url: "/admin/settings",
                },
                {
                    title: "Bot Config",
                    url: "/admin/settings/bot",
                },
                {
                    title: "Notificaciones",
                    url: "/admin/settings/notifications",
                },
                {
                    title: "Usuarios y Permisos",
                    url: "/admin/settings/permissions",
                },
            ],
        },
    ],
    navSecondary: [
        {
            title: "Soporte",
            url: "/support",
            icon: LifeBuoy,
        },
        {
            title: "Feedback",
            url: "/feedback",
            icon: Send,
        },
    ],
    projects: [
        {
            name: "Chatbot Toyota",
            url: "/admin/conversations",
            icon: Bot,
        },
        {
            name: "Analytics",
            url: "/admin/analytics",
            icon: BarChart3,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="/admin">
                                <div className="bg-red-600 text-white flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <Car className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">
                                        Toyota San Juan
                                    </span>
                                    <span className="truncate text-xs">
                                        Chatbot Admin
                                    </span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavProjects projects={data.projects} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    );
}
