import { useEffect, useState } from 'react'
import { Alert, Badge, Card, Container, Spinner } from 'react-bootstrap'
import { listarMeusPedidos } from '../services/pedidoService'
import { formatarMoeda } from '../utils/formatters'

const statusVariant = {
  PENDENTE: 'warning',
  CONFIRMADO: 'info',
  EM_PREPARO: 'primary',
  SAIU_PARA_ENTREGA: 'dark',
  ENTREGUE: 'success',
  CANCELADO: 'danger'
}

export default function PedidoPage() {
  const [pedidos, setPedidos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregarPedidos() {
      try {
        const data = await listarMeusPedidos()
        setPedidos(data)
      } catch {
        setErro('Nao foi possivel carregar seus pedidos.')
      } finally {
        setCarregando(false)
      }
    }

    carregarPedidos()
  }, [])

  return (
    <main className="page">
      <Container>
        <div className="page-header">
          <div>
            <span className="eyebrow">Cliente</span>
            <h1>Meus pedidos</h1>
          </div>
        </div>

        {erro && <Alert variant="danger">{erro}</Alert>}

        {carregando ? (
          <div className="loading"><Spinner animation="border" /></div>
        ) : pedidos.length === 0 ? (
          <Card className="empty-state">
            <Card.Body>
              <h2>Nenhum pedido encontrado</h2>
              <p>Seus pedidos finalizados aparecerao aqui.</p>
            </Card.Body>
          </Card>
        ) : (
          <div className="orders-list">
            {pedidos.map((pedido) => (
              <Card className="order-card" key={pedido.id}>
                <Card.Body>
                  <div className="order-header">
                    <div>
                      <h2>Pedido #{pedido.id}</h2>
                      <p>{new Date(pedido.createdAt).toLocaleString('pt-BR')}</p>
                    </div>
                    <Badge bg={statusVariant[pedido.status] || 'secondary'}>{pedido.status}</Badge>
                  </div>
                  <div className="order-items">
                    {pedido.itens.map((item) => (
                      <div key={item.id}>
                        <span>{item.quantidade}x {item.produtoNome}</span>
                        <strong>{formatarMoeda(item.subtotal)}</strong>
                      </div>
                    ))}
                  </div>
                  <div className="order-footer">
                    <span>{pedido.enderecoEntrega.rua}, {pedido.enderecoEntrega.numero}</span>
                    <strong>{formatarMoeda(pedido.valorTotal)}</strong>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </main>
  )
}
