import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './AuthContext'
import axios from 'axios'

export const userDataContext = createContext()

function UserContext({ children }) {

  const [userData, setUserData] = useState(null)
  const { serverUrl } = useContext(authDataContext)

  // 🔥 GET CURRENT USER (SAFE)
  const getCurrentUser = async () => {
    try {
      const result = await axios.get(
        serverUrl + "/api/user/getcurrentuser"
      );

      setUserData(result.data);

    } catch (error) {
      // ❗ sirf important error log karo
      if (error.response?.status !== 401) {
        console.log("GetUser Error:", error);
      }
      setUserData(null);
    }
  };

  // 🔥 LOGOUT
  const logout = async () => {
    try {
      await axios.get(serverUrl + "/api/auth/logout");
      setUserData(null);
    } catch (error) {
      console.log("Logout Error:", error);
    }
  };

  // 🔥 INITIAL LOAD
  useEffect(() => {
    getCurrentUser();
  }, []);

  const value = {
    userData,
    setUserData,
    getCurrentUser,
    logout
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;
