import React from 'react'
import { createContext } from 'react'
import axios from "axios";   // ✅ add this

export const authDataContext = createContext()

function AuthContext({ children }) {

    let serverUrl = import.meta.env.VITE_BACKEND_URL;

    // 🔥 IMPORTANT FIX
    axios.defaults.withCredentials = true;

    let value = {
        serverUrl
    }

    return (
        <authDataContext.Provider value={value}>
            {children}
        </authDataContext.Provider>
    )
}

export default AuthContext
