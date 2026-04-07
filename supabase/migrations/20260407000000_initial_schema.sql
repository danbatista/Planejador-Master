CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TYPE user_role AS ENUM ('admin', 'trainer', 'assistant');
CREATE TYPE session_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');
CREATE TYPE payment_method AS ENUM ('pix', 'credit_card', 'cash', 'bank_transfer');
CREATE TYPE payment_status AS ENUM ('paid', 'pending', 'overdue');
CREATE TYPE service_kind AS ENUM (
  'private_lesson',
  'group_lesson',
  'boarding',
  'behavior_correction',
  'puppy_training',
  'custom'
);
CREATE TYPE notification_channel AS ENUM ('email', 'whatsapp', 'in_app');

CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  organization_id uuid REFERENCES organizations (id) ON DELETE CASCADE,
  email text,
  full_name text,
  phone text,
  avatar_url text,
  role user_role NOT NULL DEFAULT 'admin',
  work_hours jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE clients (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text,
  email text,
  address text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE dogs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES clients (id) ON DELETE CASCADE,
  name text NOT NULL,
  breed text,
  age_months integer,
  weight_kg numeric(6, 2),
  temperament text,
  behavioral_problems text,
  medical_notes text,
  training_goals text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
  name text NOT NULL,
  kind service_kind NOT NULL DEFAULT 'custom',
  description text,
  duration_minutes integer NOT NULL DEFAULT 60,
  price_cents integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE packages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price_cents integer NOT NULL DEFAULT 0,
  sessions_included integer NOT NULL DEFAULT 1,
  validity_days integer,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE training_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES clients (id) ON DELETE CASCADE,
  dog_id uuid NOT NULL REFERENCES dogs (id) ON DELETE CASCADE,
  trainer_id uuid NOT NULL REFERENCES profiles (id) ON DELETE RESTRICT,
  service_id uuid REFERENCES services (id) ON DELETE SET NULL,
  package_id uuid REFERENCES packages (id) ON DELETE SET NULL,
  title text,
  start_at timestamptz NOT NULL,
  end_at timestamptz NOT NULL,
  status session_status NOT NULL DEFAULT 'scheduled',
  attendance_confirmed boolean NOT NULL DEFAULT false,
  instructor_reminder_sent_at timestamptz,
  client_reminder_sent_at timestamptz,
  notes text,
  session_range tstzrange GENERATED ALWAYS AS (tstzrange(start_at, end_at, '[)')) STORED,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT training_sessions_time_ok CHECK (end_at > start_at),
  CONSTRAINT training_sessions_trainer_no_overlap EXCLUDE USING gist (
    organization_id WITH =,
    trainer_id WITH =,
    session_range WITH &&
  )
    WHERE (status = 'scheduled'),
  CONSTRAINT training_sessions_dog_no_overlap EXCLUDE USING gist (
    organization_id WITH =,
    dog_id WITH =,
    session_range WITH &&
  )
    WHERE (status = 'scheduled')
);

CREATE TABLE invoices (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES clients (id) ON DELETE CASCADE,
  invoice_number text NOT NULL,
  amount_cents integer NOT NULL DEFAULT 0,
  status payment_status NOT NULL DEFAULT 'pending',
  due_date date,
  line_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  issued_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz,
  UNIQUE (organization_id, invoice_number)
);

CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
  client_id uuid REFERENCES clients (id) ON DELETE SET NULL,
  invoice_id uuid REFERENCES invoices (id) ON DELETE SET NULL,
  amount_cents integer NOT NULL,
  method payment_method NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  reference text,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE expenses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
  category text NOT NULL,
  description text,
  amount_cents integer NOT NULL,
  incurred_at date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE progress_entries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
  dog_id uuid NOT NULL REFERENCES dogs (id) ON DELETE CASCADE,
  trainer_id uuid REFERENCES profiles (id) ON DELETE SET NULL,
  training_session_id uuid REFERENCES training_sessions (id) ON DELETE SET NULL,
  entry_type text NOT NULL DEFAULT 'note',
  title text,
  body text,
  goals text,
  behavior_improvement text,
  instructor_comment text,
  training_plan text,
  session_result text,
  media_urls jsonb NOT NULL DEFAULT '[]'::jsonb,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE generated_reports (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
  dog_id uuid NOT NULL REFERENCES dogs (id) ON DELETE CASCADE,
  created_by uuid REFERENCES profiles (id) ON DELETE SET NULL,
  report_type text NOT NULL DEFAULT 'client_pdf',
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles (id) ON DELETE CASCADE,
  channel notification_channel NOT NULL DEFAULT 'in_app',
  type text NOT NULL,
  title text NOT NULL,
  body text,
  read_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE activity_log (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
  actor_id uuid REFERENCES profiles (id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text,
  entity_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_clients_org ON clients (organization_id);
CREATE INDEX idx_dogs_org ON dogs (organization_id);
CREATE INDEX idx_dogs_client ON dogs (client_id);
CREATE INDEX idx_sessions_org_start ON training_sessions (organization_id, start_at);
CREATE INDEX idx_sessions_trainer ON training_sessions (trainer_id, start_at);
CREATE INDEX idx_payments_org ON payments (organization_id);
CREATE INDEX idx_invoices_org ON invoices (organization_id);
CREATE INDEX idx_progress_dog ON progress_entries (dog_id, recorded_at DESC);
CREATE INDEX idx_notifications_user ON notifications (user_id, read_at, created_at DESC);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE dogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.user_organization_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id FROM public.profiles WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.user_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$;

CREATE POLICY profiles_select ON profiles FOR SELECT USING (organization_id = user_organization_id() OR id = auth.uid());
CREATE POLICY profiles_update_self ON profiles FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY profiles_admin_update ON profiles FOR UPDATE USING (
  organization_id = user_organization_id() AND user_role() = 'admin'
) WITH CHECK (organization_id = user_organization_id());
CREATE POLICY profiles_admin_insert ON profiles FOR INSERT WITH CHECK (
  organization_id = user_organization_id() AND user_role() = 'admin'
);

CREATE POLICY org_select ON organizations FOR SELECT USING (id = user_organization_id());
CREATE POLICY org_update_admin ON organizations FOR UPDATE USING (id = user_organization_id() AND user_role() = 'admin');

CREATE POLICY clients_all ON clients FOR ALL USING (organization_id = user_organization_id()) WITH CHECK (organization_id = user_organization_id());
CREATE POLICY dogs_all ON dogs FOR ALL USING (organization_id = user_organization_id()) WITH CHECK (organization_id = user_organization_id());
CREATE POLICY services_all ON services FOR ALL USING (organization_id = user_organization_id()) WITH CHECK (organization_id = user_organization_id());
CREATE POLICY packages_all ON packages FOR ALL USING (organization_id = user_organization_id()) WITH CHECK (organization_id = user_organization_id());

CREATE POLICY sessions_select ON training_sessions FOR SELECT USING (organization_id = user_organization_id());
CREATE POLICY sessions_trainer_insert ON training_sessions FOR INSERT WITH CHECK (
  organization_id = user_organization_id()
  AND (
    user_role() = 'admin'
    OR (user_role() = 'trainer' AND trainer_id = auth.uid())
    OR user_role() = 'assistant'
  )
);
CREATE POLICY sessions_update ON training_sessions FOR UPDATE USING (organization_id = user_organization_id()) WITH CHECK (organization_id = user_organization_id());
CREATE POLICY sessions_delete ON training_sessions FOR DELETE USING (
  organization_id = user_organization_id() AND (user_role() = 'admin' OR user_role() = 'assistant')
);

CREATE POLICY invoices_all ON invoices FOR ALL USING (organization_id = user_organization_id()) WITH CHECK (organization_id = user_organization_id());
CREATE POLICY payments_all ON payments FOR ALL USING (organization_id = user_organization_id()) WITH CHECK (organization_id = user_organization_id());
CREATE POLICY expenses_all ON expenses FOR ALL USING (organization_id = user_organization_id()) WITH CHECK (organization_id = user_organization_id());
CREATE POLICY progress_all ON progress_entries FOR ALL USING (organization_id = user_organization_id()) WITH CHECK (organization_id = user_organization_id());
CREATE POLICY reports_all ON generated_reports FOR ALL USING (organization_id = user_organization_id()) WITH CHECK (organization_id = user_organization_id());

CREATE POLICY notifications_select ON notifications FOR SELECT USING (
  user_id = auth.uid() OR (organization_id = user_organization_id() AND user_id IS NULL)
);
CREATE POLICY notifications_insert ON notifications FOR INSERT WITH CHECK (organization_id = user_organization_id());
CREATE POLICY notifications_update ON notifications FOR UPDATE USING (user_id = auth.uid() OR organization_id = user_organization_id());

CREATE POLICY activity_select ON activity_log FOR SELECT USING (organization_id = user_organization_id());
CREATE POLICY activity_insert ON activity_log FOR INSERT WITH CHECK (organization_id = user_organization_id());

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    )
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(public.profiles.full_name, EXCLUDED.full_name),
    updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.slugify(t text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT lower(regexp_replace(trim(t), '[^a-zA-Z0-9]+', '-', 'g'))
$$;

CREATE OR REPLACE FUNCTION public.create_organization_for_user(org_name text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  oid uuid;
  base_slug text;
  final_slug text;
  n int := 0;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;
  IF EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND organization_id IS NOT NULL) THEN
    RAISE EXCEPTION 'organization already set';
  END IF;
  base_slug := slugify(org_name);
  final_slug := base_slug;
  WHILE EXISTS (SELECT 1 FROM organizations WHERE slug = final_slug) LOOP
    n := n + 1;
    final_slug := base_slug || '-' || n::text;
  END LOOP;
  INSERT INTO organizations (name, slug) VALUES (org_name, final_slug) RETURNING id INTO oid;
  UPDATE profiles SET organization_id = oid, role = 'admin', updated_at = now() WHERE id = auth.uid();
  RETURN oid;
END;
$$;

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_organization_for_user(text) TO authenticated;
