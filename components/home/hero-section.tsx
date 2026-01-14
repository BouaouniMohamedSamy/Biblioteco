import { Button } from "@/components/ui/button"
import { BookOpen, Search } from "lucide-react"
import Link from "next/link"

interface HeroSectionProps {
  worksCount: number
  categoriesCount: number
}

export function HeroSection({ worksCount, categoriesCount }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-background border-b">
      <div className="container mx-auto px-4 py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            <BookOpen className="h-4 w-4" />
            Bibliothèque Numérique Décentralisée
          </div>

          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-balance">
            Accédez au savoir libre et partagé
          </h1>

          <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
            Explorez notre collection de {worksCount} œuvres numériques dans {categoriesCount} catégories. Consultez,
            empruntez et contribuez au patrimoine intellectuel commun.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild className="min-w-[200px]">
              <Link href="#catalog">
                <Search className="mr-2 h-5 w-5" />
                Explorer le catalogue
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="min-w-[200px] bg-transparent">
              <Link href="/auth/signup">Devenir membre</Link>
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{worksCount}</div>
              <div className="text-sm text-muted-foreground">Œuvres</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{categoriesCount}</div>
              <div className="text-sm text-muted-foreground">Catégories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Accès libre</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
