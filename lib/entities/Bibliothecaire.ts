/**
 * Classe Bibliothecaire - Hérite de Utilisateur
 * Représente un utilisateur avec privilèges de modération
 */

import { Utilisateur, type UtilisateurData } from "./Utilisateur"

export interface BibliothecaireData extends UtilisateurData {
  dateNomination: string
}

export class Bibliothecaire extends Utilisateur {
  private dateNomination: Date

  constructor(data: BibliothecaireData) {
    super(data)
    this.dateNomination = new Date(data.dateNomination)
  }

  public getDateNomination(): Date {
    return this.dateNomination
  }

  // Méthodes spécifiques au bibliothécaire
  public peutApprouverOeuvre(): boolean {
    return true
  }

  public peutRejeterOeuvre(): boolean {
    return true
  }

  public peutGererUtilisateurs(): boolean {
    return true
  }

  public override toJSON() {
    return {
      ...super.toJSON(),
      dateNomination: this.dateNomination.toISOString(),
    }
  }
}
