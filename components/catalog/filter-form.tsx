"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Category, WorkType } from "@/lib/types/database"
import { Search, X } from "lucide-react"

interface FilterFormProps {
  categories: Category[]
}

export function FilterForm({ categories }: FilterFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const workTypes: { value: WorkType; label: string }[] = [
    { value: "book", label: "Livre" },
    { value: "article", label: "Article" },
    { value: "thesis", label: "Thèse" },
    { value: "video", label: "Vidéo" },
    { value: "audio", label: "Audio" },
    { value: "document", label: "Document" },
  ]

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push("/")
  }

  const hasActiveFilters = searchParams.toString().length > 0

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="search">Recherche</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Titre ou auteur..."
            defaultValue={searchParams.get("search") || ""}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Type d'œuvre</Label>
        <div className="space-y-2">
          {workTypes.map((type) => (
            <label key={type.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                value={type.value}
                checked={searchParams.get("type") === type.value}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                className="w-4 h-4 text-primary"
              />
              <span className="text-sm">{type.label}</span>
            </label>
          ))}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="type"
              value=""
              checked={!searchParams.get("type")}
              onChange={() => handleFilterChange("type", "")}
              className="w-4 h-4 text-primary"
            />
            <span className="text-sm">Tous les types</span>
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Catégorie</Label>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                value={category.id}
                checked={searchParams.get("category") === category.id}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-4 h-4 text-primary"
              />
              <span className="text-sm">{category.name}</span>
            </label>
          ))}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              value=""
              checked={!searchParams.get("category")}
              onChange={() => handleFilterChange("category", "")}
              className="w-4 h-4 text-primary"
            />
            <span className="text-sm">Toutes les catégories</span>
          </label>
        </div>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
          <X className="mr-2 h-4 w-4" />
          Réinitialiser les filtres
        </Button>
      )}
    </div>
  )
}
