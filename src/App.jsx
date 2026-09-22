import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { RequireAuth, RequireProfile, RedirectIfAuthed } from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Registro from './pages/Registro'
import RecuperarPassword from './pages/RecuperarPassword'
import RestablecerPassword from './pages/RestablecerPassword'
import CrearPerfil from './pages/CrearPerfil'
import Home from './pages/Home'
import Asignaturas from './pages/Asignaturas'
import DetalleAsignatura from './pages/DetalleAsignatura'
import DetalleRama from './pages/DetalleRama'
import DetalleTema from './pages/DetalleTema'
import Ejercitacion from './pages/Ejercitacion'
import Perfil from './pages/Perfil'
import Landing from './pages/Landing'

function FallbackRoute() {
  const { user, perfil } = useAuth()
  const destino = user ? (perfil ? '/inicio' : '/crear-perfil') : '/login'
  return <Navigate to={destino} replace />
}

function Shell() {
  return (
    <div className="app">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route element={<RedirectIfAuthed />}>
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/recuperar-password" element={<RecuperarPassword />} />
          </Route>

          <Route path="/restablecer-password" element={<RestablecerPassword />} />

          <Route element={<RequireAuth />}>
            <Route path="/crear-perfil" element={<CrearPerfil />} />

            <Route element={<RequireProfile />}>
              <Route path="/inicio" element={<Home />} />
              <Route path="/asignaturas" element={<Asignaturas />} />
              <Route path="/asignatura/:id" element={<DetalleAsignatura />} />
              <Route path="/rama/:id" element={<DetalleRama />} />
              <Route path="/tema/:id" element={<DetalleTema />} />
              <Route path="/tema/:id/ejercitacion" element={<Ejercitacion />} />
              <Route path="/perfil" element={<Perfil />} />
            </Route>
          </Route>

          <Route path="*" element={<FallbackRoute />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="*" element={<Shell />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}