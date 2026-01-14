"use client"

import { useEffect, useState } from "react"
import { favoriteService } from "@/lib/services/favorite.service"
import type { Favori } from "@/lib/entities/Favori"
import type { Oeuvre } from "@/lib/entities/Oeuvre"
import { WorkCard } from "@/components/catalog/work-card"
import { Loader2 } from "lucide-react"

interface FavoritesListProps {
  userId: string
}

export function FavoritesList({ userId }: FavoritesListProps) {
  const [favorites, setFavorites] = useState<Array<{ favori: Favori; oeuvre: Oeuvre | null }>>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadFavorites()
  }, [userId])

  const loadFavorites = async () => {
    try {
      setIsLoading(true)
      const data = await favoriteService.getUserFavorites(userId)
      setFavorites(data)
    } catch (error) {
      console.error("Error loading favorites:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Vous n'avez pas encore de favoris</p>
        <p className="text-sm text-muted-foreground mt-2">
          Explorez le catalogue et ajoutez des œuvres à vos favoris en cliquant sur le cœur
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {favorites.map(({ favori, oeuvre }) => {
        if (!oeuvre) return null

        const workData = oeuvre.toWorkWithCategories()
        return <WorkCard key={favori.getId()} work={workData} />
      })}
    </div>
  )
}
