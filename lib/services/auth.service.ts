/**
 * Service d'authentification
 * Gère les opérations d'authentification et de gestion des utilisateurs
 * Pattern: Service Layer (Architecture orientée objet)
 */

import { createClient } from "@/lib/supabase/client"
import type { UserRole, Profile } from "@/lib/types/database"

export class AuthService {
  /**
   * Inscription d'un nouvel utilisateur
   */
  async signUp(email: string, password: string, fullName: string, role: UserRole = "user") {
    console.log("[v0] Starting signup process for:", email)
    const supabase = createClient()

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
        },
      })

      if (error) {
        console.error("[v0] Signup error:", error)
        throw error
      }

      console.log("[v0] Signup successful, user created:", data.user?.id)
      return data
    } catch (error) {
      console.error("[v0] Exception during signup:", error)
      throw error
    }
  }

  /**
   * Connexion d'un utilisateur
   */
  async signIn(email: string, password: string) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  }

  /**
   * Déconnexion
   */
  async signOut() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  /**
   * Récupération de l'utilisateur courant
   */
  async getCurrentUser() {
    const supabase = createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error) throw error
    return user
  }

  /**
   * Récupération du profil complet de l'utilisateur
   */
  async getCurrentProfile(): Promise<Profile | null> {
    const supabase = createClient()
    const user = await this.getCurrentUser()
    if (!user) return null

    const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (error) throw error
    return data
  }

  /**
   * Mise à jour du profil utilisateur
   */
  async updateProfile(userId: string, updates: Partial<Profile>) {
    const supabase = createClient()
    const { data, error } = await supabase.from("profiles").update(updates).eq("id", userId).select().single()

    if (error) throw error
    return data
  }

  /**
   * Vérification du rôle utilisateur
   */
  async hasRole(role: UserRole): Promise<boolean> {
    const profile = await this.getCurrentProfile()
    return profile?.role === role
  }

  /**
   * Vérification si l'utilisateur est au moins membre
   */
  async isMemberOrAbove(): Promise<boolean> {
    const profile = await this.getCurrentProfile()
    return profile?.role === "member" || profile?.role === "librarian"
  }

  /**
   * Vérification si l'utilisateur est bibliothécaire
   */
  async isLibrarian(): Promise<boolean> {
    const profile = await this.getCurrentProfile()
    return profile?.role === "librarian"
  }
}

export const authService = new AuthService()
