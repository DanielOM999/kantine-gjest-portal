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
    // First parse URL parameters from request URL
    const url = new URL(request.url)
    const searchParams = new URLSearchParams(url.search)
    
    // Get parameters from BOTH URL and form data
    const formData = await request.formData()
    
    // Extract parameters from URL
    const clientMac = searchParams.get('client_mac')
    const gateway = searchParams.get('gateway')
    const authToken = searchParams.get('auth_token')
    const redir = searchParams.get('redir')

    // Extract form data
    const name = formData.get("name")?.toString().trim() || ''
    const rawPhone = formData.get("phone")?.toString() || ''

    // Validate parameters
    if (!clientMac || !gateway || !authToken) {
      console.error('Missing parameters:', { clientMac, gateway, authToken })
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

    // ... existing database code ...

    // Construct final redirect URL
    const ndsAuthUrl = new URL(
      "/nds/auth",
      gateway.startsWith('http') ? gateway : `http://${gateway}`
    )
    
    ndsAuthUrl.searchParams.append('token', authToken)
    ndsAuthUrl.searchParams.append('client_mac', clientMac)
    if (redir) ndsAuthUrl.searchParams.append('redir', redir)

    return NextResponse.redirect(ndsAuthUrl.toString())

  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Det oppstod en feil ved registrering" },
      { status: 500 }
    )
  }
}