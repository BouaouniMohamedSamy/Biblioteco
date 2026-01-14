import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { BorrowsList } from "@/components/member/borrows-list"

export const metadata = {
  title: "Mes emprunts - BiblioLib",
  description: "Gérez vos emprunts",
}

export default async function BorrowsPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/signin")
  }

  const { data: borrows } = await supabase
    .from("borrows")
    .select(`
      *,
      work:works(*)
    `)
    .eq("user_id", user.id)
    .order("borrowed_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mes emprunts</h1>
          <p className="text-muted-foreground">Gérez vos emprunts et prolongations</p>
        </div>

        <BorrowsList borrows={borrows || []} />
      </div>
    </div>
  )
}
