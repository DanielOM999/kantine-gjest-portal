import { NextRequest, NextResponse } from "next/server"
import { compare } from "@/src/lib/crypto"

export async function POST(request: NextRequest) {
  try {
    // Directly access environment variable
    const ADMIN_HASH = process.env.ADMIN_HASH
    
    console.log('Environment:', {
      NODE_ENV: process.env.NODE_ENV,
      ADMIN_HASH: !!ADMIN_HASH
    })

    if (!ADMIN_HASH) {
      console.error("Missing ADMIN_HASH in environment variables")
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      )
    }

    const { key } = await request.json()

    if (!key) {
      return NextResponse.json({ error: "Nøkkel er påkrevd" }, { status: 400 })
    }

    const isValid = await compare(key, ADMIN_HASH)
    if (!isValid) {
      return NextResponse.json({ error: "Ugyldig nøkkel" }, { status: 401 })
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set("admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60,
      path: "/",
      domain: "192.168.1.3:3000",
    })

    return response
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json(
      { error: "Det oppstod en feil ved innlogging" },
      { status: 500 }
    )
  }
}