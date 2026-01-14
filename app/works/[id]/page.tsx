import { notFound } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { WorkDetails } from "@/components/works/work-details"
import { WorkActions } from "@/components/works/work-actions"
import type { Metadata } from "next"

interface WorkPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: WorkPageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await getSupabaseServerClient()

  const { data: work } = await supabase.from("works").select("title, author, description").eq("id", id).single()

  if (!work) {
    return { title: "Œuvre introuvable" }
  }

  return {
    title: `${work.title} - ${work.author}`,
    description: work.description || `Découvrez ${work.title} par ${work.author}`,
  }
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { id } = await params
  const supabase = await getSupabaseServerClient()

  const { data: work, error } = await supabase.from("works").select("*").eq("id", id).eq("status", "approved").single()

  if (error || !work) {
    notFound()
  }

  let submitter = null
  if (work.submitted_by) {
    const { data } = await supabase.from("profiles").select("id, full_name, email").eq("id", work.submitted_by).single()
    submitter = data
  }

  // Récupérer les catégories
  const { data: workCategories } = await supabase.from("work_categories").select("categories(*)").eq("work_id", id)

  const categories = workCategories?.map((wc) => wc.categories).filter(Boolean) || []

  // Récupérer l'utilisateur courant
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <WorkDetails work={{ ...work, submitter, categories }} />
        <WorkActions work={work} user={user} />
      </div>
    </div>
  )
}
