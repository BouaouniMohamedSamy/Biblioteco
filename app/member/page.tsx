import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Upload, FileText, Heart } from "lucide-react"
import Link from "next/link"

export default async function MemberDashboard() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/signin")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (profile?.role !== "member" && profile?.role !== "librarian") {
    redirect("/")
  }

  // Statistiques de l'utilisateur
  const { count: totalWorks } = await supabase
    .from("works")
    .select("*", { count: "exact", head: true })
    .eq("submitted_by", user.id)

  const { count: approvedWorks } = await supabase
    .from("works")
    .select("*", { count: "exact", head: true })
    .eq("submitted_by", user.id)
    .eq("status", "approved")

  const { count: pendingWorks } = await supabase
    .from("works")
    .select("*", { count: "exact", head: true })
    .eq("submitted_by", user.id)
    .eq("status", "pending")

  const { count: favoritesCount } = await supabase
    .from("favorites")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Espace Membre</h1>
          <p className="text-muted-foreground">Bienvenue {profile?.full_name || "Membre"}, gérez vos contributions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{totalWorks || 0}</CardTitle>
              <CardDescription>Œuvres soumises</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{approvedWorks || 0}</CardTitle>
              <CardDescription>Œuvres approuvées</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{pendingWorks || 0}</CardTitle>
              <CardDescription>En attente</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Soumettre une œuvre</CardTitle>
                  <CardDescription>Ajoutez une nouvelle œuvre à la bibliothèque</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/member/submit">
                  <Upload className="mr-2 h-4 w-4" />
                  Nouvelle soumission
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Mes œuvres</CardTitle>
                  <CardDescription>Consultez et gérez vos soumissions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/member/works">
                  <FileText className="mr-2 h-4 w-4" />
                  Voir mes œuvres
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Mes emprunts</CardTitle>
                  <CardDescription>Gérez vos emprunts en cours</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/member/borrows">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Voir mes emprunts
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-500/10 rounded-lg">
                  <Heart className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <CardTitle>Mes favoris</CardTitle>
                  <CardDescription>
                    {favoritesCount || 0} œuvre{(favoritesCount || 0) > 1 ? "s" : ""} favorite
                    {(favoritesCount || 0) > 1 ? "s" : ""}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/member/favorites">
                  <Heart className="mr-2 h-4 w-4" />
                  Voir mes favoris
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
