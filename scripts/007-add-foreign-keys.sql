-- Add missing foreign keys to works table
ALTER TABLE works
ADD CONSTRAINT works_submitted_by_fkey 
FOREIGN KEY (submitted_by) REFERENCES profiles(id) ON DELETE SET NULL;

ALTER TABLE works
ADD CONSTRAINT works_approved_by_fkey 
FOREIGN KEY (approved_by) REFERENCES profiles(id) ON DELETE SET NULL;

-- Add missing foreign keys to borrows table (if needed)
ALTER TABLE borrows
ADD CONSTRAINT borrows_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE borrows
ADD CONSTRAINT borrows_work_id_fkey 
FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE CASCADE;

-- Add missing foreign keys to downloads table (if needed)
ALTER TABLE downloads
ADD CONSTRAINT downloads_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE downloads
ADD CONSTRAINT downloads_work_id_fkey 
FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE CASCADE;

-- Add missing foreign keys to librarian_requests table (if needed)
ALTER TABLE librarian_requests
ADD CONSTRAINT librarian_requests_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE librarian_requests
ADD CONSTRAINT librarian_requests_reviewed_by_fkey 
FOREIGN KEY (reviewed_by) REFERENCES profiles(id) ON DELETE SET NULL;
