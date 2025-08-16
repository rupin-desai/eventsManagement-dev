import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface AuthContextType {
  isAuthenticated: boolean;
  role: string;
  employeeId: string | null;
  currentUser: any;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  role: "UNKNOWN",
  employeeId: null,
  currentUser: null,
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState("UNKNOWN");
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // On mount, check for dummy user in localStorage
    const user = localStorage.getItem('dummyUser');
    if (user) {
      const parsed = JSON.parse(user);
      setIsAuthenticated(true);
      setRole(parsed.role || "USER");
      setEmployeeId(parsed.empcode);
      setCurrentUser(parsed);
    } else {
      setIsAuthenticated(false);
      setRole("UNKNOWN");
      setEmployeeId(null);
      setCurrentUser(null);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('dummyUser');
    setIsAuthenticated(false);
    setRole("UNKNOWN");
    setEmployeeId(null);
    setCurrentUser(null);
    navigate("/login");
  };

  // Simple route protection
  useEffect(() => {
    // REMOVE real auth check for static template
    // if (!isAuthenticated && location.pathname !== "/login") {
    //   navigate("/login");
    // }
    // if (isAuthenticated && role === "USER" && location.pathname.startsWith("/admin")) {
    //   navigate("/");
    // }
  }, [isAuthenticated, role, location.pathname, navigate]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, employeeId, currentUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);