"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    Calendar,
    Car,
    MessageSquare,
    BarChart3,
    Settings,
    Home,
} from "lucide-react";

const navigation = [
    { name: "Dashboard", href: "/admin", icon: Home },
    { name: "Usuarios", href: "/admin/users", icon: Users },
    { name: "Citas", href: "/admin/appointments", icon: Calendar },
    { name: "Vehículos", href: "/admin/vehicles", icon: Car },
    {
        name: "Conversaciones",
        href: "/admin/conversations",
        icon: MessageSquare,
    },
    { name: "Estadísticas", href: "/admin/analytics", icon: BarChart3 },
    { name: "Configuración", href: "/admin/settings", icon: Settings },
];

export function DashboardNav() {
    const pathname = usePathname();

    return (
        <nav className="space-y-2">
            {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                            "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                            isActive
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                    >
                        <item.icon className="h-4 w-4" />
                        <span>{item.name}</span>
                        {item.name === "Citas" && (
                            <Badge variant="secondary" className="ml-auto">
                                3
                            </Badge>
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}
