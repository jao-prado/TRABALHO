import api from './api'

export async function criarPedido(dados) {
  const response = await api.post('/pedidos', dados)
  return response.data
}

export async function listarMeusPedidos() {
  const response = await api.get('/pedidos/meus')
  return response.data
}

export async function listarPedidos() {
  const response = await api.get('/pedidos')
  return response.data
}

export async function alterarStatusPedido(id, status) {
  const response = await api.patch(`/pedidos/${id}/status`, { status })
  return response.data
}
