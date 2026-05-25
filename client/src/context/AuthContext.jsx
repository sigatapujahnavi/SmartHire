// client/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react"
import api from '../services/api' 

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On app load, check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/api/auth/me" )
        setUser(res.data.user)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const login = (userData) => setUser(userData)

  const logout = async () => {
    await api.post("/api/auth/logout", {} )
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)