"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { UserCheck, Clock, CheckCircle, XCircle } from "lucide-react"
import { librarianRequestService } from "@/lib/services/librarian-request.service"
import type { LibrarianRequest } from "@/lib/types/database"

interface LibrarianRequestButtonProps {
  userId: string
}

export function LibrarianRequestButton({ userId }: LibrarianRequestButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [motivation, setMotivation] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [existingRequest, setExistingRequest] = useState<LibrarianRequest | null>(null)

  useEffect(() => {
    loadExistingRequest()
  }, [userId])

  const loadExistingRequest = async () => {
    try {
      const request = await librarianRequestService.getUserRequest(userId)
      setExistingRequest(request)
    } catch (err) {
      console.error("Error loading request:", err)
    }
  }

  const handleSubmit = async () => {
    if (!motivation.trim()) {
      setError("Veuillez expliquer votre motivation")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await librarianRequestService.createRequest(userId, motivation)
      setOpen(false)
      setMotivation("")
      router.refresh()
      loadExistingRequest()
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'envoi de la demande")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!existingRequest) return

    setIsLoading(true)
    try {
      await librarianRequestService.cancelRequest(existingRequest.id, userId)
      setExistingRequest(null)
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'annulation")
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = () => {
    if (!existingRequest) return null

    switch (existingRequest.status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
            <Clock className="w-3 h-3 mr-1" />
            En attente
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approuvée
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">
            <XCircle className="w-3 h-3 mr-1" />
            Rejetée
          </Badge>
        )
    }
  }

  if (existingRequest?.status === "pending") {
    return (
      <div className="space-y-2 p-4 border rounded-lg bg-muted/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Demande de rôle bibliothécaire</p>
            <p className="text-sm text-muted-foreground">
              Demandée le {new Date(existingRequest.requested_at).toLocaleDateString()}
            </p>
          </div>
          {getStatusBadge()}
        </div>
        <p className="text-sm text-muted-foreground">Votre demande est en cours d'examen par les bibliothécaires.</p>
        <Button variant="outline" size="sm" onClick={handleCancel} disabled={isLoading} className="bg-transparent">
          Annuler la demande
        </Button>
      </div>
    )
  }

  if (existingRequest?.status === "rejected") {
    return (
      <div className="space-y-2 p-4 border rounded-lg bg-destructive/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Demande de rôle bibliothécaire</p>
            <p className="text-sm text-muted-foreground">
              Rejetée le {new Date(existingRequest.reviewed_at!).toLocaleDateString()}
            </p>
          </div>
          {getStatusBadge()}
        </div>
        {existingRequest.rejection_reason && (
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Raison:</span> {existingRequest.rejection_reason}
          </p>
        )}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="bg-transparent">
              Faire une nouvelle demande
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Demande de rôle bibliothécaire</DialogTitle>
              <DialogDescription>
                Expliquez pourquoi vous souhaitez devenir bibliothécaire et comment vous pouvez contribuer à la
                plateforme.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {error && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm border border-destructive/20">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="motivation">Motivation *</Label>
                <Textarea
                  id="motivation"
                  placeholder="Décrivez votre expérience et votre motivation..."
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  rows={6}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)} className="bg-transparent">
                Annuler
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? "Envoi..." : "Envoyer la demande"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full bg-transparent">
          <UserCheck className="mr-2 h-4 w-4" />
          Demander à devenir bibliothécaire
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Demande de rôle bibliothécaire</DialogTitle>
          <DialogDescription>
            Expliquez pourquoi vous souhaitez devenir bibliothécaire et comment vous pouvez contribuer à la plateforme.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm border border-destructive/20">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="motivation">Motivation *</Label>
            <Textarea
              id="motivation"
              placeholder="Décrivez votre expérience et votre motivation..."
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              rows={6}
              required
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} className="bg-transparent">
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Envoi..." : "Envoyer la demande"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
