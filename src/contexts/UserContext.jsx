// UserContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    companyName: "",
    userName: "",
    userStatus: "online",
  });

  useEffect(() => {
    // Simulando fetch de API:
    const fetchUserData = async () => {
      // Exemplo, substitua pela sua API real
      const data = {
        companyName: "Transportes Silva & Cia",
        userName: "João Silva",
        userStatus: "online",
      };
      setUserData(data);
    };
    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={userData}>{children}</UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
