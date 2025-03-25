import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/src/lib/db"

const getClientIp = (request: NextRequest): string => {
  // For reverse proxy setups
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    // Handle comma-separated list of IPs
    const ips = forwardedFor.split(',').map(ip => ip.trim())
    return ips[0] || 'unknown'
  }
  
  // Fallback to other common headers
  return request.headers.get('x-real-ip') || 
         request.headers.get('cf-connecting-ip') || 
         'unknown'
}

const validatePhoneNumber = (rawPhone: string): string | null => {
  const cleaned = rawPhone.replace(/\D/g, '')
  return cleaned.length === 8 ? cleaned : null
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const name = formData.get("name")?.toString().trim() || ''
    const rawPhone = formData.get("phone")?.toString() || ''
    const ip = getClientIp(request)

    // Validate inputs
    if (name.length < 2) {
      return NextResponse.json(
        { error: "Navn må inneholde minst 2 tegn" },
        { status: 400 }
      )
    }

    const cleanPhone = validatePhoneNumber(rawPhone)
    if (!cleanPhone) {
      return NextResponse.json(
        { error: "Vennligst skriv inn et gyldig 8-sifret norsk telefonnummer" },
        { status: 400 }
      )
    }

    // Database operations
    console.log(`New registration from ${ip}: ${name} (${cleanPhone})`)

    const existingUser = await db.query(
      "SELECT * FROM users WHERE phone = $1", 
      [cleanPhone]
    )

    if (existingUser.rows.length > 0) {
      await db.query(
        `UPDATE users 
         SET name = $1, is_connected = true, ip_address = $2, updated_at = NOW()
         WHERE phone = $3`,
        [name, ip, cleanPhone]
      )
    } else {
      await db.query(
        `INSERT INTO users 
         (name, phone, is_connected, ip_address)
         VALUES ($1, $2, true, $3)`,
        [name, cleanPhone, ip]
      )
    }

    return NextResponse.redirect(new URL("/success", request.url))
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Det oppstod en feil ved registrering" },
      { status: 500 }
    )
  }
}