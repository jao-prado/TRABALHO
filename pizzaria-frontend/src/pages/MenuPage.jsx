import { useEffect, useState } from 'react'
import { Alert, Badge, Button, Card, Col, Container, Row, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { listarCategorias, listarProdutos } from '../services/produtoService'
import { formatarMoeda } from '../utils/formatters'

export default function MenuPage() {
  const { autenticado } = useAuth()
  const { adicionar, itens, totalItens, valorTotal } = useCart()
  const [produtos, setProdutos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [categoriaId, setCategoriaId] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregarBase() {
      try {
        const [categoriasData, produtosData] = await Promise.all([
          listarCategorias(),
          listarProdutos(categoriaId)
        ])
        setCategorias(categoriasData)
        setProdutos(produtosData)
      } catch {
        setErro('Nao foi possivel carregar o cardapio.')
      } finally {
        setCarregando(false)
      }
    }

    carregarBase()
  }, [categoriaId])

  return (
    <main className="page">
      <Container>
        <div className="page-header">
          <div>
            <span className="eyebrow">Cardapio</span>
            <h1>Produtos disponiveis</h1>
          </div>
          <div className="header-actions">
            <div className="category-filter">
              <Button variant={!categoriaId ? 'dark' : 'outline-dark'} size="sm" onClick={() => setCategoriaId('')}>Todos</Button>
              {categorias.map((categoria) => (
                <Button
                  key={categoria.id}
                  variant={String(categoria.id) === String(categoriaId) ? 'dark' : 'outline-dark'}
                  size="sm"
                  onClick={() => setCategoriaId(categoria.id)}
                >
                  {categoria.nome}
                </Button>
              ))}
            </div>
            {autenticado && totalItens > 0 && (
              <Button as={Link} to="/carrinho" variant="dark" size="sm">
                {totalItens} itens - {formatarMoeda(valorTotal)}
              </Button>
            )}
          </div>
        </div>

        {erro && <Alert variant="danger">{erro}</Alert>}
        {carregando ? (
          <div className="loading"><Spinner animation="border" /></div>
        ) : (
          <Row className="g-3">
            {produtos.map((produto) => (
              <Col md={6} xl={4} key={produto.id}>
                <Card className="product-card">
                  <Card.Body>
                    <div className="product-top">
                      <h2>{produto.nome}</h2>
                      <Badge bg="light" text="dark">{produto.categoria.nome}</Badge>
                    </div>
                    <p>{produto.descricao || 'Produto do cardapio.'}</p>
                    <div className="product-actions">
                      <strong>{formatarMoeda(produto.preco)}</strong>
                      {autenticado ? (
                        <Button variant="dark" size="sm" onClick={() => adicionar(produto)}>
                          Adicionar
                          {itens.find((item) => item.produto.id === produto.id)?.quantidade
                            ? ` (${itens.find((item) => item.produto.id === produto.id).quantidade})`
                            : ''}
                        </Button>
                      ) : (
                        <Button as={Link} to="/login" variant="outline-dark" size="sm">Entrar</Button>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </main>
  )
}
