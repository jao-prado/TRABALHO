import { useEffect, useState } from 'react'
import { Alert, Badge, Button, Card, Col, Container, Row, Spinner } from 'react-bootstrap'
import { listarCategorias, listarProdutos } from '../services/produtoService'

export default function MenuPage() {
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
                    <strong>{produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
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
