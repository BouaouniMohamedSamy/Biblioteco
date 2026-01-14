/**
 * Service de gestion des emprunts
 * Pattern: Service Layer (Architecture orientée objet)
 */

import { createClient } from "@/lib/supabase/client"
import type { Borrow } from "@/lib/types/database"

export class BorrowService {
  private supabase = getSupabaseBrowserClient()

  /**
   * Créer un emprunt (durée par défaut: 14 jours)
   */
  async createBorrow(userId: string, workId: string, durationDays = 14): Promise<Borrow> {
    // Vérifier qu'il n'y a pas déjà un emprunt actif
    const { data: existingBorrow } = await this.supabase
      .from("borrows")
      .select("*")
      .eq("user_id", userId)
      .eq("work_id", workId)
      .eq("is_active", true)
      .single()

    if (existingBorrow) {
      throw new Error("Vous avez déjà emprunté cette œuvre")
    }

    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + durationDays)

    const { data, error } = await this.supabase
      .from("borrows")
      .insert({
        user_id: userId,
        work_id: workId,
        due_date: dueDate.toISOString(),
        is_active: true,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  /**
   * Retourner un emprunt
   */
  async returnBorrow(borrowId: string): Promise<Borrow> {
    const { data, error } = await this.supabase
      .from("borrows")
      .update({
        returned_at: new Date().toISOString(),
        is_active: false,
      })
      .eq("id", borrowId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  /**
   * Récupérer les emprunts d'un utilisateur
   */
  async getUserBorrows(userId: string, activeOnly = false) {
    let query = this.supabase
      .from("borrows")
      .select(`
        *,
        work:works(*)
      `)
      .eq("user_id", userId)
      .order("borrowed_at", { ascending: false })

    if (activeOnly) {
      query = query.eq("is_active", true)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  }

  /**
   * Prolonger un emprunt (ajouter 7 jours)
   */
  async extendBorrow(borrowId: string): Promise<Borrow> {
    // Récupérer l'emprunt actuel
    const { data: borrow } = await this.supabase.from("borrows").select("*").eq("id", borrowId).single()

    if (!borrow) throw new Error("Emprunt introuvable")

    const newDueDate = new Date(borrow.due_date)
    newDueDate.setDate(newDueDate.getDate() + 7)

    const { data, error } = await this.supabase
      .from("borrows")
      .update({
        due_date: newDueDate.toISOString(),
      })
      .eq("id", borrowId)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

export const borrowService = new BorrowService()
