import { BookOpen } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-semibold text-lg">
              <BookOpen className="h-5 w-5 text-primary" />
              <span>Biblioteco</span>
            </div>
            <p className="text-sm text-muted-foreground">Bibliothèque numérique décentralisée à but pédagogique</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  Catalogue
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="text-muted-foreground hover:text-foreground">
                  Devenir membre
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Informations</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">À propos</li>
              <li className="text-muted-foreground">Contact</li>
              <li className="text-muted-foreground">Mentions légales</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Projet pédagogique</h3>
            <p className="text-sm text-muted-foreground">
              Architecture orientée objet avec diagrammes UML et séparation des responsabilités
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>2025 Biblioteco - Projet pédagogique de bibliothèque décentralisée</p>
        </div>
      </div>
    </footer>
  )
}
