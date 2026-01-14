"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { workService, type CreateWorkData } from "@/lib/services/work.service"
import type { Category, WorkType } from "@/lib/types/database"

interface WorkSubmissionFormProps {
  categories: Category[]
  userId: string
}

export function WorkSubmissionForm({ categories, userId }: WorkSubmissionFormProps) {
  const router = useRouter()

  const [formData, setFormData] = useState<CreateWorkData>({
    title: "",
    author: "",
    description: "",
    type: "book",
    cover_url: "",
    file_url: "",
    isbn: "",
    publication_year: undefined,
    publisher: "",
    category_ids: [],
  })

  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const workTypes: { value: WorkType; label: string }[] = [
    { value: "book", label: "Livre" },
    { value: "article", label: "Article" },
    { value: "thesis", label: "Thèse" },
    { value: "video", label: "Vidéo" },
    { value: "audio", label: "Audio" },
    { value: "document", label: "Document" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await workService.createWork(userId, formData)
      alert("Œuvre soumise avec succès ! Elle sera examinée par un bibliothécaire.")
      router.push("/member/works")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Erreur lors de la soumission")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCategoryToggle = (categoryId: string) => {
    const currentIds = formData.category_ids || []
    if (currentIds.includes(categoryId)) {
      setFormData({
        ...formData,
        category_ids: currentIds.filter((id) => id !== categoryId),
      })
    } else {
      setFormData({
        ...formData,
        category_ids: [...currentIds, categoryId],
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations de l'œuvre</CardTitle>
        <CardDescription>Remplissez les informations nécessaires pour votre soumission</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm border border-destructive/20">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Auteur *</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type d'œuvre *</Label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as WorkType })}
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
              required
            >
              {workTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="publisher">Éditeur</Label>
              <Input
                id="publisher"
                value={formData.publisher}
                onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="publication_year">Année de publication</Label>
              <Input
                id="publication_year"
                type="number"
                value={formData.publication_year || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    publication_year: e.target.value ? Number.parseInt(e.target.value) : undefined,
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="isbn">ISBN</Label>
            <Input
              id="isbn"
              value={formData.isbn}
              onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover_url">URL de la couverture</Label>
            <Input
              id="cover_url"
              type="url"
              placeholder="https://example.com/cover.jpg"
              value={formData.cover_url}
              onChange={(e) => setFormData({ ...formData, cover_url: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file_url">URL du fichier</Label>
            <Input
              id="file_url"
              type="url"
              placeholder="https://example.com/document.pdf"
              value={formData.file_url}
              onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">Lien vers le fichier de l'œuvre (PDF, ePub, etc.)</p>
          </div>

          <div className="space-y-2">
            <Label>Catégories</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border rounded-lg">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.category_ids?.includes(category.id)}
                    onChange={() => handleCategoryToggle(category.id)}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-sm">{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Soumission en cours..." : "Soumettre l'œuvre"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} className="bg-transparent">
              Annuler
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  )
}
