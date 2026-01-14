/**
 * Service de gestion des œuvres
 * Gère les opérations CRUD sur les œuvres
 * Pattern: Service Layer (Architecture orientée objet)
 */

import { createClient } from "@/lib/supabase/client"
import { Oeuvre } from "@/lib/entities/Oeuvre"
import type { WorkType } from "@/lib/types/database"

export interface CreateWorkData {
  title: string
  author: string
  description?: string
  type: WorkType
  cover_url?: string
  file_url?: string
  file_size?: number
  isbn?: string
  publication_year?: number
  publisher?: string
  category_ids?: string[]
}

export interface UpdateWorkData extends Partial<CreateWorkData> {
  status?: string
  rejection_reason?: string
}

export class WorkService {
  private supabase = createClient()

  /**
   * Récupération de toutes les œuvres approuvées (catalogue public)
   */
  async getApprovedWorks(filters?: {
    type?: WorkType
    category_id?: string
    search?: string
  }): Promise<Oeuvre[]> {
    let query = this.supabase
      .from("works")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false })

    if (filters?.type) {
      query = query.eq("type", filters.type)
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,author.ilike.%${filters.search}%`)
    }

    const { data, error } = await query

    if (error) throw error

    return (data || []).map((dbWork) => Oeuvre.fromDatabase(dbWork))
  }

  /**
   * Récupération d'une œuvre par ID
   */
  async getWorkById(id: string): Promise<Oeuvre | null> {
    const { data, error } = await this.supabase.from("works").select("*").eq("id", id).single()

    if (error) throw error

    return data ? Oeuvre.fromDatabase(data) : null
  }

  /**
   * Récupération des catégories d'une œuvre
   */
  private async getWorkCategories(workId: string) {
    const { data, error } = await this.supabase
      .from("work_categories")
      .select("category_id, categories(*)")
      .eq("work_id", workId)

    if (error) throw error
    return data?.map((wc) => wc.categories).filter(Boolean) || []
  }

  /**
   * Création d'une œuvre (soumission par un membre)
   */
  async createWork(userId: string, workData: CreateWorkData): Promise<Oeuvre> {
    const { category_ids, ...workFields } = workData

    const { data, error } = await this.supabase
      .from("works")
      .insert({
        ...workFields,
        submitted_by: userId,
        status: "pending",
      })
      .select()
      .single()

    if (error) throw error

    // Associer les catégories
    if (category_ids && category_ids.length > 0) {
      await this.updateWorkCategories(data.id, category_ids)
    }

    return Oeuvre.fromDatabase(data)
  }

  /**
   * Mise à jour d'une œuvre
   */
  async updateWork(workId: string, updates: UpdateWorkData): Promise<Oeuvre> {
    const { category_ids, ...workFields } = updates

    const { data, error } = await this.supabase.from("works").update(workFields).eq("id", workId).select().single()

    if (error) throw error

    // Mise à jour des catégories si nécessaire
    if (category_ids !== undefined) {
      await this.updateWorkCategories(workId, category_ids)
    }

    return Oeuvre.fromDatabase(data)
  }

  /**
   * Mise à jour des catégories d'une œuvre
   */
  private async updateWorkCategories(workId: string, categoryIds: string[]) {
    // Supprimer les anciennes associations
    await this.supabase.from("work_categories").delete().eq("work_id", workId)

    // Créer les nouvelles associations
    if (categoryIds.length > 0) {
      const { error } = await this.supabase.from("work_categories").insert(
        categoryIds.map((categoryId) => ({
          work_id: workId,
          category_id: categoryId,
        })),
      )

      if (error) throw error
    }
  }

  /**
   * Approbation d'une œuvre (bibliothécaire)
   */
  async approveWork(workId: string, librarianId: string): Promise<Oeuvre> {
    const oeuvre = await this.getWorkById(workId)
    if (!oeuvre) throw new Error("Œuvre non trouvée")

    oeuvre.valider(librarianId)

    const dbData = oeuvre.toDatabase()
    const { data, error } = await this.supabase.from("works").update(dbData).eq("id", workId).select().single()

    if (error) throw error

    return Oeuvre.fromDatabase(data)
  }

  /**
   * Rejet d'une œuvre (bibliothécaire)
   */
  async rejectWork(workId: string, reason: string): Promise<Oeuvre> {
    const oeuvre = await this.getWorkById(workId)
    if (!oeuvre) throw new Error("Œuvre non trouvée")

    oeuvre.rejeter(reason)

    const dbData = oeuvre.toDatabase()
    const { data, error } = await this.supabase.from("works").update(dbData).eq("id", workId).select().single()

    if (error) throw error

    return Oeuvre.fromDatabase(data)
  }

  /**
   * Récupération des œuvres en attente de modération
   */
  async getPendingWorks(): Promise<Oeuvre[]> {
    const { data, error } = await this.supabase
      .from("works")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true })

    if (error) throw error

    const worksWithCategories = await Promise.all(
      (data || []).map(async (work) => {
        const categories = await this.getWorkCategories(work.id)
        return { ...work, categories }
      }),
    )

    return worksWithCategories.map((dbWork) => Oeuvre.fromDatabase(dbWork))
  }

  /**
   * Récupération des œuvres soumises par un utilisateur
   */
  async getUserWorks(userId: string): Promise<Oeuvre[]> {
    const { data, error } = await this.supabase
      .from("works")
      .select("*")
      .eq("submitted_by", userId)
      .order("created_at", { ascending: false })

    if (error) throw error

    const worksWithCategories = await Promise.all(
      (data || []).map(async (work) => {
        const categories = await this.getWorkCategories(work.id)
        return { ...work, categories }
      }),
    )

    return worksWithCategories.map((dbWork) => Oeuvre.fromDatabase(dbWork))
  }

  /**
   * Incrémenter le compteur de vues
   */
  async incrementViews(workId: string) {
    const oeuvre = await this.getWorkById(workId)
    if (!oeuvre) return

    oeuvre.incrementerVues()

    // Persister
    const { error } = await this.supabase.rpc("increment_views", { work_id: workId })
    if (error) console.error("Error incrementing views:", error)
  }

  /**
   * Incrémenter le compteur de téléchargements
   */
  async incrementDownloads(workId: string) {
    const oeuvre = await this.getWorkById(workId)
    if (!oeuvre) return

    oeuvre.incrementerTelechargements()

    // Persister
    const { error } = await this.supabase.rpc("increment_downloads", { work_id: workId })
    if (error) console.error("Error incrementing downloads:", error)
  }
}

export const workService = new WorkService()
