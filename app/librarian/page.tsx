import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle, XCircle, BookOpen, UserCheck } from "lucide-react"
import Link from "next/link"

export default async function LibrarianDashboard() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/signin")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (profile?.role !== "librarian") {
    redirect("/")
  }

  // Statistiques de modération
  const { count: pendingCount } = await supabase
    .from("works")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")

  const { count: approvedCount } = await supabase
    .from("works")
    .select("*", { count: "exact", head: true })
    .eq("status", "approved")

  const { count: rejectedCount } = await supabase
    .from("works")
    .select("*", { count: "exact", head: true })
    .eq("status", "rejected")

  const { count: totalWorks } = await supabase.from("works").select("*", { count: "exact", head: true })

  const { count: pendingRequestsCount } = await supabase
    .from("librarian_requests")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tableau de modération</h1>
          <p className="text-muted-foreground">Gérez les soumissions et modérez le catalogue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <CardTitle className="text-2xl">{pendingCount || 0}</CardTitle>
              </div>
              <CardDescription>En attente</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <CardTitle className="text-2xl">{approvedCount || 0}</CardTitle>
              </div>
              <CardDescription>Approuvées</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <CardTitle className="text-2xl">{rejectedCount || 0}</CardTitle>
              </div>
              <CardDescription>Rejetées</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <CardTitle className="text-2xl">{totalWorks || 0}</CardTitle>
              </div>
              <CardDescription>Total</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>Accédez aux fonctions de modération</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full" size="lg">
              <Link href="/librarian/pending">
                <Clock className="mr-2 h-5 w-5" />
                Modérer les soumissions en attente ({pendingCount || 0})
              </Link>
            </Button>

            <Button asChild variant="outline" className="w-full bg-transparent" size="lg">
              <Link href="/librarian/requests">
                <UserCheck className="mr-2 h-5 w-5" />
                Gérer les demandes de bibliothécaires ({pendingRequestsCount || 0})
              </Link>
            </Button>

            <Button asChild variant="outline" className="w-full bg-transparent" size="lg">
              <Link href="/librarian/all-works">
                <BookOpen className="mr-2 h-5 w-5" />
                Voir toutes les œuvres
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
