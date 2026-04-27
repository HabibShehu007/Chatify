// src/types/User.ts
export interface User {
  id: string;
  fullName: string;
  avatar?: string | null;
}

export interface UserProfile extends User {
  email: string;
  username?: string;
  phone?: string;
  createdAt?: string;
  user_id?: string; // matches Supabase table column

  // ✅ New profile fields for "Detailed Information"
  bio?: string;
  profession?: string;
  state?: string;
  country?: string;
}
