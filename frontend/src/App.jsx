import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import AdminPage from './pages/AdminPage'
import AtendentePage from './pages/AtendentePage'
import CadastroPage from './pages/CadastroPage'
import CarrinhoPage from './pages/CarrinhoPage'
import CheckoutPage from './pages/CheckoutPage'
import LoginPage from './pages/LoginPage'
import MenuPage from './pages/MenuPage'
import PedidoPage from './pages/PedidoPage'
import ProtectedRoute from './routes/ProtectedRoute'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/cardapio" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastro" element={<CadastroPage />} />
            <Route element={<AppLayout />}>
              <Route path="/cardapio" element={<MenuPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/carrinho" element={<CarrinhoPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/pedidos" element={<PedidoPage />} />
              </Route>
              <Route element={<ProtectedRoute roles={['ATENDENTE', 'ADMIN']} />}>
                <Route path="/atendente" element={<AtendentePage />} />
              </Route>
              <Route element={<ProtectedRoute roles={['ADMIN']} />}>
                <Route path="/admin" element={<AdminPage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/cardapio" />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}
export default App
