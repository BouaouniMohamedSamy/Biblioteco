import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await getSupabaseServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    // Vérifier que l'emprunt appartient à l'utilisateur
    const { data: borrow } = await supabase.from("borrows").select("*").eq("id", id).eq("user_id", user.id).single()

    if (!borrow) {
      return NextResponse.json({ error: "Emprunt introuvable" }, { status: 404 })
    }

    if (!borrow.is_active) {
      return NextResponse.json({ error: "Cet emprunt n'est plus actif" }, { status: 400 })
    }

    // Prolonger de 7 jours
    const newDueDate = new Date(borrow.due_date)
    newDueDate.setDate(newDueDate.getDate() + 7)

    const { data, error } = await supabase
      .from("borrows")
      .update({
        due_date: newDueDate.toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, borrow: data })
  } catch (error: any) {
    console.error("Error extending borrow:", error)
    return NextResponse.json({ error: error.message || "Erreur lors de la prolongation" }, { status: 500 })
  }
}
