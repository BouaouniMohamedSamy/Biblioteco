"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, Download, CheckCircle, XCircle, Clock, Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { WorkWithCategories } from "@/lib/types/database"

interface AllWorksListProps {
  works: WorkWithCategories[]
}

const workTypeLabels: Record<string, string> = {
  book: "Livre",
  article: "Article",
  thesis: "Thèse",
  video: "Vidéo",
  audio: "Audio",
  document: "Document",
}

const statusConfig = {
  pending: { label: "En attente", icon: Clock, color: "text-yellow-500" },
  approved: { label: "Approuvée", icon: CheckCircle, color: "text-green-500" },
  rejected: { label: "Rejetée", icon: XCircle, color: "text-red-500" },
}

export function AllWorksList({ works }: AllWorksListProps) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredWorks = works.filter((work) => {
    const matchesSearch =
      work.title.toLowerCase().includes(search.toLowerCase()) ||
      work.author.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || work.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const stats = {
    total: works.length,
    pending: works.filter((w) => w.status === "pending").length,
    approved: works.filter((w) => w.status === "approved").length,
    rejected: works.filter((w) => w.status === "rejected").length,
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">En attente</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{stats.approved}</div>
              <div className="text-sm text-muted-foreground">Approuvées</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">{stats.rejected}</div>
              <div className="text-sm text-muted-foreground">Rejetées</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="search">Recherche</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Titre ou auteur..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full md:w-48 h-10 px-3 rounded-md border border-input bg-background"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="approved">Approuvées</option>
                <option value="rejected">Rejetées</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredWorks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Aucune œuvre trouvée</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredWorks.map((work) => {
            const status = statusConfig[work.status]
            const StatusIcon = status.icon

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
                        <div className={`flex items-center gap-1 ${status.color}`}>
                          <StatusIcon className="h-4 w-4" />
                          <span className="text-sm font-medium">{status.label}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{workTypeLabels[work.type]}</Badge>
                        {work.submitter && (
                          <span className="text-xs text-muted-foreground">
                            Par {work.submitter.full_name || work.submitter.email}
                          </span>
                        )}
                      </div>

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
      )}
    </div>
  )
}
