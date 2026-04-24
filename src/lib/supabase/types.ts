export type DocumentStatus = "pending" | "completed" | "signed" | "in_progress";
export type BuildingAccessStatus = "pending" | "active" | "scheduled";

export type Employee = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  preferred_name: string | null;
  pronouns: string | null;
  mobile_phone: string | null;
  work_phone: string | null;
  work_phone_ext: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  tshirt_size: string | null;
  department: string | null;
  job_title: string | null;
  start_date: string | null;
  location: string | null;
  manager_id: string | null;
  is_hr_admin: boolean;
  is_it_admin: boolean;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type OnboardingSession = {
  id: string;
  employee_id: string;
  current_step: number;
  completed_steps: number[] | null;
  is_complete: boolean;
  started_at: string;
  submitted_at: string | null;
  last_activity_at: string;
  created_at: string;
  updated_at: string;
};

export type SystemAccess = {
  id: string;
  employee_id: string;
  system_key: string;
  system_name: string;
  system_icon: string | null;
  description: string | null;
  is_required: boolean;
  is_requested: boolean;
  provisioned_at: string | null;
  provisioned_by: string | null;
  notes: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type HrDocument = {
  id: string;
  employee_id: string;
  document_key: string;
  document_name: string;
  document_icon: string | null;
  is_required: boolean;
  status: DocumentStatus;
  completed_at: string | null;
  file_url: string | null;
  external_url: string | null;
  notes: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type EquipmentItem = {
  id: string;
  employee_id: string;
  item_key: string;
  item_name: string;
  item_icon: string | null;
  item_detail: string | null;
  serial_number: string | null;
  is_received: boolean;
  received_at: string | null;
  assigned_by: string | null;
  notes: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type BuildingAccessItem = {
  id: string;
  employee_id: string;
  access_key: string;
  access_name: string;
  access_icon: string | null;
  access_detail: string | null;
  assigned_value: string | null;
  status: BuildingAccessStatus;
  available_date: string | null;
  notes: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};
