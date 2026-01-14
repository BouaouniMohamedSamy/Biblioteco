import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { PendingWorksList } from "@/components/librarian/pending-works-list"

export const metadata = {
  title: "Modération - BiblioLib",
  description: "Modérez les œuvres en attente",
}

export default async function PendingWorksPage() {
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
    .eq("status", "pending")
    .order("created_at", { ascending: true })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Œuvres en attente de modération</h1>
          <p className="text-muted-foreground">Examinez et approuvez ou rejetez les soumissions</p>
        </div>

        <PendingWorksList works={works || []} librarianId={user.id} />
      </div>
    </div>
  )
}
