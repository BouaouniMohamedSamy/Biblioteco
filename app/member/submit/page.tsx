import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { WorkSubmissionForm } from "@/components/member/work-submission-form"

export const metadata = {
  title: "Soumettre une œuvre - BiblioLib",
  description: "Soumettez une nouvelle œuvre à la bibliothèque",
}

export default async function SubmitWorkPage() {
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

  const { data: categories } = await supabase.from("categories").select("*").order("name")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Soumettre une œuvre</h1>
          <p className="text-muted-foreground">Partagez vos créations avec la communauté</p>
        </div>

        <WorkSubmissionForm categories={categories || []} userId={user.id} />
      </div>
    </div>
  )
}
