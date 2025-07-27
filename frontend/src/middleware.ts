import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    console.log("Middleware called for:", request.nextUrl.pathname);

    // Solo aplicar middleware a rutas de admin (excepto login)
    if (
        request.nextUrl.pathname.startsWith("/admin") &&
        request.nextUrl.pathname !== "/admin/login"
    ) {
        const token = request.cookies.get("auth-token")?.value;
        console.log("Token in middleware:", token ? "Found" : "Not found");

        if (!token) {
            console.log("No token found, redirecting to login");
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }

        console.log("Token found, allowing access");
        return NextResponse.next();
    }

    console.log("Non-admin route, allowing access");
    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
