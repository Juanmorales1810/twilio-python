"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, LogOut } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        try {
            await fetch("/api/auth", { method: "DELETE" });
            router.push("/admin/login");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    // Function to get breadcrumb info based on current path
    const getBreadcrumbInfo = () => {
        const segments = pathname.split("/").filter(Boolean);

        const breadcrumbMap: { [key: string]: string } = {
            admin: "Dashboard",
            users: "Usuarios",
            appointments: "Citas",
            vehicles: "Vehículos",
            conversations: "Conversaciones",
            settings: "Configuración",
        };

        if (segments.length === 1 && segments[0] === "admin") {
            return { section: "Dashboard", page: "Resumen General" };
        }

        const section = segments[1];
        return {
            section: breadcrumbMap[section] || "Dashboard",
            page:
                segments.length > 2
                    ? "Detalle"
                    : breadcrumbMap[section] || "Dashboard",
        };
    };

    const { section, page } = getBreadcrumbInfo();

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b">
                    <div className="flex items-center gap-2 px-4 flex-1">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/admin">
                                        Toyota San Juan
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{section}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>

                    {/* Header Actions */}
                    <div className="flex items-center space-x-4 px-4">
                        <Button variant="outline" size="sm">
                            <Bell className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>AD</AvatarFallback>
                            </Avatar>
                            <div className="text-sm hidden md:block">
                                <p className="font-medium">Administrador</p>
                                <p className="text-muted-foreground text-xs">
                                    admin@toyota.com
                                </p>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </header>

                {/* Main content */}
                <main className="flex-1 p-6">{children}</main>
            </SidebarInset>
        </SidebarProvider>
    );
}
