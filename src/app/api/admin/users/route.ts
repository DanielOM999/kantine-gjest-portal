import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { db } from "@/src/lib/db"

export async function GET() {
  try {
    // Correct cookie access (synchronous)
    const cookieStore = cookies()
    const adminSession = (await cookieStore).get("admin_session")

    if (!adminSession || adminSession.value !== "true") {
      return NextResponse.json({ error: "Uautorisert" }, { status: 401 })
    }

    const result = await db.query(
      "SELECT id, name, phone, is_connected, ip_address, created_at FROM users ORDER BY created_at DESC",
    )

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Det oppstod en feil ved henting av brukerdata" }, { status: 500 })
  }
}