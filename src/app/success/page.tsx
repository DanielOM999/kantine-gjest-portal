import Image from "next/image"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function Success() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-300 to-blue-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-xl bg-white">

        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="w-48 h-16 relative mb-2">
            <Image src="/img/logo.png" alt="Skole Logo" fill className="object-contain" priority />
          </div>
          <CheckCircle className="h-20 w-20 text-blue-600 mb-4" />

          <CardTitle className="text-3xl font-bold text-gray-900 uppercase tracking-wide">Tilkobling Vellykket!</CardTitle>

          <CardDescription className="text-gray-600 text-center">Du er nå koblet til skolekantinens WiFi-nettverk</CardDescription>

        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-500">Du kan nå lukke dette vinduet og bruke internett</p>

        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-8 py-3 transition-colors">

            <a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
              Gå til Google
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
