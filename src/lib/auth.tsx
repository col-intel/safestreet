import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// Define the auth context type
type AuthContextType = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
};

// Create the auth context with default values
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
  loading: true,
});

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Admin credentials from environment variables
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'changeme';

// Internal Auth provider component that uses useNavigate
function AuthProviderWithNavigate({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('admin_token');
      setIsAuthenticated(!!token);
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call to validate credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Create a simple token (in a real app, this would be a JWT from the server)
      const token = btoa(`${email}:${new Date().getTime()}`);
      localStorage.setItem('admin_token', token);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    navigate('/'); // Redirect to home page after logout
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Export the AuthProvider without hooks for use in App.tsx
export function AuthProvider({ children }: AuthProviderProps) {
  return <AuthProviderWithNavigate>{children}</AuthProviderWithNavigate>;
}

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext); 