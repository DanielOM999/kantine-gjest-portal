// src/app/api/admin/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/src/lib/db"
import { cookies } from "next/headers"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Resolve the params promise
    const resolvedParams = await params
    
    // Verify admin session
    const cookieStore = await cookies()
    const adminSession = cookieStore.get("admin_session")
    
    if (!adminSession || adminSession.value !== "true") {
      return NextResponse.json({ error: "Uautorisert" }, { status: 401 })
    }

    // Delete user
    const result = await db.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [resolvedParams.id]
    )

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Bruker ikke funnet" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete user error:", error)
    return NextResponse.json(
      { error: "Det oppstod en feil ved sletting" },
      { status: 500 }
    )
  }
}
