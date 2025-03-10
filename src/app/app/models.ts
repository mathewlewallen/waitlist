
export interface Task {
  id: string;
  title: string;
  description?: string | null;
  is_completed: boolean;
  created_at: Date;
  updated_at: Date;
  project_id?: string | null;
  owner_id: string;
}

export interface Project {
  name: string;
  id: string;
  description: string | null;
  owner_id: string;
  created_at: Date;
  updated_at: Date;
  is_archived: boolean;
}