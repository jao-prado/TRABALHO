import { useCallback, useMemo, useState } from 'react'
import { CartContext } from './cartContextObject'

export function CartProvider({ children }) {
  const [itens, setItens] = useState(() => {
    const stored = localStorage.getItem('carrinho')
    return stored ? JSON.parse(stored) : []
  })

  const persistir = useCallback((proximosItens) => {
    setItens(proximosItens)
    localStorage.setItem('carrinho', JSON.stringify(proximosItens))
  }, [])

  const adicionar = useCallback((produto) => {
    const existente = itens.find((item) => item.produto.id === produto.id)
    const proximosItens = existente
      ? itens.map((item) => (
          item.produto.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        ))
      : [...itens, { produto, quantidade: 1 }]

    persistir(proximosItens)
  }, [itens, persistir])

  const remover = useCallback((produtoId) => {
    persistir(itens.filter((item) => item.produto.id !== produtoId))
  }, [itens, persistir])

  const alterarQuantidade = useCallback((produtoId, quantidade) => {
    if (quantidade < 1) {
      remover(produtoId)
      return
    }

    persistir(itens.map((item) => (
      item.produto.id === produtoId ? { ...item, quantidade } : item
    )))
  }, [itens, persistir, remover])

  const limpar = useCallback(() => {
    persistir([])
  }, [persistir])

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
    [itens, totalItens, valorTotal, adicionar, remover, alterarQuantidade, limpar]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
