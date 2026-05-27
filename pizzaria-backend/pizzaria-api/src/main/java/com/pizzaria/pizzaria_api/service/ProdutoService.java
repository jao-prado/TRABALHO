package com.pizzaria.pizzaria_api.service;

import com.pizzaria.pizzaria_api.dto.ProdutoRequest;
import com.pizzaria.pizzaria_api.dto.ProdutoResponse;
import com.pizzaria.pizzaria_api.entity.Categoria;
import com.pizzaria.pizzaria_api.entity.Produto;
import com.pizzaria.pizzaria_api.exception.ApiException;
import com.pizzaria.pizzaria_api.mapper.ProdutoMapper;
import com.pizzaria.pizzaria_api.repository.ProdutoRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final CategoriaService categoriaService;

    public ProdutoService(ProdutoRepository produtoRepository, CategoriaService categoriaService) {
        this.produtoRepository = produtoRepository;
        this.categoriaService = categoriaService;
    }

    public List<ProdutoResponse> listarAtivos(Long categoriaId) {
        List<Produto> produtos = categoriaId == null
                ? produtoRepository.findByAtivoTrueOrderByNomeAsc()
                : produtoRepository.findByCategoriaIdAndAtivoTrueOrderByNomeAsc(categoriaId);

        return produtos.stream().map(ProdutoMapper::toResponse).toList();
    }

    public List<ProdutoResponse> listarTodos() {
        return produtoRepository.findAllByOrderByNomeAsc()
                .stream()
                .map(ProdutoMapper::toResponse)
                .toList();
    }

    public Produto buscarEntidadePorId(Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Produto nao encontrado."));
    }

    public ProdutoResponse buscarPorId(Long id) {
        return ProdutoMapper.toResponse(buscarEntidadePorId(id));
    }

    @Transactional
    public ProdutoResponse criar(ProdutoRequest request) {
        Categoria categoria = categoriaService.buscarEntidadePorId(request.categoriaId());

        Produto produto = Produto.builder()
                .nome(request.nome().trim())
                .descricao(request.descricao())
                .preco(request.preco())
                .imagemUrl(request.imagemUrl())
                .categoria(categoria)
                .ativo(request.ativo() == null || request.ativo())
                .build();

        return ProdutoMapper.toResponse(produtoRepository.save(produto));
    }

    @Transactional
    public ProdutoResponse atualizar(Long id, ProdutoRequest request) {
        Produto produto = buscarEntidadePorId(id);
        Categoria categoria = categoriaService.buscarEntidadePorId(request.categoriaId());

        produto.setNome(request.nome().trim());
        produto.setDescricao(request.descricao());
        produto.setPreco(request.preco());
        produto.setImagemUrl(request.imagemUrl());
        produto.setCategoria(categoria);
        if (request.ativo() != null) {
            produto.setAtivo(request.ativo());
        }

        return ProdutoMapper.toResponse(produto);
    }

    @Transactional
    public void alterarStatus(Long id, boolean ativo) {
        Produto produto = buscarEntidadePorId(id);
        produto.setAtivo(ativo);
    }
}
