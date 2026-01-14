export interface FavoriData {
  idFavori: string
  utilisateur: string
  oeuvre: string
  dateAjout: string
}

export class Favori {
  private idFavori: string
  private utilisateur: string
  private oeuvre: string
  private dateAjout: Date

  constructor(data: FavoriData) {
    this.idFavori = data.idFavori
    this.utilisateur = data.utilisateur
    this.oeuvre = data.oeuvre
    this.dateAjout = new Date(data.dateAjout)
  }

  public getId(): string {
    return this.idFavori
  }

  public getUtilisateur(): string {
    return this.utilisateur
  }

  public getOeuvre(): string {
    return this.oeuvre
  }

  public getDateAjout(): Date {
    return this.dateAjout
  }

  // Méthodes métier
  public estPourUtilisateur(userId: string): boolean {
    return this.utilisateur === userId
  }

  public estPourOeuvre(workId: string): boolean {
    return this.oeuvre === workId
  }

  public toJSON() {
    return {
      idFavori: this.idFavori,
      utilisateur: this.utilisateur,
      oeuvre: this.oeuvre,
      dateAjout: this.dateAjout.toISOString(),
    }
  }

  public static fromDatabase(dbFavorite: any): Favori {
    return new Favori({
      idFavori: dbFavorite.id,
      utilisateur: dbFavorite.user_id,
      oeuvre: dbFavorite.work_id,
      dateAjout: dbFavorite.created_at,
    })
  }

  public toDatabase() {
    return {
      id: this.idFavori,
      user_id: this.utilisateur,
      work_id: this.oeuvre,
      created_at: this.dateAjout.toISOString(),
    }
  }
}
