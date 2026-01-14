"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, BookMarked, LogOut, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/services/auth.service"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import type { Profile } from "@/lib/types/database"

interface UserMenuProps {
  user: SupabaseUser
  profile: Profile | null
}

export function UserMenu({ user, profile }: UserMenuProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await authService.signOut()
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{profile?.full_name || "Utilisateur"}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            {profile?.role && (
              <p className="text-xs leading-none text-primary font-medium mt-1 capitalize">{profile.role}</p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/member/borrows")}>
          <BookMarked className="mr-2 h-4 w-4" />
          Mes emprunts
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/member/profile")}>
          <Settings className="mr-2 h-4 w-4" />
          Profil
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
