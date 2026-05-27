import { useEffect, useState } from 'react'
import { Alert, Badge, Button, Card, Container, Form, Spinner } from 'react-bootstrap'
import { alterarStatusPedido, listarPedidos } from '../services/pedidoService'
import { formatarMoeda } from '../utils/formatters'

const statusList = [
  'PENDENTE',
  'CONFIRMADO',
  'EM_PREPARO',
  'SAIU_PARA_ENTREGA',
  'ENTREGUE',
  'CANCELADO'
]

const statusVariant = {
  PENDENTE: 'warning',
  CONFIRMADO: 'info',
  EM_PREPARO: 'primary',
  SAIU_PARA_ENTREGA: 'dark',
  ENTREGUE: 'success',
  CANCELADO: 'danger'
}

export default function AtendentePage() {
  const [pedidos, setPedidos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  async function carregarPedidos() {
    setErro('')
    try {
      setPedidos(await listarPedidos())
    } catch {
      setErro('Nao foi possivel carregar os pedidos.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarPedidos()
  }, [])

  async function atualizarStatus(id, status) {
    try {
      const pedidoAtualizado = await alterarStatusPedido(id, status)
      setPedidos((atuais) => atuais.map((pedido) => (
        pedido.id === id ? pedidoAtualizado : pedido
      )))
    } catch {
      setErro('Nao foi possivel atualizar o status.')
    }
  }

  return (
    <main className="page">
      <Container>
        <div className="page-header">
          <div>
            <span className="eyebrow">Atendimento</span>
            <h1>Pedidos da cozinha</h1>
          </div>
          <Button variant="outline-dark" size="sm" onClick={carregarPedidos}>Atualizar</Button>
        </div>

        {erro && <Alert variant="danger">{erro}</Alert>}

        {carregando ? (
          <div className="loading"><Spinner animation="border" /></div>
        ) : pedidos.length === 0 ? (
          <Card className="empty-state">
            <Card.Body>
              <h2>Nenhum pedido aberto</h2>
              <p>Os pedidos criados pelos clientes aparecerao aqui.</p>
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
                      <p>{pedido.usuario.nome} - {new Date(pedido.createdAt).toLocaleString('pt-BR')}</p>
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
                  <div className="attendant-footer">
                    <div>
                      <span>{pedido.enderecoEntrega.rua}, {pedido.enderecoEntrega.numero}</span>
                      <strong>{formatarMoeda(pedido.valorTotal)}</strong>
                    </div>
                    <Form.Select
                      value={pedido.status}
                      onChange={(event) => atualizarStatus(pedido.id, event.target.value)}
                    >
                      {statusList.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </Form.Select>
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
