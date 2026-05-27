import api from './api'

export async function listarEnderecos() {
  const response = await api.get('/enderecos')
  return response.data
}

export async function criarEndereco(dados) {
  const response = await api.post('/enderecos', dados)
  return response.data
}
