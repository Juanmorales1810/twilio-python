"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Home,
    ArrowLeft,
    Search,
    Car,
    MapPin,
    Phone,
    Mail,
} from "lucide-react";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
            <div className="max-w-2xl mx-auto text-center space-y-8">
                {/* Logo y título principal */}
                <div className="space-y-4">
                    <div className="flex justify-center">
                        <div className="bg-red-600 text-white flex items-center justify-center rounded-full w-24 h-24">
                            <Car className="w-12 h-12" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-6xl font-bold text-red-600">404</h1>
                        <h2 className="text-3xl font-bold text-gray-900">
                            Página no encontrada
                        </h2>
                        <p className="text-xl text-gray-600">
                            Lo sentimos, la página que buscas no existe o ha
                            sido movida.
                        </p>
                    </div>
                </div>

                {/* Ilustración o mensaje adicional */}
                <Card className="border-red-200">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-center gap-2 text-red-700">
                            <Search className="w-5 h-5" />
                            ¿Qué estabas buscando?
                        </CardTitle>
                        <CardDescription>
                            Estas son algunas páginas que podrían interesarte
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Link href="/" className="group">
                                <div className="flex items-center gap-3 p-4 rounded-lg border hover:border-red-300 hover:bg-red-50 transition-colors">
                                    <Home className="w-5 h-5 text-red-600" />
                                    <div className="text-left">
                                        <div className="font-medium group-hover:text-red-700">
                                            Página Principal
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Volver al inicio
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            <Link href="/admin" className="group">
                                <div className="flex items-center gap-3 p-4 rounded-lg border hover:border-red-300 hover:bg-red-50 transition-colors">
                                    <Car className="w-5 h-5 text-red-600" />
                                    <div className="text-left">
                                        <div className="font-medium group-hover:text-red-700">
                                            Panel de Admin
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Dashboard administrativo
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            <Link href="/dashboard" className="group">
                                <div className="flex items-center gap-3 p-4 rounded-lg border hover:border-red-300 hover:bg-red-50 transition-colors">
                                    <Search className="w-5 h-5 text-red-600" />
                                    <div className="text-left">
                                        <div className="font-medium group-hover:text-red-700">
                                            Dashboard
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Panel de usuario
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            <div className="flex items-center gap-3 p-4 rounded-lg border">
                                <Phone className="w-5 h-5 text-red-600" />
                                <div className="text-left">
                                    <div className="font-medium">Contacto</div>
                                    <div className="text-sm text-gray-500">
                                        +1 (787) 123-4567
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        onClick={() => window.history.back()}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver Atrás
                    </Button>
                    <Link href="/">
                        <Button className="flex items-center gap-2 bg-red-600 hover:bg-red-700">
                            <Home className="w-4 h-4" />
                            Ir al Inicio
                        </Button>
                    </Link>
                </div>

                {/* Información de contacto */}
                <Card className="bg-white/50 backdrop-blur">
                    <CardHeader>
                        <CardTitle className="text-red-700">
                            Toyota San Juan
                        </CardTitle>
                        <CardDescription>
                            ¿Necesitas ayuda? Contáctanos
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-red-600" />
                                <div>
                                    <div className="font-medium">Ubicación</div>
                                    <div className="text-gray-600">
                                        San Juan, Puerto Rico
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-red-600" />
                                <div>
                                    <div className="font-medium">Teléfono</div>
                                    <div className="text-gray-600">
                                        +1 (787) 123-4567
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-red-600" />
                                <div>
                                    <div className="font-medium">Email</div>
                                    <div className="text-gray-600">
                                        info@toyotasanjuan.com
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer con información adicional */}
                <div className="text-sm text-gray-500">
                    <p>
                        Si crees que esto es un error, por favor{" "}
                        <Link
                            href="/contact"
                            className="text-red-600 hover:text-red-700 underline"
                        >
                            contáctanos
                        </Link>{" "}
                        y te ayudaremos a encontrar lo que buscas.
                    </p>
                </div>
            </div>
        </div>
    );
}
