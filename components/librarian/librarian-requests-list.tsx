"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Clock, CheckCircle, XCircle, User } from "lucide-react"
import { librarianRequestService } from "@/lib/services/librarian-request.service"
import type { LibrarianRequestWithUser } from "@/lib/types/database"

interface LibrarianRequestsListProps {
  requests: LibrarianRequestWithUser[]
  reviewerId: string
}

export function LibrarianRequestsList({ requests, reviewerId }: LibrarianRequestsListProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<LibrarianRequestWithUser | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")

  const pendingRequests = requests.filter((r) => r.status === "pending")
  const approvedRequests = requests.filter((r) => r.status === "approved")
  const rejectedRequests = requests.filter((r) => r.status === "rejected")

  const handleApprove = async (requestId: string) => {
    setIsLoading(true)
    setError("")

    try {
      await librarianRequestService.approveRequest(requestId, reviewerId)
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'approbation")
    } finally {
      setIsLoading(false)
    }
  }

  const openRejectDialog = (request: LibrarianRequestWithUser) => {
    setSelectedRequest(request)
    setRejectionReason("")
    setRejectDialogOpen(true)
  }

  const handleReject = async () => {
    if (!selectedRequest || !rejectionReason.trim()) {
      setError("Veuillez indiquer une raison pour le rejet")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await librarianRequestService.rejectRequest(selectedRequest.id, reviewerId, rejectionReason)
      setRejectDialogOpen(false)
      setSelectedRequest(null)
      setRejectionReason("")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Erreur lors du rejet")
    } finally {
      setIsLoading(false)
    }
  }

  const RequestCard = ({ request }: { request: LibrarianRequestWithUser }) => (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {request.user?.full_name || "Utilisateur"}
            </CardTitle>
            <CardDescription>{request.user?.email}</CardDescription>
          </div>
          {request.status === "pending" && (
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
              <Clock className="w-3 h-3 mr-1" />
              En attente
            </Badge>
          )}
          {request.status === "approved" && (
            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
              <CheckCircle className="w-3 h-3 mr-1" />
              Approuvée
            </Badge>
          )}
          {request.status === "rejected" && (
            <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">
              <XCircle className="w-3 h-3 mr-1" />
              Rejetée
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-1">Motivation</p>
          <p className="text-sm text-muted-foreground">{request.motivation || "Aucune motivation fournie"}</p>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>Demandée le {new Date(request.requested_at).toLocaleDateString()}</p>
          {request.reviewed_at && (
            <>
              <p>Examinée le {new Date(request.reviewed_at).toLocaleDateString()}</p>
              {request.reviewer && <p>Par {request.reviewer.full_name || request.reviewer.email}</p>}
            </>
          )}
        </div>

        {request.status === "rejected" && request.rejection_reason && (
          <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
            <p className="text-sm font-medium text-destructive mb-1">Raison du rejet</p>
            <p className="text-sm text-muted-foreground">{request.rejection_reason}</p>
          </div>
        )}

        {request.status === "pending" && (
          <div className="flex gap-2 pt-2">
            <Button onClick={() => handleApprove(request.id)} disabled={isLoading} className="flex-1">
              <CheckCircle className="mr-2 h-4 w-4" />
              Approuver
            </Button>
            <Button
              variant="outline"
              onClick={() => openRejectDialog(request)}
              disabled={isLoading}
              className="flex-1 bg-transparent"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Rejeter
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <>
      {error && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm border border-destructive/20 mb-4">
          {error}
        </div>
      )}

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">En attente ({pendingRequests.length})</TabsTrigger>
          <TabsTrigger value="approved">Approuvées ({approvedRequests.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejetées ({rejectedRequests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingRequests.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">Aucune demande en attente</CardContent>
            </Card>
          ) : (
            pendingRequests.map((request) => <RequestCard key={request.id} request={request} />)
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedRequests.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">Aucune demande approuvée</CardContent>
            </Card>
          ) : (
            approvedRequests.map((request) => <RequestCard key={request.id} request={request} />)
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {rejectedRequests.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">Aucune demande rejetée</CardContent>
            </Card>
          ) : (
            rejectedRequests.map((request) => <RequestCard key={request.id} request={request} />)
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter la demande</DialogTitle>
            <DialogDescription>
              Veuillez indiquer la raison du rejet. Cette information sera communiquée à l'utilisateur.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejection">Raison du rejet *</Label>
              <Textarea
                id="rejection"
                placeholder="Expliquez pourquoi cette demande est rejetée..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)} className="bg-transparent">
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={isLoading}>
              {isLoading ? "Rejet..." : "Confirmer le rejet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
