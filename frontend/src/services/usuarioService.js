import api from './api'

export async function listarUsuarios() {
  const response = await api.get('/usuarios')
  return response.data
}

export async function atualizarUsuario(id, dados) {
  const response = await api.patch(`/usuarios/${id}`, dados)
  return response.data
}