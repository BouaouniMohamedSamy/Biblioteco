import { getSupabaseServerClient } from "@/lib/supabase/server"
import { WorkCard } from "./work-card"
import type { WorkType } from "@/lib/types/database"

interface CatalogGridProps {
  filters?: {
    category?: string
    type?: string
    search?: string
  }
}

export async function CatalogGrid({ filters }: CatalogGridProps) {
  const supabase = await getSupabaseServerClient()

  // 1️⃣ Récupérer les œuvres approuvées
  let query = supabase
    .from("works")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false })

  if (filters?.type) {
    query = query.eq("type", filters.type as WorkType)
  }

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,author.ilike.%${filters.search}%`)
  }

  const { data: works, error } = await query

  if (error || !works) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Erreur lors du chargement des œuvres</p>
      </div>
    )
  }

  // 2️⃣ Récupérer les submitters correspondants
  const submitterIds = [...new Set(works.map((w) => w.submitted_by).filter(Boolean))]

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .in("id", submitterIds)

  // 3️⃣ Ajouter les infos submitter à chaque œuvre
  const worksWithSubmitters = works.map((work) => ({
    ...work,
    submitter: profiles?.find((p) => p.id === work.submitted_by) || null,
  }))

  // 4️⃣ Filtrer par catégorie (relation many-to-many)
  let filteredWorks = worksWithSubmitters
  if (filters?.category) {
    const { data: workCategories } = await supabase
      .from("work_categories")
      .select("work_id")
      .eq("category_id", filters.category)

    const workIds = workCategories?.map((wc) => wc.work_id) || []
    filteredWorks = filteredWorks.filter((work) => workIds.includes(work.id))
  }

  if (filteredWorks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Aucune œuvre trouvée avec ces critères</p>
      </div>
    )
  }

  return (
    <div id="catalog" className="scroll-mt-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Catalogue ({filteredWorks.length})</h2>
        <p className="text-muted-foreground">Découvrez notre collection d'œuvres numériques</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredWorks.map((work) => (
          <WorkCard key={work.id} work={work} />
        ))}
      </div>
    </div>
  )
}
