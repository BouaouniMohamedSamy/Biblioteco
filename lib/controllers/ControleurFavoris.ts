/**
 * Contrôleur des favoris
 * Orchestre les opérations sur les favoris selon le diagramme de classes
 * Architecture: Contrôleur → Service → Entités
 */

import { FavoriteService } from "@/lib/services/favorite.service"
import { WorkService } from "@/lib/services/work.service"
import type { Utilisateur } from "@/lib/entities/Utilisateur"
import type { Oeuvre } from "@/lib/entities/Oeuvre"

export class ControleurFavoris {
  private favoriteService: FavoriteService
  private workService: WorkService

  constructor() {
    this.favoriteService = new FavoriteService()
    this.workService = new WorkService()
  }

  /**
   * Ajouter une œuvre aux favoris
   * Méthode principale du scénario "mettre l'œuvre en favoris"
   */
  async ajouterAuxFavoris(utilisateur: Utilisateur, oeuvre: Oeuvre): Promise<{ success: boolean; message: string }> {
    try {
      // Vérifier que l'utilisateur peut ajouter aux favoris (authentifié)
      if (!utilisateur.getId()) {
        return {
          success: false,
          message: "Vous devez être connecté pour ajouter aux favoris",
        }
      }

      // Vérifier que l'œuvre est disponible
      if (!oeuvre.estDisponible()) {
        return {
          success: false,
          message: "Cette œuvre n'est pas disponible",
        }
      }

      // Vérifier si déjà en favoris
      const dejaDansFavoris = await this.favoriteService.isFavorite(utilisateur.getId(), oeuvre.getId())

      if (dejaDansFavoris) {
        return {
          success: false,
          message: "Cette œuvre est déjà dans vos favoris",
        }
      }

      // Ajouter aux favoris
      const favori = await this.favoriteService.addFavorite(utilisateur.getId(), oeuvre.getId())

      if (!favori) {
        return {
          success: false,
          message: "Erreur lors de l'ajout aux favoris",
        }
      }

      return {
        success: true,
        message: "Œuvre ajoutée aux favoris avec succès",
      }
    } catch (error) {
      console.error("Erreur dans ajouterAuxFavoris:", error)
      return {
        success: false,
        message: "Une erreur est survenue",
      }
    }
  }

  /**
   * Retirer une œuvre des favoris
   */
  async retirerDesFavoris(utilisateur: Utilisateur, oeuvre: Oeuvre): Promise<{ success: boolean; message: string }> {
    try {
      const success = await this.favoriteService.removeFavorite(utilisateur.getId(), oeuvre.getId())

      if (success) {
        return {
          success: true,
          message: "Œuvre retirée des favoris",
        }
      }

      return {
        success: false,
        message: "Erreur lors du retrait des favoris",
      }
    } catch (error) {
      console.error("Erreur dans retirerDesFavoris:", error)
      return {
        success: false,
        message: "Une erreur est survenue",
      }
    }
  }

  /**
   * Vérifier si une œuvre est dans les favoris
   */
  async verifierSiDansFavoris(utilisateur: Utilisateur, oeuvre: Oeuvre): Promise<boolean> {
    return await this.favoriteService.isFavorite(utilisateur.getId(), oeuvre.getId())
  }

  /**
   * Récupérer la liste des favoris d'un utilisateur
   */
  async obtenirListeFavoris(utilisateur: Utilisateur): Promise<Oeuvre[]> {
    const favorisAvecOeuvres = await this.favoriteService.getUserFavorites(utilisateur.getId())
    return favorisAvecOeuvres.map((item) => item.oeuvre).filter((oeuvre): oeuvre is Oeuvre => oeuvre !== null)
  }

  /**
   * Basculer le statut favori (toggle)
   */
  async basculerFavori(
    utilisateur: Utilisateur,
    oeuvre: Oeuvre,
  ): Promise<{ success: boolean; message: string; isFavorite: boolean }> {
    try {
      const dejaDansFavoris = await this.favoriteService.isFavorite(utilisateur.getId(), oeuvre.getId())

      if (dejaDansFavoris) {
        const result = await this.retirerDesFavoris(utilisateur, oeuvre)
        return {
          ...result,
          isFavorite: false,
        }
      } else {
        const result = await this.ajouterAuxFavoris(utilisateur, oeuvre)
        return {
          ...result,
          isFavorite: true,
        }
      }
    } catch (error) {
      console.error("Erreur dans basculerFavori:", error)
      return {
        success: false,
        message: "Une erreur est survenue",
        isFavorite: false,
      }
    }
  }
}

export const controleurFavoris = new ControleurFavoris()
