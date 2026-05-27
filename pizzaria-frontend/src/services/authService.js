import api from './api'

export async function login(email, senha) {
  const response = await api.post('/auth/login', { email, senha })
  return response.data
}

export async function getProdutos() {
  const response = await api.get('/produtos')
  return response.data
}