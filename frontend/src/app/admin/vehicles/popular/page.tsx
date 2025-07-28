"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    TrendingUp,
    Search,
    Filter,
    MoreHorizontal,
    Car,
    Eye,
    MessageSquare,
    Star,
    Calendar,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const popularVehicles = [
    {
        id: 1,
        model: "Toyota Corolla 2025",
        category: "Sedán",
        consultations: 156,
        testDrives: 45,
        quotes: 78,
        purchases: 23,
        avgRating: 4.8,
        priceRange: "$22,000 - $28,000",
        trend: "+15%",
        popularity: 92,
        image: "/vehicles/corolla.jpg",
    },
    {
        id: 2,
        model: "Toyota RAV4 2025",
        category: "SUV",
        consultations: 134,
        testDrives: 38,
        quotes: 65,
        purchases: 19,
        avgRating: 4.7,
        priceRange: "$35,000 - $42,000",
        trend: "+8%",
        popularity: 85,
        image: "/vehicles/rav4.jpg",
    },
    {
        id: 3,
        model: "Toyota Camry 2025",
        category: "Sedán",
        consultations: 98,
        testDrives: 28,
        quotes: 52,
        purchases: 15,
        avgRating: 4.6,
        priceRange: "$30,000 - $38,000",
        trend: "+12%",
        popularity: 78,
        image: "/vehicles/camry.jpg",
    },
    {
        id: 4,
        model: "Toyota Hilux 2025",
        category: "Pickup",
        consultations: 87,
        testDrives: 25,
        quotes: 45,
        purchases: 12,
        avgRating: 4.5,
        priceRange: "$32,000 - $45,000",
        trend: "+5%",
        popularity: 72,
        image: "/vehicles/hilux.jpg",
    },
    {
        id: 5,
        model: "Toyota Prius 2025",
        category: "Híbrido",
        consultations: 76,
        testDrives: 22,
        quotes: 38,
        purchases: 10,
        avgRating: 4.4,
        priceRange: "$28,000 - $35,000",
        trend: "+18%",
        popularity: 68,
        image: "/vehicles/prius.jpg",
    },
    {
        id: 6,
        model: "Toyota Yaris 2025",
        category: "Hatchback",
        consultations: 65,
        testDrives: 18,
        quotes: 32,
        purchases: 8,
        avgRating: 4.3,
        priceRange: "$18,000 - $24,000",
        trend: "+3%",
        popularity: 65,
        image: "/vehicles/yaris.jpg",
    },
];

function getCategoryBadge(category: string) {
    switch (category) {
        case "Sedán":
            return <Badge className="bg-blue-100 text-blue-800">Sedán</Badge>;
        case "SUV":
            return <Badge className="bg-green-100 text-green-800">SUV</Badge>;
        case "Pickup":
            return (
                <Badge className="bg-orange-100 text-orange-800">Pickup</Badge>
            );
        case "Híbrido":
            return (
                <Badge className="bg-purple-100 text-purple-800">Híbrido</Badge>
            );
        case "Hatchback":
            return (
                <Badge className="bg-gray-100 text-gray-800">Hatchback</Badge>
            );
        default:
            return <Badge variant="outline">{category}</Badge>;
    }
}

function getTrendIcon(trend: string) {
    const isPositive = trend.startsWith("+");
    return (
        <span
            className={`flex items-center gap-1 ${
                isPositive ? "text-green-600" : "text-red-600"
            }`}
        >
            <TrendingUp
                className={`h-3 w-3 ${!isPositive ? "rotate-180" : ""}`}
            />
            {trend}
        </span>
    );
}

function getPopularityBar(popularity: number) {
    return (
        <div className="flex items-center gap-2">
            <div className="w-20 h-2 bg-gray-200 rounded-full">
                <div
                    className="h-2 bg-blue-500 rounded-full"
                    style={{ width: `${popularity}%` }}
                />
            </div>
            <span className="text-sm font-medium">{popularity}%</span>
        </div>
    );
}

function getRatingStars(rating: number) {
    return (
        <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    className={`h-3 w-3 ${
                        i < Math.floor(rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                    }`}
                />
            ))}
            <span className="text-sm text-muted-foreground ml-1">
                ({rating})
            </span>
        </div>
    );
}

export default function PopularVehiclesPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Modelos Populares
                        </h2>
                        <p className="text-muted-foreground">
                            Vehículos más consultados y con mayor interés
                        </p>
                    </div>
                    <Button>
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Análisis Detallado
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 className="tracking-tight text-sm font-medium">
                                    Modelo Más Popular
                                </h3>
                                <Star className="h-4 w-4 text-yellow-500" />
                            </div>
                            <div>
                                <div className="text-lg font-bold">
                                    Toyota Corolla
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    156 consultas este mes
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 className="tracking-tight text-sm font-medium">
                                    Test Drives
                                </h3>
                                <Car className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">176</div>
                                <p className="text-xs text-muted-foreground">
                                    Total este mes
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 className="tracking-tight text-sm font-medium">
                                    Tasa de Conversión
                                </h3>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">18.5%</div>
                                <p className="text-xs text-muted-foreground">
                                    Consulta a venta
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <h3 className="tracking-tight text-sm font-medium">
                                    Calificación Promedio
                                </h3>
                                <Star className="h-4 w-4 text-yellow-500" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold">4.6</div>
                                <p className="text-xs text-muted-foreground">
                                    Satisfacción general
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex gap-4 items-center">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Buscar modelos populares..."
                                        className="pl-8"
                                    />
                                </div>
                            </div>
                            <Button variant="outline">
                                <Filter className="h-4 w-4 mr-2" />
                                Filtros
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Popular Vehicles Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Ranking de Modelos Populares</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Modelo</TableHead>
                                    <TableHead>Categoría</TableHead>
                                    <TableHead>Consultas</TableHead>
                                    <TableHead>Test Drives</TableHead>
                                    <TableHead>Cotizaciones</TableHead>
                                    <TableHead>Ventas</TableHead>
                                    <TableHead>Calificación</TableHead>
                                    <TableHead>Popularidad</TableHead>
                                    <TableHead>Tendencia</TableHead>
                                    <TableHead className="text-right">
                                        Acciones
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {popularVehicles.map((vehicle, index) => (
                                    <TableRow key={vehicle.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                                                    <Car className="h-4 w-4 text-gray-600" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">
                                                        {vehicle.model}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                        #{index + 1} en ranking
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getCategoryBadge(vehicle.category)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">
                                                {vehicle.consultations}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">
                                                {vehicle.testDrives}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">
                                                {vehicle.quotes}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium text-green-600">
                                                {vehicle.purchases}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getRatingStars(vehicle.avgRating)}
                                        </TableCell>
                                        <TableCell>
                                            {getPopularityBar(
                                                vehicle.popularity
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {getTrendIcon(vehicle.trend)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <span className="sr-only">
                                                            Abrir menú
                                                        </span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>
                                                        Acciones
                                                    </DropdownMenuLabel>
                                                    <DropdownMenuItem>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Ver detalles
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <TrendingUp className="mr-2 h-4 w-4" />
                                                        Análisis de tendencias
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <MessageSquare className="mr-2 h-4 w-4" />
                                                        Ver consultas
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>
                                                        <Calendar className="mr-2 h-4 w-4" />
                                                        Programar promoción
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
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
