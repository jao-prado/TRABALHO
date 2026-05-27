import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' }
})

const PUBLIC_ROUTES = ['/auth/login', '/auth/cadastro']

api.interceptors.request.use((config) => {
  const isPublic = PUBLIC_ROUTES.some(route => config.url?.includes(route))
  if (!isPublic) {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api