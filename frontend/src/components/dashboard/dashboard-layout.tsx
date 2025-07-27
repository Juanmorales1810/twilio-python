"use client";

import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bell, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch("/api/auth", { method: "DELETE" });
            router.push("/admin/login");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="flex items-center justify-between px-6 py-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Toyota San Juan
                        </h1>
                        <p className="text-sm text-gray-500">
                            Panel de Administración
                        </p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm">
                            <Bell className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center space-x-2">
                            <Avatar>
                                <AvatarFallback>AD</AvatarFallback>
                            </Avatar>
                            <div className="text-sm">
                                <p className="font-medium">Administrador</p>
                                <p className="text-gray-500">
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
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)]">
                    <div className="p-6">
                        <DashboardNav />
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
}
