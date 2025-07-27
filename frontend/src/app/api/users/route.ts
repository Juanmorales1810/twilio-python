import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
    try {
        const db = await getDatabase();

        // Obtener usuarios de la colección user_data
        const users = await db.collection("user_data").find({}).toArray();

        console.log(`Found ${users.length} users in toyota_sanjuan database`);

        // Transformar los datos para el frontend
        const transformedUsers = users.map((user) => ({
            _id: user._id.toString(),
            phone_number: user.phone_number,
            name: user.name || `Usuario ${user.phone_number}`,
            email: user.email || "",
            current_step: user.current_step || "inicio",
            conversation_state: user.conversation_state || "in_progress",
            conversation_data: user.conversation_data || {},
            messages: user.messages || [],
            created_at: user.created_at || new Date().toISOString(),
            updated_at: user.updated_at || new Date().toISOString(),
        }));

        return NextResponse.json({
            success: true,
            users: transformedUsers,
            total: transformedUsers.length,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch users" },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { userId, ...updateData } = await request.json();

        const db = await getDatabase();

        const result = await db
            .collection("user_data")
            .updateOne(
                { _id: new ObjectId(userId) },
                { $set: { ...updateData, updated_at: new Date() } }
            );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "User updated successfully",
        });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update user" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { userId } = await request.json();

        const db = await getDatabase();

        const result = await db.collection("user_data").deleteOne({
            _id: new ObjectId(userId),
        });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete user" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const db = await getDatabase();

        const newUser = {
            ...body,
            created_at: new Date(),
            updated_at: new Date(),
        };

        const result = await db.collection("user_data").insertOne(newUser);

        return NextResponse.json(
            {
                success: true,
                user: { ...newUser, _id: result.insertedId.toString() },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create user" },
            { status: 500 }
        );
    }
}
