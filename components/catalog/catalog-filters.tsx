import { getSupabaseServerClient } from "@/lib/supabase/server"
import { FilterForm } from "./filter-form"

export async function CatalogFilters() {
  const supabase = await getSupabaseServerClient()

  const { data: categories } = await supabase.from("categories").select("*").order("name")

  return (
    <div className="bg-card border rounded-lg p-6 sticky top-4">
      <h2 className="text-lg font-semibold mb-4">Filtres</h2>
      <FilterForm categories={categories || []} />
    </div>
  )
}
