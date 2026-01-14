/**
 * Contrôleur de modération
 * Orchestre le processus de modération des œuvres soumises
 * Architecture: Contrôleur → Service → Entités
 */

import { WorkService } from "@/lib/services/work.service"
import type { Bibliothecaire } from "@/lib/entities/Bibliothecaire"
import type { Oeuvre } from "@/lib/entities/Oeuvre"

export interface ProcessusModeration {
  idModeration: number
  dateDepot: Date
  resultat: "EnAttente" | "Approuve" | "Rejete"
  dateTraitement: Date | null
}

export class ControleurModeration {
  private workService: WorkService

  constructor() {
    this.workService = new WorkService()
  }

  /**
   * Approuver une œuvre
   * Méthode du scénario "proposer une œuvre" - validation par bibliothécaire
   */
  async approuverOeuvre(
    bibliothecaire: Bibliothecaire,
    oeuvreId: string,
  ): Promise<{ success: boolean; message: string; oeuvre?: Oeuvre }> {
    try {
      // Vérifier les permissions du bibliothécaire
      if (!bibliothecaire.peutApprouverOeuvre()) {
        return {
          success: false,
          message: "Vous n'avez pas les permissions nécessaires",
        }
      }

      // Récupérer l'œuvre
      const oeuvre = await this.workService.getWorkById(oeuvreId)

      if (!oeuvre) {
        return {
          success: false,
          message: "Œuvre non trouvée",
        }
      }

      // Vérifier que l'œuvre est en modération
      if (!oeuvre.estEnModeration()) {
        return {
          success: false,
          message: "Cette œuvre n'est pas en modération",
        }
      }

      // Valider l'œuvre (utilise la méthode métier de la classe Oeuvre)
      const oeuvreApprouvee = await this.workService.approveWork(oeuvreId, bibliothecaire.getId())

      return {
        success: true,
        message: "Œuvre approuvée avec succès",
        oeuvre: oeuvreApprouvee,
      }
    } catch (error) {
      console.error("Erreur dans approuverOeuvre:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Une erreur est survenue",
      }
    }
  }

  /**
   * Rejeter une œuvre
   */
  async rejeterOeuvre(
    bibliothecaire: Bibliothecaire,
    oeuvreId: string,
    raison: string,
  ): Promise<{ success: boolean; message: string; oeuvre?: Oeuvre }> {
    try {
      // Vérifier les permissions
      if (!bibliothecaire.peutRejeterOeuvre()) {
        return {
          success: false,
          message: "Vous n'avez pas les permissions nécessaires",
        }
      }

      // Valider la raison
      if (!raison || raison.trim().length < 10) {
        return {
          success: false,
          message: "La raison du rejet doit contenir au moins 10 caractères",
        }
      }

      // Récupérer l'œuvre
      const oeuvre = await this.workService.getWorkById(oeuvreId)

      if (!oeuvre) {
        return {
          success: false,
          message: "Œuvre non trouvée",
        }
      }

      // Vérifier que l'œuvre est en modération
      if (!oeuvre.estEnModeration()) {
        return {
          success: false,
          message: "Cette œuvre n'est pas en modération",
        }
      }

      // Rejeter l'œuvre (utilise la méthode métier de la classe Oeuvre)
      const oeuvreRejetee = await this.workService.rejectWork(oeuvreId, raison)

      return {
        success: true,
        message: "Œuvre rejetée",
        oeuvre: oeuvreRejetee,
      }
    } catch (error) {
      console.error("Erreur dans rejeterOeuvre:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Une erreur est survenue",
      }
    }
  }

  /**
   * Récupérer la liste des œuvres en attente de modération
   */
  async obtenirOeuvresEnAttente(): Promise<Oeuvre[]> {
    return await this.workService.getPendingWorks()
  }

  /**
   * Créer un rapport de processus de modération
   */
  async creerProcessusModeration(oeuvre: Oeuvre): Promise<ProcessusModeration> {
    return {
      idModeration: Date.now(),
      dateDepot: new Date(),
      resultat: oeuvre.estEnModeration() ? "EnAttente" : oeuvre.estDisponible() ? "Approuve" : "Rejete",
      dateTraitement: oeuvre.estEnModeration() ? null : new Date(),
    }
  }
}

export const controleurModeration = new ControleurModeration()
