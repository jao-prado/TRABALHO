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

export async function listarProdutosAdmin() {
  const response = await api.get('/produtos/admin')
  return response.data
}

export async function criarProduto(dados) {
  const response = await api.post('/produtos', dados)
  return response.data
}

export async function atualizarProduto(id, dados) {
  const response = await api.put(`/produtos/${id}`, dados)
  return response.data
}

export async function alterarStatusProduto(id, ativo) {
  await api.patch(`/produtos/${id}/status`, null, { params: { ativo } })
}

export async function listarCategoriasAdmin() {
  const response = await api.get('/categorias/admin')
  return response.data
}

export async function criarCategoria(dados) {
  const response = await api.post('/categorias', dados)
  return response.data
}

export async function atualizarCategoria(id, dados) {
  const response = await api.put(`/categorias/${id}`, dados)
  return response.data
}

export async function alterarStatusCategoria(id, ativo) {
  await api.patch(`/categorias/${id}/status`, null, { params: { ativo } })
}
