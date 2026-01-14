import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await getSupabaseServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { workId } = await request.json()

    if (!workId) {
      return NextResponse.json({ error: "workId requis" }, { status: 400 })
    }

    // Enregistrer le téléchargement
    const { data, error } = await supabase
      .from("downloads")
      .insert({
        work_id: workId,
        user_id: user?.id || null,
      })
      .select()
      .single()

    if (error) throw error

    // Incrémenter le compteur de téléchargements
    await supabase.rpc("increment", {
      table_name: "works",
      row_id: workId,
      column_name: "downloads_count",
    })

    return NextResponse.json({ success: true, download: data })
  } catch (error: any) {
    console.error("Error recording download:", error)
    return NextResponse.json({ error: error.message || "Erreur lors de l'enregistrement" }, { status: 500 })
  }
}
