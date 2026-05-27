import { useEffect, useState } from 'react'
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { criarEndereco, listarEnderecos } from '../services/enderecoService'
import { criarPedido } from '../services/pedidoService'
import { formatarMoeda } from '../utils/formatters'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { itens, valorTotal, limpar } = useCart()
  const [enderecos, setEnderecos] = useState([])
  const [enderecoId, setEnderecoId] = useState('')
  const [novoEndereco, setNovoEndereco] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm()

  useEffect(() => {
    async function carregarEnderecos() {
      try {
        const data = await listarEnderecos()
        setEnderecos(data)
        if (data.length === 0) {
          setNovoEndereco(true)
        } else {
          setEnderecoId(String(data[0].id))
        }
      } catch {
        setErro('Nao foi possivel carregar seus enderecos.')
      } finally {
        setCarregando(false)
      }
    }

    carregarEnderecos()
  }, [])

  async function onSubmit(data) {
    setErro('')

    if (itens.length === 0) {
      setErro('Adicione itens ao carrinho antes de finalizar.')
      return
    }

    try {
      let enderecoEntregaId = Number(enderecoId)

      if (novoEndereco) {
        const endereco = await criarEndereco({
          rua: data.rua,
          numero: data.numero,
          bairro: data.bairro,
          cidade: data.cidade,
          estado: data.estado.toUpperCase(),
          complemento: data.complemento || null,
          cep: data.cep.replace(/\D/g, '')
        })
        enderecoEntregaId = endereco.id
      }

      await criarPedido({
        enderecoEntregaId,
        formaPagamento: data.formaPagamento,
        observacao: data.observacao || null,
        itens: itens.map((item) => ({
          produtoId: item.produto.id,
          quantidade: item.quantidade
        }))
      })

      limpar()
      reset()
      navigate('/pedidos')
    } catch (error) {
      setErro(error.response?.data?.mensagens?.[0] || 'Nao foi possivel finalizar o pedido.')
    }
  }

  return (
    <main className="page">
      <Container>
        <div className="page-header">
          <div>
            <span className="eyebrow">Finalizacao</span>
            <h1>Finalizar pedido</h1>
          </div>
        </div>

        {erro && <Alert variant="danger">{erro}</Alert>}

        {itens.length === 0 ? (
          <Card className="empty-state">
            <Card.Body>
              <h2>Carrinho vazio</h2>
              <p>Escolha produtos antes de finalizar o pedido.</p>
              <Button as={Link} to="/cardapio" variant="dark" className="mt-3">Ver cardapio</Button>
            </Card.Body>
          </Card>
        ) : carregando ? (
          <div className="loading"><Spinner animation="border" /></div>
        ) : (
          <Form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Row className="g-4">
              <Col lg={8}>
                <Card className="checkout-card">
                  <Card.Body>
                    <h2>Entrega</h2>

                    {enderecos.length > 0 && (
                      <Form.Group className="mb-3">
                        <Form.Label>Endereco cadastrado</Form.Label>
                        <Form.Select
                          value={enderecoId}
                          disabled={novoEndereco}
                          onChange={(event) => setEnderecoId(event.target.value)}
                        >
                          {enderecos.map((endereco) => (
                            <option key={endereco.id} value={endereco.id}>
                              {endereco.rua}, {endereco.numero} - {endereco.bairro}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    )}

                    <Form.Check
                      type="switch"
                      id="novo-endereco"
                      className="mb-3"
                      checked={novoEndereco}
                      onChange={(event) => setNovoEndereco(event.target.checked)}
                      label="Usar novo endereco"
                    />

                    {novoEndereco && (
                      <Row>
                        <Col md={8}>
                          <Form.Group className="mb-3">
                            <Form.Label>Rua</Form.Label>
                            <Form.Control isInvalid={Boolean(errors.rua)} {...register('rua', { required: novoEndereco && 'Informe a rua.' })} />
                            <Form.Control.Feedback type="invalid">{errors.rua?.message}</Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Numero</Form.Label>
                            <Form.Control isInvalid={Boolean(errors.numero)} {...register('numero', { required: novoEndereco && 'Informe o numero.' })} />
                            <Form.Control.Feedback type="invalid">{errors.numero?.message}</Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Bairro</Form.Label>
                            <Form.Control isInvalid={Boolean(errors.bairro)} {...register('bairro', { required: novoEndereco && 'Informe o bairro.' })} />
                            <Form.Control.Feedback type="invalid">{errors.bairro?.message}</Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Cidade</Form.Label>
                            <Form.Control defaultValue="Barueri" isInvalid={Boolean(errors.cidade)} {...register('cidade', { required: novoEndereco && 'Informe a cidade.' })} />
                            <Form.Control.Feedback type="invalid">{errors.cidade?.message}</Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>Estado</Form.Label>
                            <Form.Control defaultValue="SP" maxLength={2} isInvalid={Boolean(errors.estado)} {...register('estado', { required: novoEndereco && 'Informe o estado.', pattern: { value: /^[A-Za-z]{2}$/, message: 'Use a UF com 2 letras.' } })} />
                            <Form.Control.Feedback type="invalid">{errors.estado?.message}</Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={8}>
                          <Form.Group className="mb-3">
                            <Form.Label>CEP</Form.Label>
                            <Form.Control maxLength={8} isInvalid={Boolean(errors.cep)} {...register('cep', { required: novoEndereco && 'Informe o CEP.', pattern: { value: /^\d{8}$/, message: 'Use 8 numeros.' } })} />
                            <Form.Control.Feedback type="invalid">{errors.cep?.message}</Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={12}>
                          <Form.Group className="mb-3">
                            <Form.Label>Complemento</Form.Label>
                            <Form.Control {...register('complemento')} />
                          </Form.Group>
                        </Col>
                      </Row>
                    )}
                  </Card.Body>
                </Card>

                <Card className="checkout-card mt-3">
                  <Card.Body>
                    <h2>Pagamento</h2>
                    <Form.Group className="mb-3">
                      <Form.Label>Forma de pagamento</Form.Label>
                      <Form.Control
                        placeholder="Ex: Pix, dinheiro, cartao"
                        isInvalid={Boolean(errors.formaPagamento)}
                        {...register('formaPagamento', { required: 'Informe a forma de pagamento.' })}
                      />
                      <Form.Control.Feedback type="invalid">{errors.formaPagamento?.message}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Observacao</Form.Label>
                      <Form.Control as="textarea" rows={3} maxLength={500} {...register('observacao')} />
                    </Form.Group>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={4}>
                <Card className="cart-summary">
                  <Card.Body>
                    <h2>Resumo</h2>
                    <div className="checkout-items">
                      {itens.map((item) => (
                        <div key={item.produto.id}>
                          <span>{item.quantidade}x {item.produto.nome}</span>
                          <strong>{formatarMoeda(Number(item.produto.preco) * item.quantidade)}</strong>
                        </div>
                      ))}
                    </div>
                    <strong>{formatarMoeda(valorTotal)}</strong>
                    <Button type="submit" variant="dark" className="w-100 mt-3" disabled={isSubmitting}>
                      {isSubmitting ? 'Enviando...' : 'Confirmar pedido'}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Form>
        )}
      </Container>
    </main>
  )
}
