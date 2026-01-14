import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { LibrarianRequestsList } from "@/components/librarian/librarian-requests-list"

export const metadata = {
  title: "Demandes de bibliothécaires - BiblioLib",
  description: "Gérez les demandes de rôle bibliothécaire",
}

export default async function LibrarianRequestsPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/signin")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()

  if (profile?.role !== "librarian") {
    redirect("/")
  }

  // Get all requests with user details
  const { data: requests } = await supabase
    .from("librarian_requests")
    .select(`
      *,
      user:profiles!librarian_requests_user_id_fkey(*),
      reviewer:profiles!librarian_requests_reviewed_by_fkey(*)
    `)
    .order("requested_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Demandes de bibliothécaires</h1>
          <p className="text-muted-foreground">Examinez et gérez les demandes de rôle bibliothécaire</p>
        </div>

        <LibrarianRequestsList requests={requests || []} reviewerId={user.id} />
      </div>
    </div>
  )
}
