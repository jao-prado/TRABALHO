import { useEffect, useState } from 'react'
import { Alert, Badge, Button, Card, Col, Container, Form, Row, Spinner, Tab, Tabs } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import {
  alterarStatusCategoria,
  alterarStatusProduto,
  atualizarCategoria,
  atualizarProduto,
  criarCategoria,
  criarProduto,
  listarCategoriasAdmin,
  listarProdutosAdmin
} from '../services/produtoService'
import { formatarMoeda } from '../utils/formatters'

export default function AdminPage() {
  const [categorias, setCategorias] = useState([])
  const [produtos, setProdutos] = useState([])
  const [editandoCategoria, setEditandoCategoria] = useState(null)
  const [editandoProduto, setEditandoProduto] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const categoriaForm = useForm()
  const produtoForm = useForm()

  async function carregarDados() {
    setErro('')
    try {
      const [categoriasData, produtosData] = await Promise.all([
        listarCategoriasAdmin(),
        listarProdutosAdmin()
      ])
      setCategorias(categoriasData)
      setProdutos(produtosData)
    } catch {
      setErro('Nao foi possivel carregar os dados administrativos.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [])

  async function salvarCategoria(data) {
    try {
      const payload = {
        nome: data.nome,
        descricao: data.descricao || null,
        ativo: data.ativo
      }
      if (editandoCategoria) {
        await atualizarCategoria(editandoCategoria.id, payload)
      } else {
        await criarCategoria(payload)
      }
      categoriaForm.reset({ nome: '', descricao: '', ativo: true })
      setEditandoCategoria(null)
      await carregarDados()
    } catch (error) {
      setErro(error.response?.data?.mensagens?.[0] || 'Nao foi possivel salvar a categoria.')
    }
  }

  async function salvarProduto(data) {
    try {
      const payload = {
        nome: data.nome,
        descricao: data.descricao || null,
        preco: Number(data.preco),
        imagemUrl: data.imagemUrl || null,
        categoriaId: Number(data.categoriaId),
        ativo: data.ativo
      }
      if (editandoProduto) {
        await atualizarProduto(editandoProduto.id, payload)
      } else {
        await criarProduto(payload)
      }
      produtoForm.reset({ nome: '', descricao: '', preco: '', imagemUrl: '', categoriaId: '', ativo: true })
      setEditandoProduto(null)
      await carregarDados()
    } catch (error) {
      setErro(error.response?.data?.mensagens?.[0] || 'Nao foi possivel salvar o produto.')
    }
  }

  function iniciarEdicaoCategoria(categoria) {
    setEditandoCategoria(categoria)
    categoriaForm.reset(categoria)
  }

  function iniciarEdicaoProduto(produto) {
    setEditandoProduto(produto)
    produtoForm.reset({
      nome: produto.nome,
      descricao: produto.descricao || '',
      preco: produto.preco,
      imagemUrl: produto.imagemUrl || '',
      categoriaId: produto.categoria.id,
      ativo: produto.ativo
    })
  }

  async function alternarCategoria(categoria) {
    await alterarStatusCategoria(categoria.id, !categoria.ativo)
    await carregarDados()
  }

  async function alternarProduto(produto) {
    await alterarStatusProduto(produto.id, !produto.ativo)
    await carregarDados()
  }

  return (
    <main className="page">
      <Container>
        <div className="page-header">
          <div>
            <span className="eyebrow">Administracao</span>
            <h1>Gestao do sistema</h1>
          </div>
        </div>

        {erro && <Alert variant="danger">{erro}</Alert>}

        {carregando ? (
          <div className="loading"><Spinner animation="border" /></div>
        ) : (
          <Tabs defaultActiveKey="produtos" className="admin-tabs">
            <Tab eventKey="produtos" title="Produtos">
              <Row className="g-4">
                <Col lg={4}>
                  <Card className="admin-card">
                    <Card.Body>
                      <h2>{editandoProduto ? 'Editar produto' : 'Novo produto'}</h2>
                      <Form onSubmit={produtoForm.handleSubmit(salvarProduto)}>
                        <Form.Group className="mb-3">
                          <Form.Label>Nome</Form.Label>
                          <Form.Control {...produtoForm.register('nome', { required: true })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Descricao</Form.Label>
                          <Form.Control as="textarea" rows={3} {...produtoForm.register('descricao')} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Preco</Form.Label>
                          <Form.Control type="number" step="0.01" min="0.01" {...produtoForm.register('preco', { required: true })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Imagem URL</Form.Label>
                          <Form.Control {...produtoForm.register('imagemUrl')} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Categoria</Form.Label>
                          <Form.Select {...produtoForm.register('categoriaId', { required: true })}>
                            <option value="">Selecione</option>
                            {categorias.map((categoria) => (
                              <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                        <Form.Check className="mb-3" label="Ativo" defaultChecked {...produtoForm.register('ativo')} />
                        <div className="form-actions">
                          <Button type="submit" variant="dark">{editandoProduto ? 'Salvar' : 'Criar'}</Button>
                          {editandoProduto && (
                            <Button variant="outline-dark" onClick={() => {
                              setEditandoProduto(null)
                              produtoForm.reset({ nome: '', descricao: '', preco: '', imagemUrl: '', categoriaId: '', ativo: true })
                            }}>
                              Cancelar
                            </Button>
                          )}
                        </div>
                      </Form>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={8}>
                  <div className="admin-list">
                    {produtos.map((produto) => (
                      <Card className="admin-row" key={produto.id}>
                        <Card.Body>
                          <div>
                            <h2>{produto.nome}</h2>
                            <p>{produto.categoria.nome} - {formatarMoeda(produto.preco)}</p>
                          </div>
                          <Badge bg={produto.ativo ? 'success' : 'secondary'}>{produto.ativo ? 'Ativo' : 'Inativo'}</Badge>
                          <Button variant="outline-dark" size="sm" onClick={() => iniciarEdicaoProduto(produto)}>Editar</Button>
                          <Button variant="outline-dark" size="sm" onClick={() => alternarProduto(produto)}>
                            {produto.ativo ? 'Desativar' : 'Ativar'}
                          </Button>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="categorias" title="Categorias">
              <Row className="g-4">
                <Col lg={4}>
                  <Card className="admin-card">
                    <Card.Body>
                      <h2>{editandoCategoria ? 'Editar categoria' : 'Nova categoria'}</h2>
                      <Form onSubmit={categoriaForm.handleSubmit(salvarCategoria)}>
                        <Form.Group className="mb-3">
                          <Form.Label>Nome</Form.Label>
                          <Form.Control {...categoriaForm.register('nome', { required: true })} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Descricao</Form.Label>
                          <Form.Control as="textarea" rows={3} {...categoriaForm.register('descricao')} />
                        </Form.Group>
                        <Form.Check className="mb-3" label="Ativa" defaultChecked {...categoriaForm.register('ativo')} />
                        <div className="form-actions">
                          <Button type="submit" variant="dark">{editandoCategoria ? 'Salvar' : 'Criar'}</Button>
                          {editandoCategoria && (
                            <Button variant="outline-dark" onClick={() => {
                              setEditandoCategoria(null)
                              categoriaForm.reset({ nome: '', descricao: '', ativo: true })
                            }}>
                              Cancelar
                            </Button>
                          )}
                        </div>
                      </Form>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={8}>
                  <div className="admin-list">
                    {categorias.map((categoria) => (
                      <Card className="admin-row" key={categoria.id}>
                        <Card.Body>
                          <div>
                            <h2>{categoria.nome}</h2>
                            <p>{categoria.descricao || 'Sem descricao'}</p>
                          </div>
                          <Badge bg={categoria.ativo ? 'success' : 'secondary'}>{categoria.ativo ? 'Ativa' : 'Inativa'}</Badge>
                          <Button variant="outline-dark" size="sm" onClick={() => iniciarEdicaoCategoria(categoria)}>Editar</Button>
                          <Button variant="outline-dark" size="sm" onClick={() => alternarCategoria(categoria)}>
                            {categoria.ativo ? 'Desativar' : 'Ativar'}
                          </Button>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                </Col>
              </Row>
            </Tab>
          </Tabs>
        )}
      </Container>
    </main>
  )
}
