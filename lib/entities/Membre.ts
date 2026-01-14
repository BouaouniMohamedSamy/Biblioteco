/**
 * Classe Membre - Hérite de Utilisateur
 * Représente un utilisateur qui peut soumettre des œuvres
 */

import { Utilisateur, type UtilisateurData } from "./Utilisateur"

export interface MembreData extends UtilisateurData {
  dateAdhesion: string
}

export class Membre extends Utilisateur {
  private dateAdhesion: Date

  constructor(data: MembreData) {
    super(data)
    this.dateAdhesion = new Date(data.dateAdhesion)
  }

  public getDateAdhesion(): Date {
    return this.dateAdhesion
  }

  public proposerOeuvre(): boolean {
    // Logique métier : un membre peut toujours proposer une œuvre
    return true
  }

  public demanderStatutBibliothecaire(motivation: string): boolean {
    if (!motivation || motivation.trim().length < 50) {
      throw new Error("La motivation doit contenir au moins 50 caractères")
    }
    return true
  }

  public override toJSON() {
    return {
      ...super.toJSON(),
      dateAdhesion: this.dateAdhesion.toISOString(),
    }
  }
}
