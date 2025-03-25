"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Label } from "@/src/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AdminLogin() {
  const [key, setKey] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key }),
      })

      if (response.ok) {
        router.push("/admin/dashboard")
      } else {
        setError("Ugyldig nøkkel. Vennligst prøv igjen.")
      }
    } catch {
      setError("Det oppstod en feil. Vennligst prøv igjen senere.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl bg-white">
        <CardHeader className="space-y-1">
          <Link 
            href="/" 
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Tilbake til hovedsiden
          </Link>
          <CardTitle className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
            Admin Innlogging
          </CardTitle>
          <CardDescription className="text-gray-600 text-center">
            Skriv inn administratornøkkelen for å få tilgang til dashbordet
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="key" className="text-gray-700 font-medium">
                Administratornøkkel
              </Label>
              <Input
                id="key"
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Skriv inn nøkkel"
                className="bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 h-12 text-black rounded-lg"
                required
              />
              {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Logg inn
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}