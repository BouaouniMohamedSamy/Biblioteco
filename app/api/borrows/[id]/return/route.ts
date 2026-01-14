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

    // Retourner l'emprunt
    const { data, error } = await supabase
      .from("borrows")
      .update({
        returned_at: new Date().toISOString(),
        is_active: false,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, borrow: data })
  } catch (error: any) {
    console.error("Error returning borrow:", error)
    return NextResponse.json({ error: error.message || "Erreur lors du retour" }, { status: 500 })
  }
}
