import { Card, Container } from 'react-bootstrap'

export default function AdminPage() {
  return (
    <main className="page">
      <Container>
        <div className="page-header">
          <div>
            <span className="eyebrow">Administracao</span>
            <h1>Gestao do sistema</h1>
          </div>
        </div>
        <Card className="empty-state">
          <Card.Body>
            <h2>Painel admin reservado</h2>
            <p>Esta area ja esta protegida por perfil e recebera CRUD visual nas proximas sprints.</p>
          </Card.Body>
        </Card>
      </Container>
    </main>
  )
}
