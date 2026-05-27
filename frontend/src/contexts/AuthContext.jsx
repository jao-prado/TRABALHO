import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './authContextObject'
import { buscarUsuarioLogado, cadastro as cadastrarUsuario, login as loginUsuario } from '../services/authService'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [usuario, setUsuario] = useState(() => {
    const stored = localStorage.getItem('usuario')
    return stored ? JSON.parse(stored) : null
  })
  const [carregando, setCarregando] = useState(Boolean(token))

  useEffect(() => {
    let ativo = true

    async function carregarUsuario() {
      if (!token) {
        setCarregando(false)
        return
      }

      try {
        const usuarioAtual = await buscarUsuarioLogado()
        if (ativo) {
          setUsuario(usuarioAtual)
          localStorage.setItem('usuario', JSON.stringify(usuarioAtual))
        }
      } catch {
        if (ativo) {
          logout()
        }
      } finally {
        if (ativo) {
          setCarregando(false)
        }
      }
    }

    carregarUsuario()

    return () => {
      ativo = false
    }
  }, [token])

  const autenticar = useCallback(async (email, senha) => {
    const data = await loginUsuario(email, senha)
    salvarSessao(data)
    return data.usuario
  }, [])

  const cadastrar = useCallback(async (dados) => {
    const data = await cadastrarUsuario(dados)
    salvarSessao(data)
    return data.usuario
  }, [])

  function salvarSessao(data) {
    localStorage.setItem('token', data.token)
    localStorage.setItem('usuario', JSON.stringify(data.usuario))
    setToken(data.token)
    setUsuario(data.usuario)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setToken(null)
    setUsuario(null)
  }

  const value = useMemo(
    () => ({
      token,
      usuario,
      carregando,
      autenticado: Boolean(token && usuario),
      login: autenticar,
      cadastro: cadastrar,
      logout
    }),
    [token, usuario, carregando, autenticar, cadastrar]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
