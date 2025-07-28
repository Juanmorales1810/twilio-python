"use client";

import { Car, Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
            <div className="text-center space-y-6">
                {/* Logo animado */}
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="bg-red-600 text-white flex items-center justify-center rounded-full w-20 h-20 animate-pulse">
                            <Car className="w-10 h-10" />
                        </div>
                        <div className="absolute inset-0 bg-red-600 rounded-full animate-ping opacity-25"></div>
                    </div>
                </div>

                {/* Texto de carga */}
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-red-700">
                        Toyota San Juan
                    </h2>
                    <p className="text-red-600">Cargando...</p>
                </div>

                {/* Spinner */}
                <div className="flex justify-center">
                    <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                </div>

                {/* Barra de progreso animada */}
                <div className="w-64 mx-auto">
                    <div className="bg-red-200 rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-red-600 h-full rounded-full animate-pulse"
                            style={{
                                animation: "loading 2s ease-in-out infinite",
                            }}
                        ></div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes loading {
                    0% {
                        width: 0%;
                    }
                    50% {
                        width: 70%;
                    }
                    100% {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
}
