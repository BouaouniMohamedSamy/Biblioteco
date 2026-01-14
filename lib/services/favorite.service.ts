/**
 * Service de gestion des favoris
 * Gère les opérations sur les favoris d'œuvres
 * Pattern: Service Layer (Architecture orientée objet)
 * Utilisation de la classe Favori au lieu d'interfaces
 */

import { createClient } from "@/lib/supabase/client"
import { Favori } from "@/lib/entities/Favori"
import { Oeuvre } from "@/lib/entities/Oeuvre"

export class FavoriteService {
  private supabase = createClient()

  /**
   * Vérifie si une œuvre est dans les favoris de l'utilisateur
   */
  async isFavorite(userId: string, workId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from("favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("work_id", workId)
      .maybeSingle()

    if (error) {
      console.error("Error checking favorite:", error)
      return false
    }

    return !!data
  }

  /**
   * Ajoute une œuvre aux favoris
   * Retourne maintenant un objet Favori
   */
  async addFavorite(userId: string, workId: string): Promise<Favori | null> {
    const { data, error } = await this.supabase
      .from("favorites")
      .insert({
        user_id: userId,
        work_id: workId,
      })
      .select()
      .single()

    if (error) {
      console.error("Error adding favorite:", error)
      return null
    }

    return Favori.fromDatabase(data)
  }

  /**
   * Retire une œuvre des favoris
   */
  async removeFavorite(userId: string, workId: string): Promise<boolean> {
    const { error } = await this.supabase.from("favorites").delete().eq("user_id", userId).eq("work_id", workId)

    if (error) {
      console.error("Error removing favorite:", error)
      return false
    }

    return true
  }

  /**
   * Récupère tous les favoris d'un utilisateur avec les détails des œuvres
   * Retourne maintenant des objets Favori avec Oeuvre
   */
  async getUserFavorites(userId: string): Promise<Array<{ favori: Favori; oeuvre: Oeuvre | null }>> {
    console.log("[v0] FavoriteService.getUserFavorites - userId:", userId)

    const { data: favorites, error: favError } = await this.supabase
      .from("favorites")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (favError) {
      console.error("[v0] Error fetching favorites:", favError)
      return []
    }

    console.log("[v0] Favorites found:", favorites?.length || 0)

    if (!favorites || favorites.length === 0) {
      return []
    }

    // Fetch works details for all favorited work IDs
    const workIds = favorites.map((f) => f.work_id)
    console.log("[v0] Fetching works for IDs:", workIds)

    const { data: works, error: worksError } = await this.supabase.from("works").select("*").in("id", workIds)

    if (worksError) {
      console.error("[v0] Error fetching works:", worksError)
      return []
    }

    console.log("[v0] Works found:", works?.length || 0)

    const worksMap = new Map(works?.map((w) => [w.id, Oeuvre.fromDatabase(w)]))

    const result = favorites.map((fav) => ({
      favori: Favori.fromDatabase(fav),
      oeuvre: worksMap.get(fav.work_id) || null,
    }))

    console.log("[v0] Returning favorites with works:", result.length)
    return result
  }

  /**
   * Compte le nombre de favoris d'un utilisateur
   */
  async countUserFavorites(userId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from("favorites")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)

    if (error) {
      console.error("Error counting favorites:", error)
      return 0
    }

    return count || 0
  }

  /**
   * Bascule le statut favori d'une œuvre (toggle)
   */
  async toggleFavorite(userId: string, workId: string): Promise<boolean> {
    const isFav = await this.isFavorite(userId, workId)

    if (isFav) {
      return await this.removeFavorite(userId, workId)
    } else {
      const result = await this.addFavorite(userId, workId)
      return !!result
    }
  }
}

export const favoriteService = new FavoriteService()
