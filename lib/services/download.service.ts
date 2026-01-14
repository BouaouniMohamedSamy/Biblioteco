/**
 * Service de gestion des téléchargements
 * Pattern: Service Layer (Architecture orientée objet)
 */

import { createClient } from "@/lib/supabase/client"
import type { Download } from "@/lib/types/database"

export class DownloadService {
  private supabase = getSupabaseBrowserClient()

  /**
   * Enregistrer un téléchargement
   */
  async recordDownload(workId: string, userId: string | null = null): Promise<Download> {
    const { data, error } = await this.supabase
      .from("downloads")
      .insert({
        work_id: workId,
        user_id: userId,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  /**
   * Récupérer l'historique des téléchargements d'un utilisateur
   */
  async getUserDownloads(userId: string) {
    const { data, error } = await this.supabase
      .from("downloads")
      .select(`
        *,
        work:works(*)
      `)
      .eq("user_id", userId)
      .order("downloaded_at", { ascending: false })

    if (error) throw error
    return data
  }
}

export const downloadService = new DownloadService()
