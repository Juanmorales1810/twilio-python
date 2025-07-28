"use client";

import { Shield, Loader2, BarChart3 } from "lucide-react";

export default function AdminLoading() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center space-y-6">
                {/* Logo del admin */}
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="bg-red-600 text-white flex items-center justify-center rounded-full w-20 h-20">
                            <Shield className="w-10 h-10" />
                        </div>
                        <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                            <BarChart3 className="w-3 h-3" />
                        </div>
                    </div>
                </div>

                {/* Título */}
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Panel de Administración
                    </h2>
                    <p className="text-gray-600">Cargando dashboard...</p>
                </div>

                {/* Spinner elegante */}
                <div className="flex justify-center space-x-2">
                    <div className="w-3 h-3 bg-red-600 rounded-full animate-bounce"></div>
                    <div
                        className="w-3 h-3 bg-red-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                        className="w-3 h-3 bg-red-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                    ></div>
                </div>

                {/* Información adicional */}
                <div className="bg-white rounded-lg p-6 shadow-sm border max-w-md mx-auto">
                    <div className="flex items-center justify-center space-x-2 text-gray-500">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">
                            Preparando datos del sistema...
                        </span>
                    </div>

                    {/* Lista de elementos que se están cargando */}
                    <div className="mt-4 space-y-2 text-xs text-gray-400">
                        <div className="flex items-center justify-between">
                            <span>Estadísticas</span>
                            <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Usuarios</span>
                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Conversaciones</span>
                            <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-xs text-gray-400">
                    Toyota San Juan - Sistema de Gestión
                </p>
            </div>
        </div>
    );
}
