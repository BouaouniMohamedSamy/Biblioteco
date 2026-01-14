import { Button } from "@/components/ui/button"
import { BookOpen, LogIn, UserPlus } from "lucide-react"
import Link from "next/link"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { UserMenu } from "./user-menu"

export async function Header() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()

    if (!data && !error) {
      console.log(" Profile doesn't exist for user, creating one...")
      const { data: newProfile } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          email: user.email || "",
          full_name: user.user_metadata?.full_name || "",
          role: "member",
        })
        .select()
        .single()

      profile = newProfile
    } else {
      profile = data
    }
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-xl">
          <BookOpen className="h-6 w-6 text-primary" />
          <span>Biblioteco</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/">Catalogue</Link>
          </Button>

          {user ? (
            <>
              {profile?.role === "member" || profile?.role === "librarian" ? (
                <Button variant="ghost" asChild>
                  <Link href="/member">Mon espace</Link>
                </Button>
              ) : null}

              {profile?.role === "librarian" ? (
                <Button variant="ghost" asChild>
                  <Link href="/librarian">Modération</Link>
                </Button>
              ) : null}

              <UserMenu user={user} profile={profile} />
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/auth/signin">
                  <LogIn className="mr-2 h-4 w-4" />
                  Connexion
                </Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Inscription
                </Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
