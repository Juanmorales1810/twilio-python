"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to admin dashboard
        router.replace("/admin");
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2">Redirigiendo...</h2>
                <p className="text-muted-foreground">
                    Te estamos llevando al panel de administración
                </p>
            </div>
        </div>
    );
}
