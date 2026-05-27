import { Button, Container, Nav, Navbar } from 'react-bootstrap'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'

export default function AppNavbar() {
  const { autenticado, logout, usuario } = useAuth()
  const { totalItens } = useCart()
  const navigate = useNavigate()

  function sair() {
    logout()
    navigate('/login')
  }

  return (
    <Navbar expand="lg" className="app-navbar">
      <Container>
        <Navbar.Brand as={NavLink} to="/cardapio" className="brand">
          Pizzaria Barueri
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/cardapio">Cardapio</Nav.Link>
            {autenticado && <Nav.Link as={NavLink} to="/carrinho">Carrinho ({totalItens})</Nav.Link>}
            {autenticado && <Nav.Link as={NavLink} to="/pedidos">Meus pedidos</Nav.Link>}
            {['ATENDENTE', 'ADMIN'].includes(usuario?.role) && (
              <Nav.Link as={NavLink} to="/atendente">Atendente</Nav.Link>
            )}
            {usuario?.role === 'ADMIN' && <Nav.Link as={NavLink} to="/admin">Admin</Nav.Link>}
          </Nav>
          <Nav className="align-items-lg-center gap-2">
            {autenticado ? (
              <>
                <span className="user-badge">{usuario.nome}</span>
                <Button variant="outline-dark" size="sm" onClick={sair}>Sair</Button>
              </>
            ) : (
              <>
                <Button variant="outline-dark" size="sm" onClick={() => navigate('/login')}>Entrar</Button>
                <Button variant="dark" size="sm" onClick={() => navigate('/cadastro')}>Cadastrar</Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
