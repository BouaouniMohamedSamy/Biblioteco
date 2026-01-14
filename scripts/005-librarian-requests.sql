-- Create table for librarian role requests
CREATE TABLE IF NOT EXISTS librarian_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  motivation TEXT,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES profiles(id),
  rejection_reason TEXT,
  UNIQUE(user_id, status)
);

-- Enable RLS
ALTER TABLE librarian_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own requests
CREATE POLICY "Users can view own requests"
  ON librarian_requests
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Authenticated users can create requests
CREATE POLICY "Authenticated users can create requests"
  ON librarian_requests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Librarians can view all requests
CREATE POLICY "Librarians can view all requests"
  ON librarian_requests
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'librarian'
    )
  );

-- Policy: Librarians can update requests
CREATE POLICY "Librarians can update requests"
  ON librarian_requests
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'librarian'
    )
  );

-- Create index for faster queries
CREATE INDEX idx_librarian_requests_user_id ON librarian_requests(user_id);
CREATE INDEX idx_librarian_requests_status ON librarian_requests(status);
