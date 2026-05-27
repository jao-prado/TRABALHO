import { createContext, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [itens, setItens] = useState(() => {
    const stored = localStorage.getItem('carrinho')
    return stored ? JSON.parse(stored) : []
  })

  function persistir(proximosItens) {
    setItens(proximosItens)
    localStorage.setItem('carrinho', JSON.stringify(proximosItens))
  }

  function adicionar(produto) {
    const existente = itens.find((item) => item.produto.id === produto.id)
    const proximosItens = existente
      ? itens.map((item) => (
          item.produto.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        ))
      : [...itens, { produto, quantidade: 1 }]

    persistir(proximosItens)
  }

  function remover(produtoId) {
    persistir(itens.filter((item) => item.produto.id !== produtoId))
  }

  function alterarQuantidade(produtoId, quantidade) {
    if (quantidade < 1) {
      remover(produtoId)
      return
    }

    persistir(itens.map((item) => (
      item.produto.id === produtoId ? { ...item, quantidade } : item
    )))
  }

  function limpar() {
    persistir([])
  }

  const totalItens = itens.reduce((total, item) => total + item.quantidade, 0)
  const valorTotal = itens.reduce((total, item) => total + Number(item.produto.preco) * item.quantidade, 0)

  const value = useMemo(
    () => ({
      itens,
      totalItens,
      valorTotal,
      adicionar,
      remover,
      alterarQuantidade,
      limpar
    }),
    [itens, totalItens, valorTotal]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart deve ser usado dentro de CartProvider')
  }
  return context
}
