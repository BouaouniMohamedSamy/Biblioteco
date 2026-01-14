"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Calendar, CheckCircle, Clock, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Borrow {
  id: string
  work_id: string
  user_id: string
  borrowed_at: string
  due_date: string
  returned_at: string | null
  is_active: boolean
  work: any
}

interface BorrowsListProps {
  borrows: Borrow[]
}

export function BorrowsList({ borrows }: BorrowsListProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleReturn = async (borrowId: string) => {
    if (!confirm("Voulez-vous retourner cet emprunt ?")) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/borrows/${borrowId}/return`, {
        method: "POST",
      })

      if (response.ok) {
        alert("Emprunt retourné avec succès !")
        router.refresh()
      } else {
        const data = await response.json()
        alert(data.error || "Erreur lors du retour")
      }
    } catch (error) {
      alert("Erreur lors du retour")
    } finally {
      setIsLoading(false)
    }
  }

  const handleExtend = async (borrowId: string) => {
    if (!confirm("Voulez-vous prolonger cet emprunt de 7 jours ?")) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/borrows/${borrowId}/extend`, {
        method: "POST",
      })

      if (response.ok) {
        alert("Emprunt prolongé de 7 jours !")
        router.refresh()
      } else {
        const data = await response.json()
        alert(data.error || "Erreur lors de la prolongation")
      }
    } catch (error) {
      alert("Erreur lors de la prolongation")
    } finally {
      setIsLoading(false)
    }
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  const activeBorrows = borrows.filter((b) => b.is_active)
  const returnedBorrows = borrows.filter((b) => !b.is_active)

  if (borrows.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-xl font-semibold mb-2">Aucun emprunt</p>
          <p className="text-muted-foreground mb-4">Vous n'avez pas encore emprunté d'œuvres</p>
          <Button asChild>
            <Link href="/">Explorer le catalogue</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {activeBorrows.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Emprunts en cours ({activeBorrows.length})
          </h2>

          {activeBorrows.map((borrow) => {
            const overdue = isOverdue(borrow.due_date)
            const daysLeft = Math.ceil(
              (new Date(borrow.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
            )

            return (
              <Card key={borrow.id} className={overdue ? "border-destructive" : ""}>
                <CardHeader>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-32 shrink-0">
                      <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg overflow-hidden">
                        {borrow.work.cover_url ? (
                          <img
                            src={borrow.work.cover_url || "/placeholder.svg"}
                            alt={borrow.work.title}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <BookOpen className="h-12 w-12 text-primary/40" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg">{borrow.work.title}</h3>
                        <p className="text-sm text-muted-foreground">{borrow.work.author}</p>
                      </div>

                      <div className="flex flex-wrap gap-2 items-center">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Emprunté le {new Date(borrow.borrowed_at).toLocaleDateString("fr-FR")}
                        </Badge>

                        {overdue ? (
                          <Badge variant="destructive">En retard de {Math.abs(daysLeft)} jours</Badge>
                        ) : (
                          <Badge variant="secondary">Reste {daysLeft} jours</Badge>
                        )}
                      </div>

                      <div className="text-sm">
                        <span className="text-muted-foreground">À retourner avant le :</span>{" "}
                        <span className={overdue ? "text-destructive font-semibold" : "font-medium"}>
                          {new Date(borrow.due_date).toLocaleDateString("fr-FR")}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 pt-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/works/${borrow.work.id}`}>
                            <ArrowRight className="mr-2 h-4 w-4" />
                            Voir l'œuvre
                          </Link>
                        </Button>

                        <Button
                          onClick={() => handleExtend(borrow.id)}
                          disabled={isLoading}
                          variant="outline"
                          size="sm"
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          Prolonger (+7j)
                        </Button>

                        <Button
                          onClick={() => handleReturn(borrow.id)}
                          disabled={isLoading}
                          variant="default"
                          size="sm"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Retourner
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      )}

      {returnedBorrows.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Historique ({returnedBorrows.length})
          </h2>

          {returnedBorrows.map((borrow) => (
            <Card key={borrow.id} className="opacity-75">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-20 shrink-0">
                    <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg overflow-hidden">
                      {borrow.work.cover_url ? (
                        <img
                          src={borrow.work.cover_url || "/placeholder.svg"}
                          alt={borrow.work.title}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <BookOpen className="h-8 w-8 text-primary/40" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold">{borrow.work.title}</h3>
                    <p className="text-sm text-muted-foreground">{borrow.work.author}</p>
                    <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
                      <span>Emprunté: {new Date(borrow.borrowed_at).toLocaleDateString("fr-FR")}</span>
                      <span>•</span>
                      <span>Retourné: {new Date(borrow.returned_at!).toLocaleDateString("fr-FR")}</span>
                    </div>
                  </div>

                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/works/${borrow.work.id}`}>Voir</Link>
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
