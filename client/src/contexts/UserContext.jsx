import { createContext, useContext } from "react";
import { useSelector } from "react-redux";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";
  const isTeacher = user?.role === "teacher";
  const isCustomer = user?.role === "customer";

  const value = {
    user,
    isAuthenticated,
    isAdmin,
    isTeacher,
    isCustomer,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export default UserContext;
