import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { formatarMoeda } from '../utils/formatters'

export default function CarrinhoPage() {
  const { itens, valorTotal, alterarQuantidade, remover, limpar } = useCart()

  return (
    <main className="page">
      <Container>
        <div className="page-header">
          <div>
            <span className="eyebrow">Carrinho</span>
            <h1>Resumo do pedido</h1>
          </div>
          {itens.length > 0 && (
            <Button variant="outline-dark" size="sm" onClick={limpar}>Limpar</Button>
          )}
        </div>

        {itens.length === 0 ? (
          <Card className="empty-state">
            <Card.Body>
              <h2>Carrinho vazio</h2>
              <p>Escolha produtos no cardapio para montar seu pedido.</p>
              <Button as={Link} to="/cardapio" variant="dark" className="mt-3">Ver cardapio</Button>
            </Card.Body>
          </Card>
        ) : (
          <Row className="g-4">
            <Col lg={8}>
              <div className="cart-list">
                {itens.map((item) => (
                  <Card className="cart-item" key={item.produto.id}>
                    <Card.Body>
                      <div>
                        <h2>{item.produto.nome}</h2>
                        <p>{item.produto.categoria.nome}</p>
                      </div>
                      <div className="quantity-control">
                        <Button
                          variant="outline-dark"
                          size="sm"
                          onClick={() => alterarQuantidade(item.produto.id, item.quantidade - 1)}
                        >
                          -
                        </Button>
                        <span>{item.quantidade}</span>
                        <Button
                          variant="outline-dark"
                          size="sm"
                          onClick={() => alterarQuantidade(item.produto.id, item.quantidade + 1)}
                        >
                          +
                        </Button>
                      </div>
                      <strong>{formatarMoeda(Number(item.produto.preco) * item.quantidade)}</strong>
                      <Button variant="link" className="remove-link" onClick={() => remover(item.produto.id)}>
                        Remover
                      </Button>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Col>
            <Col lg={4}>
              <Card className="cart-summary">
                <Card.Body>
                  <h2>Total</h2>
                  <strong>{formatarMoeda(valorTotal)}</strong>
                  <Button as={Link} to="/checkout" variant="dark" className="w-100 mt-3">
                    Continuar
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </main>
  )
}
