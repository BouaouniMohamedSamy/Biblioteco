import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Eye, Download } from "lucide-react"
import Link from "next/link"
import type { WorkWithCategories } from "@/lib/types/database"
import { FavoriteButton } from "./favorite-button"

interface WorkCardProps {
  work: WorkWithCategories
}

const workTypeLabels: Record<string, string> = {
  book: "Livre",
  article: "Article",
  thesis: "Thèse",
  video: "Vidéo",
  audio: "Audio",
  document: "Document",
}

export function WorkCard({ work }: WorkCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <CardHeader className="p-0">
        <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
          {work.cover_url ? (
            <img
              src={work.cover_url || "/placeholder.svg"}
              alt={work.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <BookOpen className="h-24 w-24 text-primary/40" />
            </div>
          )}
          <Badge className="absolute top-3 right-3">{workTypeLabels[work.type]}</Badge>
          <div className="absolute top-3 left-3">
            <FavoriteButton workId={work.id} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-2">
        <h3 className="font-semibold text-lg line-clamp-2 text-balance">{work.title}</h3>
        <p className="text-sm text-muted-foreground">{work.author}</p>
        {work.description && <p className="text-sm text-muted-foreground line-clamp-2">{work.description}</p>}

        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {work.views_count}
          </span>
          <span className="flex items-center gap-1">
            <Download className="h-3 w-3" />
            {work.downloads_count}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/works/${work.id}`}>Voir les détails</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
