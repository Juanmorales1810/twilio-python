import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
    try {
        const db = await getDatabase();

        // Obtener citas de la colección appointments
        const appointments = await db
            .collection("appointments")
            .find({})
            .toArray();

        console.log(
            `Found ${appointments.length} appointments in toyota_sanjuan database`
        );

        // Transformar los datos para el frontend
        const transformedAppointments = appointments.map((appointment) => ({
            _id: appointment._id.toString(),
            user_id: appointment.user_id?.toString() || "",
            phone_number: appointment.phone_number,
            customer_name: appointment.customer_name || "Cliente sin nombre",
            customer_email:
                appointment.customer_email || appointment.email || "",
            preferred_date:
                appointment.preferred_date || appointment.appointment_date,
            preferred_time:
                appointment.preferred_time || appointment.appointment_time,
            vehicle_interest: appointment.vehicle_interest || "No especificado",
            status: appointment.status || "pendiente",
            created_at: appointment.created_at || new Date().toISOString(),
            updated_at: appointment.updated_at || new Date().toISOString(),
        }));

        return NextResponse.json({
            success: true,
            appointments: transformedAppointments,
            total: transformedAppointments.length,
        });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch appointments" },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { appointmentId, ...updateData } = await request.json();

        const db = await getDatabase();

        const result = await db
            .collection("appointments")
            .updateOne(
                { _id: new ObjectId(appointmentId) },
                { $set: { ...updateData, updated_at: new Date() } }
            );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { success: false, error: "Appointment not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Appointment updated successfully",
        });
    } catch (error) {
        console.error("Error updating appointment:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update appointment" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { appointmentId } = await request.json();

        const db = await getDatabase();

        const result = await db.collection("appointments").deleteOne({
            _id: new ObjectId(appointmentId),
        });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { success: false, error: "Appointment not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Appointment deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting appointment:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete appointment" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const db = await getDatabase();

        const newAppointment = {
            ...body,
            status: body.status || "pendiente",
            created_at: new Date(),
            updated_at: new Date(),
        };

        const result = await db
            .collection("appointments")
            .insertOne(newAppointment);

        return NextResponse.json(
            {
                success: true,
                appointment: {
                    ...newAppointment,
                    _id: result.insertedId.toString(),
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating appointment:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create appointment" },
            { status: 500 }
        );
    }
}
