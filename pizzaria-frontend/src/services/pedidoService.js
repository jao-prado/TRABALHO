import api from './api'

export async function criarPedido(dados) {
  const response = await api.post('/pedidos', dados)
  return response.data
}

export async function listarMeusPedidos() {
  const response = await api.get('/pedidos/meus')
  return response.data
}
