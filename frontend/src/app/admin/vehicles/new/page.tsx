"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Car,
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Eye,
    Upload,
} from "lucide-react";

export default function NewVehiclePage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Agregar Vehículo
                        </h2>
                        <p className="text-muted-foreground">
                            Añadir un nuevo vehículo al catálogo
                        </p>
                    </div>
                    <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Catálogo
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Vehicle Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Información del Vehículo</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Marca
                                    </label>
                                    <Input defaultValue="Toyota" disabled />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Modelo *
                                    </label>
                                    <Input placeholder="Ej: Corolla, Camry, RAV4" />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Año *
                                    </label>
                                    <Input placeholder="2025" type="number" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Categoría *
                                    </label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                                        <option value="">
                                            Seleccionar categoría
                                        </option>
                                        <option value="sedan">Sedán</option>
                                        <option value="suv">SUV</option>
                                        <option value="pickup">Pickup</option>
                                        <option value="hatchback">
                                            Hatchback
                                        </option>
                                        <option value="hybrid">Híbrido</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Precio Base *
                                    </label>
                                    <Input placeholder="0.00" type="number" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Moneda
                                    </label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                                        <option value="USD">USD</option>
                                        <option value="DOP">DOP</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Descripción
                                </label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    rows={3}
                                    placeholder="Descripción del vehículo..."
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Motor
                                    </label>
                                    <Input placeholder="Ej: 2.0L 4 cilindros" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Transmisión
                                    </label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                                        <option value="">Seleccionar</option>
                                        <option value="manual">Manual</option>
                                        <option value="automatic">
                                            Automática
                                        </option>
                                        <option value="cvt">CVT</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Combustible
                                    </label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                                        <option value="">Seleccionar</option>
                                        <option value="gasoline">
                                            Gasolina
                                        </option>
                                        <option value="hybrid">Híbrido</option>
                                        <option value="electric">
                                            Eléctrico
                                        </option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Rendimiento (km/l)
                                    </label>
                                    <Input
                                        placeholder="0.0"
                                        type="number"
                                        step="0.1"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Puertas
                                    </label>
                                    <Input placeholder="4" type="number" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Asientos
                                    </label>
                                    <Input placeholder="5" type="number" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Airbags
                                    </label>
                                    <Input placeholder="6" type="number" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Estado
                                </label>
                                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                                    <option value="available">
                                        Disponible
                                    </option>
                                    <option value="coming_soon">
                                        Próximamente
                                    </option>
                                    <option value="discontinued">
                                        Descontinuado
                                    </option>
                                </select>
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Button className="flex-1">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Guardar Vehículo
                                </Button>
                                <Button variant="outline">Cancelar</Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Features and Images */}
                    <div className="space-y-6">
                        {/* Images */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Imágenes del Vehículo</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-600 mb-2">
                                        Arrastra las imágenes aquí o haz clic
                                        para seleccionar
                                    </p>
                                    <Button variant="outline" size="sm">
                                        Seleccionar Archivos
                                    </Button>
                                </div>
                                <p className="text-xs text-gray-500">
                                    Formatos soportados: JPG, PNG, WebP. Máximo
                                    5MB por imagen.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Features */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Características Destacadas
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Características de Seguridad
                                    </label>
                                    <div className="grid gap-2 md:grid-cols-2">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                className="rounded"
                                            />
                                            <span className="text-sm">ABS</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                className="rounded"
                                            />
                                            <span className="text-sm">ESP</span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                className="rounded"
                                            />
                                            <span className="text-sm">
                                                Control de Tracción
                                            </span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                className="rounded"
                                            />
                                            <span className="text-sm">
                                                Cámara Trasera
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Características de Confort
                                    </label>
                                    <div className="grid gap-2 md:grid-cols-2">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                className="rounded"
                                            />
                                            <span className="text-sm">
                                                Aire Acondicionado
                                            </span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                className="rounded"
                                            />
                                            <span className="text-sm">
                                                Asientos de Cuero
                                            </span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                className="rounded"
                                            />
                                            <span className="text-sm">
                                                Sistema de Navegación
                                            </span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                className="rounded"
                                            />
                                            <span className="text-sm">
                                                Bluetooth
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Tecnología
                                    </label>
                                    <div className="grid gap-2 md:grid-cols-2">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                className="rounded"
                                            />
                                            <span className="text-sm">
                                                Pantalla Táctil
                                            </span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                className="rounded"
                                            />
                                            <span className="text-sm">
                                                Android Auto
                                            </span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                className="rounded"
                                            />
                                            <span className="text-sm">
                                                Apple CarPlay
                                            </span>
                                        </label>
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                className="rounded"
                                            />
                                            <span className="text-sm">
                                                Carga Inalámbrica
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Colors */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Colores Disponibles</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Input placeholder="Agregar color (ej: Blanco Perla)" />
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <Badge variant="outline">
                                            Blanco Perla
                                        </Badge>
                                        <Badge variant="outline">
                                            Negro Metálico
                                        </Badge>
                                        <Badge variant="outline">Plata</Badge>
                                        <Badge variant="outline">
                                            Rojo Cereza
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
