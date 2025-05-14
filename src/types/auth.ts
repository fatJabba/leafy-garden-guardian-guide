
import { User } from "@supabase/supabase-js";

export type Profile = {
  id: string;
  username: string | null;
  avatar_url: string | null;
};

export type AuthUser = User | null;

export type AuthContextType = {
  user: AuthUser;
  profile: Profile | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<{
    error: Error | null;
    data: any | null;
  }>;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: any | null;
  }>;
  signOut: () => Promise<void>;
};
