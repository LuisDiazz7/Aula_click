import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { signOut } from '../services/authService'
import { IconBot } from '../utils/icons'

export default function Navbar() {
  const { user, perfil } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    await signOut()
    setOpen(false)
    navigate('/login')
  }

  const linkClass = ({ isActive }) =>
    isActive ? 'nav-link active' : 'nav-link'

  const inicial = perfil?.nombre?.charAt(0)?.toUpperCase() || 'E'

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to={user ? '/inicio' : '/'} className="brand" onClick={() => setOpen(false)}>
          <span className="brand-logo">A</span>
          <span className="brand-name">Aula Click</span>
        </Link>

        {user && (
          <>
            <button
              className="nav-toggle"
              onClick={() => setOpen((v) => !v)}
              aria-label="Abrir menú"
              aria-expanded={open}
            >
              <span></span><span></span><span></span>
            </button>

            <nav className={`nav-menu ${open ? 'open' : ''}`}>
              <NavLink to="/inicio" className={linkClass} onClick={() => setOpen(false)}>
                Inicio
              </NavLink>
              <NavLink to="/asignaturas" className={linkClass} onClick={() => setOpen(false)}>
                Asignaturas
              </NavLink>
              <NavLink
                to="/tutor-ia"
                className={`${linkClass} nav-link-icon`}
                onClick={() => setOpen(false)}
              >
                <IconBot aria-hidden="true" />
                Tutor IA
              </NavLink>
              <NavLink to="/perfil" className={linkClass} onClick={() => setOpen(false)}>
                Mi perfil
              </NavLink>
              {perfil?.nombre ? (
                <Link to="/perfil" className="nav-profile" onClick={() => setOpen(false)}>
                  <span className="nav-avatar">{inicial}</span>
                  <span className="nav-profile-name">Hola, {perfil.nombre.split(' ')[0]}</span>
                </Link>
              ) : null}
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                Salir
              </button>
            </nav>
          </>
        )}
      </div>
    </header>
  )
}