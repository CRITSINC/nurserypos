export interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  image_url?: string | null;
  role: string;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;

  oldPassword?: string;
  newPassword?: string;
}

export interface UpdateProfileResponse {
  message: string;
  user: Profile;
}