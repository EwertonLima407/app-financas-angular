export interface SharedSpace {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface SpaceMember {
  id: string;
  space_id: string;
  user_id: string;
  role: 'GESTOR' | 'VISUALIZADOR';
  user_name?: string;
  user_email?: string;
  created_at?: string;
}
