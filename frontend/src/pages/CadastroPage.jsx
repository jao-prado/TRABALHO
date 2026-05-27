import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function CadastroPage() {
  const { cadastro } = useAuth()
  const navigate = useNavigate()
  const [erro, setErro] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()

  async function onSubmit(data) {
    setErro('')
    try {
      await cadastro(data)
      navigate('/cardapio')
    } catch (error) {
      setErro(error.response?.data?.mensagens?.[0] || 'Nao foi possivel cadastrar.')
    }
  }

  return (
    <main className="auth-page">
      <Row className="g-0 auth-shell">
        <Col lg={5} className="auth-panel compact">
          <span className="eyebrow">Nova conta</span>
          <h1>Comece seu pedido</h1>
          <p>O cadastro cria uma conta de cliente para acessar pedidos e enderecos.</p>
        </Col>
        <Col lg={7} className="auth-form-wrap">
          <Card className="auth-card">
            <Card.Body>
              <h2>Cadastrar</h2>
              {erro && <Alert variant="danger">{erro}</Alert>}
              <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Row>
                  <Col md={7}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nome</Form.Label>
                      <Form.Control isInvalid={Boolean(errors.nome)} {...register('nome', { required: 'Informe o nome.' })} />
                      <Form.Control.Feedback type="invalid">{errors.nome?.message}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={5}>
                    <Form.Group className="mb-3">
                      <Form.Label>Telefone</Form.Label>
                      <Form.Control maxLength={20} {...register('telefone')} />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" isInvalid={Boolean(errors.email)} {...register('email', { required: 'Informe o email.' })} />
                  <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    type="password"
                    isInvalid={Boolean(errors.senha)}
                    {...register('senha', { required: 'Informe a senha.', minLength: { value: 8, message: 'Use pelo menos 8 caracteres.' } })}
                  />
                  <Form.Control.Feedback type="invalid">{errors.senha?.message}</Form.Control.Feedback>
                </Form.Group>
                <Button type="submit" variant="dark" className="w-100" disabled={isSubmitting}>
                  {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
                </Button>
              </Form>
              <p className="auth-link">Ja tem conta? <Link to="/login">Entrar</Link></p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </main>
  )
}
