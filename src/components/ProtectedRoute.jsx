import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Loading from './Loading'

export function RequireAuth() {
  const { user, loading } = useAuth()

  if (loading) return <Loading text="Verificando sesión..." />
  if (!user) return <Navigate to="/login" replace />

  return <Outlet />
}

export function RequireProfile() {
  const { user, perfil, loading } = useAuth()

  if (loading) return <Loading text="Cargando perfil..." />
  if (!user) return <Navigate to="/login" replace />
  if (!perfil) return <Navigate to="/crear-perfil" replace />

  return <Outlet />
}

export function RedirectIfAuthed() {
  const { user, perfil, loading } = useAuth()

  if (loading) return <Loading text="Cargando..." />
  if (user) return <Navigate to={perfil ? '/inicio' : '/crear-perfil'} replace />

  return <Outlet />
}