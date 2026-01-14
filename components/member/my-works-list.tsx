"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Download, Clock, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import type { Work } from "@/lib/types/database"

interface MyWorksListProps {
  works: Work[]
}

const workTypeLabels: Record<string, string> = {
  book: "Livre",
  article: "Article",
  thesis: "Thèse",
  video: "Vidéo",
  audio: "Audio",
  document: "Document",
}

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  pending: { label: "En attente", variant: "secondary" },
  approved: { label: "Approuvée", variant: "default" },
  rejected: { label: "Rejetée", variant: "destructive" },
}

export function MyWorksList({ works }: MyWorksListProps) {
  if (works.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground mb-4">Vous n'avez pas encore soumis d'œuvres</p>
          <Button asChild>
            <Link href="/member/submit">Soumettre votre première œuvre</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {works.map((work) => {
        const status = statusLabels[work.status]
        const StatusIcon = work.status === "approved" ? CheckCircle : work.status === "rejected" ? XCircle : Clock

        return (
          <Card key={work.id}>
            <CardHeader>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-32 shrink-0">
                  <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg overflow-hidden">
                    {work.cover_url ? (
                      <img
                        src={work.cover_url || "/placeholder.svg"}
                        alt={work.title}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Eye className="h-12 w-12 text-primary/40" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-lg">{work.title}</h3>
                      <p className="text-sm text-muted-foreground">{work.author}</p>
                    </div>
                    <Badge variant={status.variant} className="flex items-center gap-1">
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{workTypeLabels[work.type]}</Badge>
                    <span className="text-sm text-muted-foreground">
                      Soumis le {new Date(work.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>

                  {work.description && <p className="text-sm text-muted-foreground line-clamp-2">{work.description}</p>}

                  {work.status === "approved" && (
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {work.views_count} vues
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {work.downloads_count} téléchargements
                      </span>
                    </div>
                  )}

                  {work.status === "rejected" && work.rejection_reason && (
                    <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm border border-destructive/20">
                      <strong>Raison du rejet :</strong> {work.rejection_reason}
                    </div>
                  )}

                  {work.status === "approved" && (
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/works/${work.id}`}>Voir sur le catalogue</Link>
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        )
      })}
    </div>
  )
}
