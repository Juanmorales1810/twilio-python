"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, Eye, Edit, Trash2, Car, DollarSign } from "lucide-react";

interface Vehicle {
    id: string;
    name: string;
    model: string;
    year: number;
    price: string;
    description: string;
    features: string[];
    fuel_economy: string;
    category: string;
    available: boolean;
}

export default function VehiclesPage() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(
        null
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            const response = await fetch("/api/vehicles");
            const data = await response.json();
            setVehicles(data.vehicles || []);
        } catch (error) {
            console.error("Error fetching vehicles:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredVehicles = vehicles.filter(
        (vehicle) =>
            vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehicle.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getCategoryBadge = (category: string) => {
        const categoryColors: Record<string, string> = {
            sedan: "bg-blue-100 text-blue-800",
            suv: "bg-green-100 text-green-800",
            hybrid: "bg-purple-100 text-purple-800",
            truck: "bg-orange-100 text-orange-800",
        };

        return (
            <Badge
                className={
                    categoryColors[category] || "bg-gray-100 text-gray-800"
                }
            >
                {category.toUpperCase()}
            </Badge>
        );
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-muted-foreground">
                            Cargando vehículos...
                        </p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Vehículos
                        </h2>
                        <p className="text-muted-foreground">
                            Gestiona el catálogo de vehículos disponibles
                        </p>
                    </div>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Vehículo
                    </Button>
                </div>

                {/* Quick Stats */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <Car className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="text-2xl font-bold">
                                        {vehicles.length}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Total
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <Car className="h-5 w-5 text-green-600" />
                                <div>
                                    <p className="text-2xl font-bold">
                                        {
                                            vehicles.filter((v) => v.available)
                                                .length
                                        }
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Disponibles
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <Car className="h-5 w-5 text-purple-600" />
                                <div>
                                    <p className="text-2xl font-bold">
                                        {
                                            vehicles.filter(
                                                (v) => v.category === "hybrid"
                                            ).length
                                        }
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Híbridos
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <Car className="h-5 w-5 text-orange-600" />
                                <div>
                                    <p className="text-2xl font-bold">
                                        {
                                            vehicles.filter(
                                                (v) => v.category === "suv"
                                            ).length
                                        }
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        SUVs
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search */}
                <div className="flex items-center space-x-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar vehículos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>

                {/* Vehicles Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Catálogo de Vehículos ({filteredVehicles.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Vehículo</TableHead>
                                    <TableHead>Categoría</TableHead>
                                    <TableHead>Precio</TableHead>
                                    <TableHead>Consumo</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredVehicles.map((vehicle) => (
                                    <TableRow key={vehicle.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">
                                                    {vehicle.name}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {vehicle.description.substring(
                                                        0,
                                                        50
                                                    )}
                                                    ...
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getCategoryBadge(vehicle.category)}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {vehicle.price}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {vehicle.fuel_economy}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    vehicle.available
                                                        ? "default"
                                                        : "secondary"
                                                }
                                            >
                                                {vehicle.available
                                                    ? "Disponible"
                                                    : "No disponible"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                setSelectedVehicle(
                                                                    vehicle
                                                                )
                                                            }
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-4xl">
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                Detalles del
                                                                Vehículo
                                                            </DialogTitle>
                                                        </DialogHeader>
                                                        {selectedVehicle && (
                                                            <div className="space-y-6">
                                                                <div className="grid grid-cols-2 gap-6">
                                                                    <div className="space-y-4">
                                                                        <div>
                                                                            <Label className="font-semibold">
                                                                                Nombre
                                                                            </Label>
                                                                            <p className="text-lg">
                                                                                {
                                                                                    selectedVehicle.name
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                        <div>
                                                                            <Label className="font-semibold">
                                                                                Modelo
                                                                            </Label>
                                                                            <p>
                                                                                {
                                                                                    selectedVehicle.model
                                                                                }{" "}
                                                                                {
                                                                                    selectedVehicle.year
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                        <div>
                                                                            <Label className="font-semibold">
                                                                                Categoría
                                                                            </Label>
                                                                            <div className="mt-1">
                                                                                {getCategoryBadge(
                                                                                    selectedVehicle.category
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <Label className="font-semibold">
                                                                                Precio
                                                                            </Label>
                                                                            <p className="text-lg font-medium text-green-600">
                                                                                {
                                                                                    selectedVehicle.price
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </div>

                                                                    <div className="space-y-4">
                                                                        <div>
                                                                            <Label className="font-semibold">
                                                                                Consumo
                                                                                de
                                                                                Combustible
                                                                            </Label>
                                                                            <p>
                                                                                {
                                                                                    selectedVehicle.fuel_economy
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                        <div>
                                                                            <Label className="font-semibold">
                                                                                Estado
                                                                            </Label>
                                                                            <div className="mt-1">
                                                                                <Badge
                                                                                    variant={
                                                                                        selectedVehicle.available
                                                                                            ? "default"
                                                                                            : "secondary"
                                                                                    }
                                                                                >
                                                                                    {selectedVehicle.available
                                                                                        ? "Disponible"
                                                                                        : "No disponible"}
                                                                                </Badge>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <Label className="font-semibold">
                                                                        Descripción
                                                                    </Label>
                                                                    <p className="mt-2 text-sm text-muted-foreground">
                                                                        {
                                                                            selectedVehicle.description
                                                                        }
                                                                    </p>
                                                                </div>

                                                                <div>
                                                                    <Label className="font-semibold">
                                                                        Características
                                                                    </Label>
                                                                    <div className="mt-2 grid grid-cols-2 gap-2">
                                                                        {selectedVehicle.features.map(
                                                                            (
                                                                                feature,
                                                                                index
                                                                            ) => (
                                                                                <div
                                                                                    key={
                                                                                        index
                                                                                    }
                                                                                    className="flex items-center space-x-2"
                                                                                >
                                                                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                                                                    <span className="text-sm">
                                                                                        {
                                                                                            feature
                                                                                        }
                                                                                    </span>
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </DialogContent>
                                                </Dialog>

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
