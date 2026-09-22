import { createContext, useContext, useEffect, useState } from 'react'
import { getSession, onAuthStateChange, asegurarUsuarioEnBase } from '../services/authService'
import { getPerfilEstudiante } from '../services/profileService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [usuarioDb, setUsuarioDb] = useState(null)
  const [perfil, setPerfil] = useState(null)
  const [loading, setLoading] = useState(true)

  async function cargarPerfil(idUsuario) {
    const { data } = await getPerfilEstudiante(idUsuario)
    setPerfil(data || null)
    return data || null
  }

  async function refrescarSesion() {
    const session = await getSession()
    setUser(session?.user ?? null)
    if (session?.user) {
      const dbUser = await asegurarUsuarioEnBase(session.user.email)
      setUsuarioDb(dbUser || null)
      if (dbUser) await cargarPerfil(dbUser.id)
    } else {
      setUsuarioDb(null)
      setPerfil(null)
    }
    setLoading(false)
  }

  useEffect(() => {
    refrescarSesion()
    const { data: subscription } = onAuthStateChange(() => refrescarSesion())
    return () => subscription?.subscription?.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, usuarioDb, perfil, loading, cargarPerfil, refrescarSesion }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)