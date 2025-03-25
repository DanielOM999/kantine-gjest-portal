import { NextResponse } from "next/server"

export async function POST() {
  try {
    const response = NextResponse.json({ success: true })
    
    response.cookies.set("admin_session", "", {
      httpOnly: true,
      secure: false,
      maxAge: 0,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json(
      { error: "Det oppstod en feil ved utlogging" },
      { status: 500 }
    )
  }
}