"use client"

import { useEffect, useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { LogOut, RefreshCw, Trash2 } from "lucide-react"

interface User {
  id: number
  name: string
  phone: string
  is_connected: boolean
  ip_address: string | null
  created_at: string
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/users")

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/admin")
          return
        }
        throw new Error("Kunne ikke hente brukerdata")
      }

      const data = await response.json()
      setUsers(data)
      setError("")
    } catch {
      setError("Det oppstod en feil ved henting av brukerdata")
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Er du sikker på at du vil slette denne brukeren?")) return
    
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Kunne ikke slette bruker")
      
      setUsers(prev => prev.filter(user => user.id !== userId))
    } catch (error) {
      console.error("Delete error:", error)
      setError("Det oppstod en feil ved sletting av bruker")
    }
  }

  const formatNorwegianDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("no-NO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin")
  }

  useEffect(() => {
    fetchUsers()
    const interval = setInterval(fetchUsers, 30000)
    return () => clearInterval(interval)
  }, [fetchUsers])

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 text-black">
      <Card className="max-w-6xl mx-auto shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between bg-gray-100 px-6 py-4">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </CardTitle>
            <CardDescription className="text-gray-600">
              Oversikt over brukere tilkoblet skolekantinens nettverk
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchUsers}
              disabled={loading}
              className="bg-gray-400 hover:bg-gray-300 cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Oppdater
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="bg-red-400 hover:bg-red-300 cursor-pointer"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logg ut
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && <div className="bg-red-50 text-red-500 p-4 rounded-md mb-4">{error}</div>}

          <div className="rounded-lg border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Handlinger</TableHead>
                  <TableHead>Navn</TableHead>
                  <TableHead>Telefonnummer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>IP-adresse</TableHead>
                  <TableHead>Registrert</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      {loading ? "Laster brukerdata..." : "Ingen brukere funnet"}
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-800 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.is_connected ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.is_connected ? "Tilkoblet" : "Frakoblet"}
                        </span>
                      </TableCell>
                      <TableCell>{user.ip_address || "-"}</TableCell>
                      <TableCell>{formatNorwegianDate(user.created_at)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}