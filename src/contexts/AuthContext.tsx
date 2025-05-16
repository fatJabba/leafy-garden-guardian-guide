
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  updatePassword: (newPassword: string) => Promise<{ error: any | null }>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
  updatePassword: async () => ({ error: null }),
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    if (authInitialized) return;
    
    console.log("Initializing auth...");
    
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.email || "no user");
        
        // Use synchronous state updates to prevent potential deadlocks
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setLoading(false);
          
          // Show success toast when user signs in, but only for actual sign-ins
          if (event === 'SIGNED_IN') {
            // Use setTimeout to prevent any possible race conditions
            setTimeout(() => {
              toast({
                title: "Signed in successfully",
                description: "Welcome to PlantPal!"
              });
            }, 0);
          }
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setLoading(false);
        } else if (event === 'USER_UPDATED') {
          // Handle user updates
          if (currentSession) {
            setUser(currentSession.user);
          }
        } else if (event === 'INITIAL_SESSION') {
          // Only update if we have a session
          if (currentSession) {
            setSession(currentSession);
            setUser(currentSession.user);
          }
          // Always mark loading as complete after INITIAL_SESSION
          setLoading(false);
        }
      }
    );

    // Then check for existing session - make this independent from the listener
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Got session:", currentSession ? `yes for ${currentSession.user.email}` : "no");
      
      if (currentSession) {
        setSession(currentSession);
        setUser(currentSession.user);
      }
      
      // Mark auth as initialized and not loading
      setAuthInitialized(true);
      setLoading(false);
    }).catch(error => {
      console.error("Error getting session:", error);
      setAuthInitialized(true);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [authInitialized]);

  const signOut = async () => {
    try {
      console.log("Signing out...");
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Explicitly clear state after signout
      setSession(null);
      setUser(null);
      
      toast({
        title: "Signed out successfully",
      });
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) {
        toast({
          title: "Error updating password",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }
      
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully."
      });
      
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Error updating password",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    }
  };

  const value = {
    session,
    user,
    loading,
    signOut,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
