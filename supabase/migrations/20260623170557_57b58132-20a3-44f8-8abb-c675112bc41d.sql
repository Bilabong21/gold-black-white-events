
-- Update signup trigger: auto-approve non-secretary emails
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name, phone, status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    CASE WHEN lower(NEW.email) LIKE '%secretary%' THEN 'pending' ELSE 'approved' END
  );
  RETURN NEW;
END;
$function$;

-- Ensure trigger exists on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Public (anon) read access for events and church_groups
GRANT SELECT ON public.events TO anon;
GRANT SELECT ON public.church_groups TO anon;

DROP POLICY IF EXISTS "Events viewable by authenticated" ON public.events;
CREATE POLICY "Events viewable by everyone"
ON public.events FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Church groups viewable by authenticated" ON public.church_groups;
CREATE POLICY "Church groups viewable by everyone"
ON public.church_groups FOR SELECT
TO anon, authenticated
USING (true);
