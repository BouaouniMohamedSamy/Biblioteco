import { createClient } from "@/lib/supabase/client"
import type { LibrarianRequest, LibrarianRequestWithUser } from "@/lib/types/database"

class LibrarianRequestService {
  /**
   * Create a new librarian role request
   */
  async createRequest(userId: string, motivation: string): Promise<LibrarianRequest> {
    const supabase = createClient()

    // Check if user already has a pending request
    const { data: existingRequest } = await supabase
      .from("librarian_requests")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "pending")
      .maybeSingle()

    if (existingRequest) {
      throw new Error("Vous avez déjà une demande en attente")
    }

    const { data, error } = await supabase
      .from("librarian_requests")
      .insert({
        user_id: userId,
        motivation,
        status: "pending",
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  /**
   * Get user's current request
   */
  async getUserRequest(userId: string): Promise<LibrarianRequest | null> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("librarian_requests")
      .select("*")
      .eq("user_id", userId)
      .order("requested_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) throw error
    return data
  }

  /**
   * Get all pending requests (librarians only)
   */
  async getPendingRequests(): Promise<LibrarianRequestWithUser[]> {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("librarian_requests")
      .select(`
        *,
        user:profiles!librarian_requests_user_id_fkey(*)
      `)
      .eq("status", "pending")
      .order("requested_at", { ascending: true })

    if (error) throw error
    return data || []
  }

  /**
   * Get all requests with filters (librarians only)
   */
  async getAllRequests(status?: string): Promise<LibrarianRequestWithUser[]> {
    const supabase = createClient()

    let query = supabase
      .from("librarian_requests")
      .select(`
        *,
        user:profiles!librarian_requests_user_id_fkey(*),
        reviewer:profiles!librarian_requests_reviewed_by_fkey(*)
      `)
      .order("requested_at", { ascending: false })

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  }

  /**
   * Approve a librarian request (librarians only)
   */
  async approveRequest(requestId: string, reviewerId: string): Promise<void> {
    const supabase = createClient()

    // Get the request
    const { data: request, error: fetchError } = await supabase
      .from("librarian_requests")
      .select("user_id")
      .eq("id", requestId)
      .single()

    if (fetchError) throw fetchError

    // Update request status
    const { error: updateError } = await supabase
      .from("librarian_requests")
      .update({
        status: "approved",
        reviewed_at: new Date().toISOString(),
        reviewed_by: reviewerId,
      })
      .eq("id", requestId)

    if (updateError) throw updateError

    // Update user role to librarian
    const { error: roleError } = await supabase.from("profiles").update({ role: "librarian" }).eq("id", request.user_id)

    if (roleError) throw roleError
  }

  /**
   * Reject a librarian request (librarians only)
   */
  async rejectRequest(requestId: string, reviewerId: string, rejectionReason: string): Promise<void> {
    const supabase = createClient()

    const { error } = await supabase
      .from("librarian_requests")
      .update({
        status: "rejected",
        reviewed_at: new Date().toISOString(),
        reviewed_by: reviewerId,
        rejection_reason: rejectionReason,
      })
      .eq("id", requestId)

    if (error) throw error
  }

  /**
   * Cancel a pending request
   */
  async cancelRequest(requestId: string, userId: string): Promise<void> {
    const supabase = createClient()

    const { error } = await supabase
      .from("librarian_requests")
      .delete()
      .eq("id", requestId)
      .eq("user_id", userId)
      .eq("status", "pending")

    if (error) throw error
  }
}

export const librarianRequestService = new LibrarianRequestService()
