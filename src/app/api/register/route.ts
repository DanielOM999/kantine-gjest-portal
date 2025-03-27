import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/src/lib/db"

const getClientIp = (request: NextRequest): string => {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    const ips = forwardedFor.split(',').map(ip => ip.trim())
    return ips[0] || 'unknown'
  }
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
    
    // Extract ALL required parameters
    const name = formData.get("name")?.toString().trim() || ''
    const rawPhone = formData.get("phone")?.toString() || ''
    const clientMac = formData.get("client_mac")?.toString()
    const gateway = formData.get("gateway")?.toString()
    const authToken = formData.get("auth_token")?.toString()
    const redir = formData.get("redir")?.toString()

    // Validate NDS parameters
    if (!clientMac || !gateway || !authToken) {
      return NextResponse.json(
        { error: "Mangler autentiseringsparametre" },
        { status: 400 }
      )
    }

    // Validate user inputs
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
    const ip = getClientIp(request)
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

    // Construct NDS authentication URL
    const ndsAuthUrl = new URL(
      "/nds/auth",
      gateway.startsWith('http') ? gateway : `http://${gateway}`
    )
    
    ndsAuthUrl.searchParams.append('token', authToken)
    ndsAuthUrl.searchParams.append('client_mac', clientMac)
    if (redir) ndsAuthUrl.searchParams.append('redir', redir)

    // Redirect to Nodogsplash to complete authentication
    return NextResponse.redirect(ndsAuthUrl.toString())

  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Det oppstod en feil ved registrering" },
      { status: 500 }
    )
  }
}