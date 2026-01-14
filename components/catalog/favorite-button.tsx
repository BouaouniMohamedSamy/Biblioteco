"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { favoriteService } from "@/lib/services/favorite.service"
import { createClient } from "@/lib/supabase/client"

interface FavoriteButtonProps {
  workId: string
  initialIsFavorite?: boolean
  variant?: "default" | "ghost" | "outline"
  size?: "default" | "sm" | "lg" | "icon"
  showLabel?: boolean
}

export function FavoriteButton({
  workId,
  initialIsFavorite = false,
  variant = "ghost",
  size = "icon",
  showLabel = false,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const handleToggleFavorite = async () => {
    try {
      setIsLoading(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Authentification requise",
          description: "Vous devez être connecté pour ajouter des favoris",
          variant: "destructive",
        })
        return
      }

      const success = await favoriteService.toggleFavorite(user.id, workId)

      if (success) {
        setIsFavorite(!isFavorite)
        toast({
          title: isFavorite ? "Retiré des favoris" : "Ajouté aux favoris",
          description: isFavorite ? "L'œuvre a été retirée de vos favoris" : "L'œuvre a été ajoutée à vos favoris",
        })
      } else {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button variant={variant} size={size} onClick={handleToggleFavorite} disabled={isLoading}>
      <Heart
        className={`h-4 w-4 transition-colors ${
          isFavorite ? "fill-red-500 text-red-500" : "fill-transparent text-muted-foreground hover:text-red-500"
        }`}
      />
      {showLabel && <span className="ml-2">{isFavorite ? "Favori" : "Ajouter aux favoris"}</span>}
    </Button>
  )
}
