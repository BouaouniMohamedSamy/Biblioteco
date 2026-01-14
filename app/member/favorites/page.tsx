import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart } from "lucide-react"
import { FavoritesList } from "@/components/member/favorites-list"

export default async function FavoritesPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/signin")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()

  if (!profile) {
    redirect("/")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-500/10 rounded-lg">
                <Heart className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <CardTitle>Mes Favoris</CardTitle>
                <p className="text-sm text-muted-foreground">Les œuvres que vous avez ajoutées à vos favoris</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <FavoritesList userId={user.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
