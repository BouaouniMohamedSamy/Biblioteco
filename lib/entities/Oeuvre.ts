/**
 * Classe Oeuvre - Représente une œuvre dans la bibliothèque
 * Architecture orientée objet - Entité avec logique métier
 */

export type WorkStatus = "EnModeration" | "Validee" | "Rejetee"
export type WorkType = "book" | "article" | "thesis" | "video" | "audio" | "document"

export interface OeuvreData {
  idOeuvre: string
  titre: string
  auteur: string
  description: string | null
  type: WorkType
  cheminFichier: string | null
  metadonnees: {
    isbn?: string
    anneePublication?: number
    editeur?: string
    taillefichier?: number
    coverUrl?: string
  }
  statut: WorkStatus
  soumisePar: string
  approuvePar?: string | null
  dateApprobation?: string | null
  raisonRejet?: string | null
  compteurs: {
    vues: number
    telechargements: number
  }
  dateAjout: string
  dateModification: string
}

export class Oeuvre {
  private idOeuvre: string
  private titre: string
  private auteur: string
  private description: string | null
  private type: WorkType
  private cheminFichier: string | null
  private metadonnees: OeuvreData["metadonnees"]
  private statut: WorkStatus
  private soumisePar: string
  private approuvePar: string | null
  private dateApprobation: Date | null
  private raisonRejet: string | null
  private compteurVues: number
  private compteurTelechargements: number
  private dateAjout: Date
  private dateModification: Date

  constructor(data: OeuvreData) {
    this.idOeuvre = data.idOeuvre
    this.titre = data.titre
    this.auteur = data.auteur
    this.description = data.description
    this.type = data.type
    this.cheminFichier = data.cheminFichier
    this.metadonnees = data.metadonnees
    this.statut = data.statut
    this.soumisePar = data.soumisePar
    this.approuvePar = data.approuvePar || null
    this.dateApprobation = data.dateApprobation ? new Date(data.dateApprobation) : null
    this.raisonRejet = data.raisonRejet || null
    this.compteurVues = data.compteurs.vues
    this.compteurTelechargements = data.compteurs.telechargements
    this.dateAjout = new Date(data.dateAjout)
    this.dateModification = new Date(data.dateModification)
  }

  // Getters
  public getId(): string {
    return this.idOeuvre
  }

  public getTitre(): string {
    return this.titre
  }

  public getAuteur(): string {
    return this.auteur
  }

  public getStatut(): WorkStatus {
    return this.statut
  }

  public getMetadonnees() {
    return { ...this.metadonnees }
  }

  // Méthodes métier - Validation
  public valider(bibliothecaireId: string): void {
    if (this.statut !== "EnModeration") {
      throw new Error("Seules les œuvres en modération peuvent être validées")
    }
    this.statut = "Validee"
    this.approuvePar = bibliothecaireId
    this.dateApprobation = new Date()
    this.raisonRejet = null
    this.dateModification = new Date()
  }

  // Méthodes métier - Rejet
  public rejeter(raison: string): void {
    if (this.statut !== "EnModeration") {
      throw new Error("Seules les œuvres en modération peuvent être rejetées")
    }
    if (!raison || raison.trim().length === 0) {
      throw new Error("Une raison de rejet est obligatoire")
    }
    this.statut = "Rejetee"
    this.raisonRejet = raison
    this.dateModification = new Date()
  }

  // Méthodes métier - État
  public estDisponible(): boolean {
    return this.statut === "Validee"
  }

  public estEnModeration(): boolean {
    return this.statut === "EnModeration"
  }

  public estRejetee(): boolean {
    return this.statut === "Rejetee"
  }

  // Méthodes métier - Compteurs
  public incrementerVues(): void {
    if (this.estDisponible()) {
      this.compteurVues++
    }
  }

  public incrementerTelechargements(): void {
    if (this.estDisponible()) {
      this.compteurTelechargements++
    }
  }

  public getCompteurVues(): number {
    return this.compteurVues
  }

  public getCompteurTelechargements(): number {
    return this.compteurTelechargements
  }

  // Méthodes métier - Modification
  public modifierTitre(nouveauTitre: string): void {
    if (!nouveauTitre || nouveauTitre.trim().length === 0) {
      throw new Error("Le titre ne peut pas être vide")
    }
    this.titre = nouveauTitre
    this.dateModification = new Date()
  }

  public modifierDescription(nouvelleDescription: string): void {
    this.description = nouvelleDescription
    this.dateModification = new Date()
  }

  // Conversion pour BDD
  public toJSON() {
    return {
      idOeuvre: this.idOeuvre,
      titre: this.titre,
      auteur: this.auteur,
      description: this.description,
      type: this.type,
      cheminFichier: this.cheminFichier,
      metadonnees: this.metadonnees,
      statut: this.statut,
      soumisePar: this.soumisePar,
      approuvePar: this.approuvePar,
      dateApprobation: this.dateApprobation?.toISOString() || null,
      raisonRejet: this.raisonRejet,
      compteurs: {
        vues: this.compteurVues,
        telechargements: this.compteurTelechargements,
      },
      dateAjout: this.dateAjout.toISOString(),
      dateModification: this.dateModification.toISOString(),
    }
  }

  // Conversion depuis BDD
  public static fromDatabase(dbWork: any): Oeuvre {
    return new Oeuvre({
      idOeuvre: dbWork.id,
      titre: dbWork.title,
      auteur: dbWork.author,
      description: dbWork.description,
      type: dbWork.type,
      cheminFichier: dbWork.file_url,
      metadonnees: {
        isbn: dbWork.isbn,
        anneePublication: dbWork.publication_year,
        editeur: dbWork.publisher,
        taillefichier: dbWork.file_size,
        coverUrl: dbWork.cover_url,
      },
      statut: dbWork.status === "approved" ? "Validee" : dbWork.status === "rejected" ? "Rejetee" : "EnModeration",
      soumisePar: dbWork.submitted_by,
      approuvePar: dbWork.approved_by,
      dateApprobation: dbWork.approved_at,
      raisonRejet: dbWork.rejection_reason,
      compteurs: {
        vues: dbWork.views_count || 0,
        telechargements: dbWork.downloads_count || 0,
      },
      dateAjout: dbWork.created_at,
      dateModification: dbWork.updated_at,
    })
  }

  // Conversion vers BDD
  public toDatabase() {
    return {
      id: this.idOeuvre,
      title: this.titre,
      author: this.auteur,
      description: this.description,
      type: this.type,
      file_url: this.cheminFichier,
      isbn: this.metadonnees.isbn,
      publication_year: this.metadonnees.anneePublication,
      publisher: this.metadonnees.editeur,
      file_size: this.metadonnees.taillefichier,
      cover_url: this.metadonnees.coverUrl,
      status: this.statut === "Validee" ? "approved" : this.statut === "Rejetee" ? "rejected" : "pending",
      submitted_by: this.soumisePar,
      approved_by: this.approuvePar,
      approved_at: this.dateApprobation?.toISOString() || null,
      rejection_reason: this.raisonRejet,
      views_count: this.compteurVues,
      downloads_count: this.compteurTelechargements,
      created_at: this.dateAjout.toISOString(),
      updated_at: this.dateModification.toISOString(),
    }
  }

  public toWorkWithCategories(): any {
    return {
      id: this.idOeuvre,
      title: this.titre,
      author: this.auteur,
      description: this.description,
      type: this.type,
      cover_url: this.metadonnees.coverUrl || null,
      file_url: this.cheminFichier,
      file_size: this.metadonnees.taillefichier || null,
      isbn: this.metadonnees.isbn || null,
      publication_year: this.metadonnees.anneePublication || null,
      publisher: this.metadonnees.editeur || null,
      status: this.statut === "Validee" ? "approved" : this.statut === "Rejetee" ? "rejected" : "pending",
      submitted_by: this.soumisePar,
      approved_by: this.approuvePar,
      approved_at: this.dateApprobation?.toISOString() || null,
      rejection_reason: this.raisonRejet,
      views_count: this.compteurVues,
      downloads_count: this.compteurTelechargements,
      created_at: this.dateAjout.toISOString(),
      updated_at: this.dateModification.toISOString(),
      categories: [],
    }
  }
}
