"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, BookMarked, ExternalLink } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Work } from "@/lib/types/database"
import type { User } from "@supabase/supabase-js"

interface WorkActionsProps {
  work: Work
  user: User | null
}

export function WorkActions({ work, user }: WorkActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleBorrow = async () => {
    if (!user) {
      router.push("/auth/signin?redirect=/works/" + work.id)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/borrows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workId: work.id }),
      })

      if (response.ok) {
        alert("Emprunt effectué avec succès!")
        router.refresh()
      } else {
        const data = await response.json()
        alert(data.error || "Erreur lors de l'emprunt")
      }
    } catch (error) {
      alert("Erreur lors de l'emprunt")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!work.file_url) {
      alert("Aucun fichier disponible pour cette œuvre")
      return
    }

    setIsLoading(true)
    try {
      // Enregistrer le téléchargement
      await fetch("/api/downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workId: work.id }),
      })

      // Ouvrir le fichier dans un nouvel onglet
      window.open(work.file_url, "_blank")
    } catch (error) {
      console.error("Error recording download:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="mt-6">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleBorrow} disabled={isLoading} className="flex-1">
            <BookMarked className="mr-2 h-4 w-4" />
            {user ? "Emprunter cette œuvre" : "Se connecter pour emprunter"}
          </Button>

          {work.file_url && (
            <Button onClick={handleDownload} disabled={isLoading} variant="outline" className="flex-1 bg-transparent">
              <Download className="mr-2 h-4 w-4" />
              Télécharger
            </Button>
          )}

          {work.file_url && (
            <Button asChild variant="outline">
              <a href={work.file_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Lire en ligne
              </a>
            </Button>
          )}
        </div>

        {!user && (
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Connectez-vous pour emprunter des œuvres et accéder à votre bibliothèque personnelle
          </p>
        )}
      </CardContent>
    </Card>
  )
}
