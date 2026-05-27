import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [erro, setErro] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()

  async function onSubmit(data) {
    setErro('')
    try {
      await login(data.email, data.senha)
      navigate('/cardapio')
    } catch (error) {
      setErro(error.response?.data?.mensagens?.[0] || 'Nao foi possivel entrar.')
    }
  }

  return (
    <main className="auth-page">
      <Row className="g-0 auth-shell">
        <Col lg={6} className="auth-panel">
          <span className="eyebrow">Pedidos online</span>
          <h1>Pizzaria Barueri</h1>
          <p>Entre para fazer pedidos, acompanhar status e acessar seu historico.</p>
        </Col>
        <Col lg={6} className="auth-form-wrap">
          <Card className="auth-card">
            <Card.Body>
              <h2>Entrar</h2>
              {erro && <Alert variant="danger">{erro}</Alert>}
              <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    isInvalid={Boolean(errors.email)}
                    {...register('email', { required: 'Informe o email.' })}
                  />
                  <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    type="password"
                    isInvalid={Boolean(errors.senha)}
                    {...register('senha', { required: 'Informe a senha.' })}
                  />
                  <Form.Control.Feedback type="invalid">{errors.senha?.message}</Form.Control.Feedback>
                </Form.Group>
                <Button type="submit" variant="dark" className="w-100" disabled={isSubmitting}>
                  {isSubmitting ? 'Entrando...' : 'Entrar'}
                </Button>
              </Form>
              <p className="auth-link">Ainda nao tem conta? <Link to="/cadastro">Cadastrar</Link></p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </main>
  )
}
