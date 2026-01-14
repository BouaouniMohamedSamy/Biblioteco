"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, User, Calendar, BookOpen } from "lucide-react"
import { useRouter } from "next/navigation"
import { workService } from "@/lib/services/work.service"
import type { WorkWithCategories } from "@/lib/types/database"

interface PendingWorksListProps {
  works: WorkWithCategories[]
  librarianId: string
}

const workTypeLabels: Record<string, string> = {
  book: "Livre",
  article: "Article",
  thesis: "Thèse",
  video: "Vidéo",
  audio: "Audio",
  document: "Document",
}

export function PendingWorksList({ works, librarianId }: PendingWorksListProps) {
  const router = useRouter()
  const [expandedWork, setExpandedWork] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleApprove = async (workId: string) => {
    if (!confirm("Voulez-vous approuver cette œuvre ?")) return

    setIsLoading(true)
    try {
      await workService.approveWork(workId, librarianId)
      alert("Œuvre approuvée avec succès !")
      router.refresh()
    } catch (error) {
      alert("Erreur lors de l'approbation")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReject = async (workId: string) => {
    if (!rejectionReason.trim()) {
      alert("Veuillez fournir une raison pour le rejet")
      return
    }

    if (!confirm("Voulez-vous rejeter cette œuvre ?")) return

    setIsLoading(true)
    try {
      await workService.rejectWork(workId, rejectionReason)
      alert("Œuvre rejetée")
      setRejectionReason("")
      setExpandedWork(null)
      router.refresh()
    } catch (error) {
      alert("Erreur lors du rejet")
    } finally {
      setIsLoading(false)
    }
  }

  if (works.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <p className="text-xl font-semibold mb-2">Aucune œuvre en attente</p>
          <p className="text-muted-foreground">Toutes les soumissions ont été traitées</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {works.map((work) => {
        const isExpanded = expandedWork === work.id

        return (
          <Card key={work.id} className="overflow-hidden">
            <CardHeader className="bg-muted/30">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-48 shrink-0">
                  <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg overflow-hidden">
                    {work.cover_url ? (
                      <img
                        src={work.cover_url || "/placeholder.svg"}
                        alt={work.title}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <BookOpen className="h-16 w-16 text-primary/40" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-start gap-2 mb-2">
                      <Badge>{workTypeLabels[work.type]}</Badge>
                      <Badge variant="secondary">En attente</Badge>
                    </div>
                    <h3 className="text-2xl font-bold mb-1">{work.title}</h3>
                    <p className="text-lg text-muted-foreground">{work.author}</p>
                  </div>

                  {work.description && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Description</h4>
                      <p className="text-sm text-muted-foreground">{work.description}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {work.publisher && (
                      <div className="text-sm">
                        <span className="font-semibold">Éditeur :</span> {work.publisher}
                      </div>
                    )}
                    {work.publication_year && (
                      <div className="text-sm">
                        <span className="font-semibold">Année :</span> {work.publication_year}
                      </div>
                    )}
                    {work.isbn && (
                      <div className="text-sm">
                        <span className="font-semibold">ISBN :</span> {work.isbn}
                      </div>
                    )}
                    {work.file_url && (
                      <div className="text-sm">
                        <span className="font-semibold">Fichier :</span>{" "}
                        <a
                          href={work.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Voir le fichier
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
                    {work.submitter && (
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {work.submitter.full_name || work.submitter.email}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(work.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => handleApprove(work.id)}
                  disabled={isLoading}
                  className="flex-1"
                  variant="default"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approuver
                </Button>

                <Button
                  onClick={() => setExpandedWork(isExpanded ? null : work.id)}
                  disabled={isLoading}
                  className="flex-1"
                  variant="destructive"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Rejeter
                </Button>
              </div>

              {isExpanded && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor={`reason-${work.id}`}>Raison du rejet *</Label>
                    <Textarea
                      id={`reason-${work.id}`}
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Expliquez pourquoi cette œuvre est rejetée..."
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={() => handleReject(work.id)}
                      disabled={isLoading || !rejectionReason.trim()}
                      variant="destructive"
                      className="flex-1"
                    >
                      Confirmer le rejet
                    </Button>
                    <Button
                      onClick={() => {
                        setExpandedWork(null)
                        setRejectionReason("")
                      }}
                      variant="outline"
                      className="bg-transparent"
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
