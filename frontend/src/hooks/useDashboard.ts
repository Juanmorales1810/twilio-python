import { useState, useEffect } from "react";
import {
    DashboardData,
    DashboardStats,
    RecentActivity,
    VehiclePopularity,
} from "@/types/dashboard";

export function useDashboardData() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/dashboard");

            if (!response.ok) {
                throw new Error("Failed to fetch dashboard data");
            }

            const dashboardData = await response.json();
            setData(dashboardData);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
            console.error("Error fetching dashboard data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return { data, loading, error, refetch: fetchData };
}

export function useDashboardStats() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/dashboard/stats");

            if (!response.ok) {
                throw new Error("Failed to fetch dashboard stats");
            }

            const statsData = await response.json();
            setStats(statsData);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
            console.error("Error fetching dashboard stats:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return { stats, loading, error, refetch: fetchStats };
}

export function useRecentActivity() {
    const [activity, setActivity] = useState<RecentActivity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchActivity = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/dashboard/activity");

            if (!response.ok) {
                throw new Error("Failed to fetch recent activity");
            }

            const activityData = await response.json();
            setActivity(activityData);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
            console.error("Error fetching recent activity:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivity();
    }, []);

    return { activity, loading, error, refetch: fetchActivity };
}

export function usePopularVehicles() {
    const [vehicles, setVehicles] = useState<VehiclePopularity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchVehicles = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/dashboard/vehicles");

            if (!response.ok) {
                throw new Error("Failed to fetch popular vehicles");
            }

            const vehiclesData = await response.json();
            setVehicles(vehiclesData);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
            console.error("Error fetching popular vehicles:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    return { vehicles, loading, error, refetch: fetchVehicles };
}
