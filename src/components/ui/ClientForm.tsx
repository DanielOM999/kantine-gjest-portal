"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import Image from "next/image";

export default function ClientForm({
  clientMac,
  gateway,
  authToken,
  redir,
}: {
  clientMac: string;
  gateway: string;
  authToken: string;
  redir: string;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-xl bg-white">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="w-60 h-20 relative mb-4">
            <Image
              src="/img/logo.png"
              alt="Skole Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900 uppercase tracking-wide">
            Gjestenett
          </CardTitle>
          <CardDescription className="text-gray-600 text-center">
            Registrer deg for å få tilgang til Åssiden kantine sitt nettverk
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action="/api/register" method="POST" className="space-y-6">
            {/* Hidden FAS parameters */}
            <input type="hidden" name="client_mac" value={clientMac} />
            <input type="hidden" name="gateway" value={gateway} />
            <input type="hidden" name="auth_token" value={authToken} />
            <input type="hidden" name="redir" value={redir} />

            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium">
                Navn
              </Label>
              <Input
                className="bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-black rounded-lg"
                id="name"
                name="name"
                placeholder="Skriv inn ditt navn"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-700 font-medium">
                Telefonnummer
              </Label>
              <Input
                id="phone"
                className="bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-black rounded-lg"
                name="phone"
                placeholder="Skriv inn ditt telefonnummer"
                type="tel"
                pattern="[0-9]{8}"
                title="Vennligst skriv inn et gyldig 8-sifret telefonnummer"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Koble til nettverk
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2 text-sm text-gray-500">
          <p>Ved å registrere deg godtar du våre vilkår for bruk</p>
        </CardFooter>
      </Card>
    </div>
  );
}