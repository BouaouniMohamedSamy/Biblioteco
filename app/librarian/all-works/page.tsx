import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { AllWorksList } from "@/components/librarian/all-works-list"

export const metadata = {
  title: "Toutes les œuvres - BiblioLib",
  description: "Consultez toutes les œuvres de la bibliothèque",
}

export default async function AllWorksPage() {
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

  const { data: works } = await supabase
    .from("works")
    .select(`
      *,
      submitter:profiles!works_submitted_by_fkey(id, full_name, email)
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Toutes les œuvres</h1>
          <p className="text-muted-foreground">Vue complète du catalogue</p>
        </div>

        <AllWorksList works={works || []} />
      </div>
    </div>
  )
}
