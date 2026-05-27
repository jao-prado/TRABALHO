import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ roles }) {
  const { autenticado, carregando, usuario } = useAuth()

  if (carregando) {
    return <main className="page"><p>Carregando...</p></main>
  }

  if (!autenticado) {
    return <Navigate to="/login" replace />
  }

  if (roles?.length && !roles.includes(usuario.role)) {
    return <Navigate to="/cardapio" replace />
  }

  return <Outlet />
}
