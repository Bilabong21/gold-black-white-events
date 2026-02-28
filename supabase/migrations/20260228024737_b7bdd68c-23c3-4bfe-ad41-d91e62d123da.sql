
-- Add status to profiles for approval workflow
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending';

-- Update existing profiles to approved
UPDATE public.profiles SET status = 'approved' WHERE status = 'pending';

-- Add status to events for moderation
-- (already has 'status' column, but let's ensure it's usable)

-- Allow admins to update profiles (for approval)
CREATE POLICY "Admins can update all profiles"
ON public.profiles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
