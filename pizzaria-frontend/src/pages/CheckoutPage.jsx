import { Card, Container } from 'react-bootstrap'

export default function CheckoutPage() {
  return (
    <main className="page">
      <Container>
        <div className="page-header">
          <div>
            <span className="eyebrow">Finalizacao</span>
            <h1>Finalizar pedido</h1>
          </div>
        </div>
        <Card className="empty-state">
          <Card.Body>
            <h2>Proxima sprint</h2>
            <p>Enderecos, forma de pagamento e envio ao backend entram na Sprint 7.</p>
          </Card.Body>
        </Card>
      </Container>
    </main>
  )
}
