import api from './api'

export async function login(email, senha) {
  const response = await api.post('/auth/login', { email, senha })
  return response.data
}

export async function cadastro(dados) {
  const response = await api.post('/auth/cadastro', dados)
  return response.data
}

export async function buscarUsuarioLogado() {
  const response = await api.get('/auth/me')
  return response.data
}
