export type UserRole = "user" | "member" | "librarian"
export type WorkStatus = "pending" | "approved" | "rejected"
export type WorkType = "book" | "article" | "thesis" | "video" | "audio" | "document"
export type RequestStatus = "pending" | "approved" | "rejected"

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Work {
  id: string
  title: string
  author: string
  description: string | null
  type: WorkType
  cover_url: string | null
  file_url: string | null
  file_size: number | null
  isbn: string | null
  publication_year: number | null
  publisher: string | null
  status: WorkStatus
  submitted_by: string | null
  approved_by: string | null
  approved_at: string | null
  rejection_reason: string | null
  views_count: number
  downloads_count: number
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  description: string | null
  created_at: string
}

export interface WorkWithCategories extends Work {
  categories?: Category[]
  submitter?: Profile
}

export interface Borrow {
  id: string
  work_id: string
  user_id: string
  borrowed_at: string
  due_date: string
  returned_at: string | null
  is_active: boolean
  created_at: string
}

export interface Download {
  id: string
  work_id: string
  user_id: string | null
  downloaded_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: string
  read: boolean
  related_work_id: string | null
  created_at: string
}

export interface LibrarianRequest {
  id: string
  user_id: string
  status: RequestStatus
  motivation: string | null
  requested_at: string
  reviewed_at: string | null
  reviewed_by: string | null
  rejection_reason: string | null
}

export interface LibrarianRequestWithUser extends LibrarianRequest {
  user?: Profile
  reviewer?: Profile
}

export interface Favorite {
  id: string
  user_id: string
  work_id: string
  created_at: string
}

export interface FavoriteWithWork extends Favorite {
  work?: WorkWithCategories
}
