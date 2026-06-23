
CREATE TABLE public.branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text,
  province text NOT NULL CHECK (province IN ('GP','NW','FS','NC')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(name, province)
);

GRANT SELECT ON public.branches TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.branches TO authenticated;
GRANT ALL ON public.branches TO service_role;

ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Branches viewable by everyone" ON public.branches
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admins can manage branches" ON public.branches
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER update_branches_updated_at
  BEFORE UPDATE ON public.branches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial 27 branches
INSERT INTO public.branches (name, city, province) VALUES
  ('Johannesburg Central','Johannesburg','GP'),
  ('Soweto','Soweto','GP'),
  ('Pretoria North','Pretoria','GP'),
  ('Pretoria East','Pretoria','GP'),
  ('Tembisa','Tembisa','GP'),
  ('Vereeniging','Vereeniging','GP'),
  ('Krugersdorp','Krugersdorp','GP'),
  ('Benoni','Benoni','GP'),
  ('Mamelodi','Pretoria','GP'),
  ('Mahikeng','Mahikeng','NW'),
  ('Rustenburg','Rustenburg','NW'),
  ('Klerksdorp','Klerksdorp','NW'),
  ('Potchefstroom','Potchefstroom','NW'),
  ('Brits','Brits','NW'),
  ('Vryburg','Vryburg','NW'),
  ('Bloemfontein Central','Bloemfontein','FS'),
  ('Botshabelo','Botshabelo','FS'),
  ('Welkom','Welkom','FS'),
  ('Bethlehem','Bethlehem','FS'),
  ('Kroonstad','Kroonstad','FS'),
  ('Sasolburg','Sasolburg','FS'),
  ('QwaQwa','QwaQwa','FS'),
  ('Kimberley','Kimberley','NC'),
  ('Upington','Upington','NC'),
  ('Kuruman','Kuruman','NC'),
  ('De Aar','De Aar','NC'),
  ('Springbok','Springbok','NC')
ON CONFLICT DO NOTHING;
