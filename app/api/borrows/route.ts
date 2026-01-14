import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await getSupabaseServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const { workId } = await request.json()

    if (!workId) {
      return NextResponse.json({ error: "workId requis" }, { status: 400 })
    }

    // Vérifier qu'il n'y a pas déjà un emprunt actif
    const { data: existingBorrow } = await supabase
      .from("borrows")
      .select("*")
      .eq("user_id", user.id)
      .eq("work_id", workId)
      .eq("is_active", true)
      .single()

    if (existingBorrow) {
      return NextResponse.json({ error: "Vous avez déjà emprunté cette œuvre" }, { status: 400 })
    }

    // Créer l'emprunt (14 jours par défaut)
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 14)

    const { data, error } = await supabase
      .from("borrows")
      .insert({
        user_id: user.id,
        work_id: workId,
        due_date: dueDate.toISOString(),
        is_active: true,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, borrow: data })
  } catch (error: any) {
    console.error("Error creating borrow:", error)
    return NextResponse.json({ error: error.message || "Erreur lors de l'emprunt" }, { status: 500 })
  }
}
