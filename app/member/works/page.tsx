import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { MyWorksList } from "@/components/member/my-works-list"

export const metadata = {
  title: "Mes œuvres - BiblioLib",
  description: "Gérez vos œuvres soumises",
}

export default async function MyWorksPage() {
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

  const { data: works } = await supabase
    .from("works")
    .select("*")
    .eq("submitted_by", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mes œuvres</h1>
          <p className="text-muted-foreground">Consultez et gérez vos soumissions</p>
        </div>

        <MyWorksList works={works || []} />
      </div>
    </div>
  )
}
