import api from './api'

export async function listarProdutos(categoriaId) {
  const params = categoriaId ? { categoriaId } : {}
  const response = await api.get('/produtos', { params })
  return response.data
}

export async function listarCategorias() {
  const response = await api.get('/categorias')
  return response.data
}
