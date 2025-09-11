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
                                    {/* <Car className="size-4" /> */}
                                    <svg
                                        className="size-6 fill-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="800"
                                        height="800"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 4.236c-6.627 0-12 3.476-12 7.762 0 4.289 5.373 7.766 12 7.766s12-3.476 12-7.766-5.373-7.762-12-7.762zm0 12.196c-.986 0-1.79-1.942-1.84-4.385a21.093 21.093 0 0 0 3.68 0c-.05 2.442-.854 4.385-1.84 4.385zm-1.719-6.324c.268-1.727.937-2.953 1.719-2.953s1.45 1.226 1.719 2.953a19.436 19.436 0 0 1-3.438 0zM12 5.358c-1.287 0-2.385 1.928-2.79 4.619-2.44-.38-4.143-1.248-4.143-2.256 0-1.36 3.104-2.461 6.933-2.461 3.83 0 6.933 1.102 6.933 2.461 0 1.008-1.703 1.876-4.143 2.256-.405-2.69-1.503-4.618-2.79-4.618zm-10.28 6.35c0-1.315.507-2.55 1.388-3.61-.009.074-.015.15-.015.226 0 1.657 2.485 3.07 5.953 3.59-.003.12-.003.242-.003.364 0 3.09.866 5.705 2.063 6.593-5.26-.317-9.385-3.403-9.385-7.163zm11.174 7.163c1.197-.888 2.063-3.504 2.063-6.593 0-.123-.002-.243-.003-.363 3.466-.52 5.953-1.932 5.953-3.591 0-.076-.006-.152-.015-.226.881 1.063 1.387 2.295 1.387 3.61 0 3.76-4.125 6.846-9.385 7.163zm0 0Z" />
                                    </svg>
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
