import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Check if the path is for the admin dashboard
  if (path.startsWith("/admin/dashboard")) {
    // Check if the admin is authenticated
    const adminSession = request.cookies.get("admin_session")

    if (!adminSession || adminSession.value !== "true") {
      // Redirect to the admin login page
      return NextResponse.redirect(new URL("/admin", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
}