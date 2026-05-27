import { Card, Container } from 'react-bootstrap'

export default function AtendentePage() {
  return (
    <main className="page">
      <Container>
        <div className="page-header">
          <div>
            <span className="eyebrow">Atendimento</span>
            <h1>Pedidos da cozinha</h1>
          </div>
        </div>
        <Card className="empty-state">
          <Card.Body>
            <h2>Painel reservado</h2>
            <p>Esta area ja esta protegida por perfil e sera conectada aos pedidos na Sprint 8.</p>
          </Card.Body>
        </Card>
      </Container>
    </main>
  )
}
