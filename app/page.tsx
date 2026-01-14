import { Suspense } from "react"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { CatalogGrid } from "@/components/catalog/catalog-grid"
import { CatalogFilters } from "@/components/catalog/catalog-filters"
import { HeroSection } from "@/components/home/hero-section"
import { StatsSection } from "@/components/home/stats-section"

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; type?: string; search?: string }>
}) {
  const params = await searchParams
  const supabase = await getSupabaseServerClient()

  // Récupérer les statistiques
  const { count: worksCount } = await supabase
    .from("works")
    .select("*", { count: "exact", head: true })
    .eq("status", "approved")

  const { count: categoriesCount } = await supabase.from("categories").select("*", { count: "exact", head: true })

  return (
    <div className="min-h-screen">
      <HeroSection worksCount={worksCount || 0} categoriesCount={categoriesCount || 0} />

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 shrink-0">
            <Suspense fallback={<div className="h-96 animate-pulse bg-muted rounded-lg" />}>
              <CatalogFilters />
            </Suspense>
          </aside>

          <main className="flex-1">
            <Suspense
              fallback={
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-96 animate-pulse bg-muted rounded-lg" />
                  ))}
                </div>
              }
            >
              <CatalogGrid filters={params} />
            </Suspense>
          </main>
        </div>
      </div>

      <StatsSection />
    </div>
  )
}
