import { Badge } from "@/components/ui/badge"
import { Card, CardHeader } from "@/components/ui/card"
import { BookOpen, Calendar, User, Building, Hash, Eye, Download } from "lucide-react"
import type { WorkWithCategories } from "@/lib/types/database"
import { FavoriteButton } from "@/components/catalog/favorite-button"

interface WorkDetailsProps {
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

export function WorkDetails({ work }: WorkDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 shrink-0">
            <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg overflow-hidden">
              {work.cover_url ? (
                <img
                  src={work.cover_url || "/placeholder.svg"}
                  alt={work.title}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <BookOpen className="h-32 w-32 text-primary/40" />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <Badge className="mb-2">{workTypeLabels[work.type]}</Badge>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-balance mb-2">{work.title}</h1>
                  <p className="text-xl text-muted-foreground">{work.author}</p>
                </div>
                <FavoriteButton workId={work.id} variant="outline" size="default" showLabel />
              </div>
            </div>

            {work.description && <p className="text-muted-foreground text-pretty">{work.description}</p>}

            <div className="grid grid-cols-2 gap-4 pt-4">
              {work.publisher && (
                <div className="flex items-center gap-2 text-sm">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{work.publisher}</span>
                </div>
              )}
              {work.publication_year && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{work.publication_year}</span>
                </div>
              )}
              {work.isbn && (
                <div className="flex items-center gap-2 text-sm">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span>{work.isbn}</span>
                </div>
              )}
              {work.submitter && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Soumis par {work.submitter.full_name || work.submitter.email}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground pt-4 border-t">
              <span className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                {work.views_count} vues
              </span>
              <span className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                {work.downloads_count} téléchargements
              </span>
            </div>

            {work.categories && work.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4">
                {work.categories.map((category) => (
                  <Badge key={category.id} variant="outline">
                    {category.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}
