import { Card, Container } from 'react-bootstrap'

export default function PedidoPage() {
  return (
    <main className="page">
      <Container>
        <div className="page-header">
          <div>
            <span className="eyebrow">Cliente</span>
            <h1>Meus pedidos</h1>
          </div>
        </div>
        <Card className="empty-state">
          <Card.Body>
            <h2>Historico em preparacao</h2>
            <p>A integracao completa de pedidos entra nas proximas sprints do frontend.</p>
          </Card.Body>
        </Card>
      </Container>
    </main>
  )
}
