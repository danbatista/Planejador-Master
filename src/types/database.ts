export type UserRole = "admin" | "trainer" | "assistant";
export type SessionStatus = "scheduled" | "completed" | "cancelled" | "no_show";
export type PaymentMethod = "pix" | "credit_card" | "cash" | "bank_transfer";
export type PaymentStatus = "paid" | "pending" | "overdue";
export type ServiceKind =
  | "private_lesson"
  | "group_lesson"
  | "boarding"
  | "behavior_correction"
  | "puppy_training"
  | "custom";

export type Organization = {
  id: string;
  name: string;
  slug: string;
  settings: Record<string, unknown>;
  created_at: string;
};

export type Profile = {
  id: string;
  organization_id: string | null;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  work_hours: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export type Client = {
  id: string;
  organization_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Dog = {
  id: string;
  organization_id: string;
  client_id: string;
  name: string;
  breed: string | null;
  age_months: number | null;
  weight_kg: number | null;
  temperament: string | null;
  behavioral_problems: string | null;
  medical_notes: string | null;
  training_goals: string | null;
  created_at: string;
  updated_at: string;
};

export type Service = {
  id: string;
  organization_id: string;
  name: string;
  kind: ServiceKind;
  description: string | null;
  duration_minutes: number;
  price_cents: number;
  active: boolean;
  created_at: string;
};

export type Package = {
  id: string;
  organization_id: string;
  name: string;
  description: string | null;
  price_cents: number;
  sessions_included: number;
  validity_days: number | null;
  active: boolean;
  created_at: string;
};

export type TrainingSession = {
  id: string;
  organization_id: string;
  client_id: string;
  dog_id: string;
  trainer_id: string;
  service_id: string | null;
  package_id: string | null;
  title: string | null;
  start_at: string;
  end_at: string;
  status: SessionStatus;
  attendance_confirmed: boolean;
  instructor_reminder_sent_at: string | null;
  client_reminder_sent_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Invoice = {
  id: string;
  organization_id: string;
  client_id: string;
  invoice_number: string;
  amount_cents: number;
  status: PaymentStatus;
  due_date: string | null;
  line_items: unknown[];
  issued_at: string;
  paid_at: string | null;
};

export type Payment = {
  id: string;
  organization_id: string;
  client_id: string | null;
  invoice_id: string | null;
  amount_cents: number;
  method: PaymentMethod;
  status: PaymentStatus;
  reference: string | null;
  paid_at: string | null;
  created_at: string;
};

export type Expense = {
  id: string;
  organization_id: string;
  category: string;
  description: string | null;
  amount_cents: number;
  incurred_at: string;
  created_at: string;
};

export type ProgressEntry = {
  id: string;
  organization_id: string;
  dog_id: string;
  trainer_id: string | null;
  training_session_id: string | null;
  entry_type: string;
  title: string | null;
  body: string | null;
  goals: string | null;
  behavior_improvement: string | null;
  instructor_comment: string | null;
  training_plan: string | null;
  session_result: string | null;
  media_urls: string[];
  recorded_at: string;
  created_at: string;
};

export type NotificationRow = {
  id: string;
  organization_id: string;
  user_id: string | null;
  channel: string;
  type: string;
  title: string;
  body: string | null;
  read_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};
