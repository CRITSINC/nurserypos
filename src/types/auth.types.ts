export interface Permission {
  id: number;
  role_id: number;
  menu: string;
  create: boolean;
  edit: boolean;
  view: boolean;
  delete: boolean;
}

export interface Role {
  id: number;
  role: string;
  permissions: Permission[];
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_email_verified: boolean;
  role: number;

  roles: Role;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface AuthState {
  accessToken: string | null;
  user: User | null;
}
