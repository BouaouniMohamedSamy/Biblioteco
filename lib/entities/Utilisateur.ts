/**
 * Classe Utilisateur - Entité de base du système
 * Architecture orientée objet - Entité avec comportements
 */

export type UserRole = "user" | "member" | "librarian"

export interface UtilisateurData {
  id: string
  nom: string
  email: string
  motDePasseHash: string
  role: UserRole
  dateCreation: string
  dateModification: string
}

export class Utilisateur {
  protected id: string
  protected nom: string
  protected email: string
  protected motDePasseHash: string
  protected role: UserRole
  protected dateCreation: Date
  protected dateModification: Date

  constructor(data: UtilisateurData) {
    this.id = data.id
    this.nom = data.nom
    this.email = data.email
    this.motDePasseHash = data.motDePasseHash
    this.role = data.role
    this.dateCreation = new Date(data.dateCreation)
    this.dateModification = new Date(data.dateModification)
  }

  // Getters
  public getId(): string {
    return this.id
  }

  public getNom(): string {
    return this.nom
  }

  public getEmail(): string {
    return this.email
  }

  public getRole(): UserRole {
    return this.role
  }

  public getDateCreation(): Date {
    return this.dateCreation
  }

  // Méthodes métier
  public estUtilisateur(): boolean {
    return this.role === "user"
  }

  public estMembre(): boolean {
    return this.role === "member"
  }

  public estBibliothecaire(): boolean {
    return this.role === "librarian"
  }

  public peutSoumettre(): boolean {
    return this.role === "member" || this.role === "librarian"
  }

  public peutModerer(): boolean {
    return this.role === "librarian"
  }

  public verifierIdentite(email: string, motDePasse: string): boolean {
    return this.email === email
    // Dans la vraie vie, on vérifierait le hash du mot de passe
  }

  // Setters avec validation
  public changerNom(nouveauNom: string): void {
    if (!nouveauNom || nouveauNom.trim().length === 0) {
      throw new Error("Le nom ne peut pas être vide")
    }
    this.nom = nouveauNom
    this.dateModification = new Date()
  }

  public toJSON() {
    return {
      id: this.id,
      nom: this.nom,
      email: this.email,
      role: this.role,
      dateCreation: this.dateCreation.toISOString(),
      dateModification: this.dateModification.toISOString(),
    }
  }
}
