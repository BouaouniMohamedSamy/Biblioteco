/**
 * Service de gestion des catégories
 * Pattern: Service Layer (Architecture orientée objet)
 */

import { createClient } from "@/lib/supabase/client"
import type { Category } from "@/lib/types/database"

export class CategoryService {
  private supabase = getSupabaseBrowserClient()

  /**
   * Récupération de toutes les catégories
   */
  async getAllCategories(): Promise<Category[]> {
    const { data, error } = await this.supabase.from("categories").select("*").order("name")

    if (error) throw error
    return data || []
  }

  /**
   * Récupération d'une catégorie par ID
   */
  async getCategoryById(id: string): Promise<Category | null> {
    const { data, error } = await this.supabase.from("categories").select("*").eq("id", id).single()

    if (error) throw error
    return data
  }

  /**
   * Création d'une catégorie (bibliothécaire)
   */
  async createCategory(name: string, description?: string): Promise<Category> {
    const { data, error } = await this.supabase.from("categories").insert({ name, description }).select().single()

    if (error) throw error
    return data
  }
}

export const categoryService = new CategoryService()
