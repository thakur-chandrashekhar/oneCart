import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './AuthContext'
import axios from 'axios'

export const userDataContext = createContext()
function UserContext({children}) {
    let [userData,setUserData] = useState(null)
    let {serverUrl} = useContext(authDataContext)

    const logout = async () => {
  try {
    await axios.get(
      serverUrl + "/api/auth/logout",
      { withCredentials: true }
    );

    setUserData(null); // 🔥 UI yahin se update hogi
  } catch (error) {
    console.log(error);
  }
};


   const getCurrentUser = async () => {
        try {
            let result = await axios.get(serverUrl + "/api/user/getcurrentuser",{withCredentials:true})

            setUserData(result.data)
            console.log(result.data)

        } catch (error) {
            setUserData(null)
            console.log(error)
        }
    }

    useEffect(()=>{
     getCurrentUser()
    },[])



    let value = {
     userData,setUserData,getCurrentUser, logout
    }
    
   
  return (
    <div>
      <userDataContext.Provider value={value}>
        {children}
      </userDataContext.Provider>
    </div>
  )
}

export default UserContext
