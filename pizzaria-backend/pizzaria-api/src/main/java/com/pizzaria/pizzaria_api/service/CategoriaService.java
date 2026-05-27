package com.pizzaria.pizzaria_api.service;

import com.pizzaria.pizzaria_api.dto.CategoriaRequest;
import com.pizzaria.pizzaria_api.dto.CategoriaResponse;
import com.pizzaria.pizzaria_api.entity.Categoria;
import com.pizzaria.pizzaria_api.exception.ApiException;
import com.pizzaria.pizzaria_api.mapper.CategoriaMapper;
import com.pizzaria.pizzaria_api.repository.CategoriaRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public CategoriaService(CategoriaRepository categoriaRepository) {
        this.categoriaRepository = categoriaRepository;
    }

    public List<CategoriaResponse> listarAtivas() {
        return categoriaRepository.findByAtivoTrueOrderByNomeAsc()
                .stream()
                .map(CategoriaMapper::toResponse)
                .toList();
    }

    public List<CategoriaResponse> listarTodas() {
        return categoriaRepository.findAllByOrderByNomeAsc()
                .stream()
                .map(CategoriaMapper::toResponse)
                .toList();
    }

    public Categoria buscarEntidadePorId(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Categoria nao encontrada."));
    }

    public CategoriaResponse buscarPorId(Long id) {
        return CategoriaMapper.toResponse(buscarEntidadePorId(id));
    }

    @Transactional
    public CategoriaResponse criar(CategoriaRequest request) {
        String nome = request.nome().trim();

        if (categoriaRepository.existsByNomeIgnoreCase(nome)) {
            throw new ApiException(HttpStatus.CONFLICT, "Categoria ja cadastrada.");
        }

        Categoria categoria = Categoria.builder()
                .nome(nome)
                .descricao(request.descricao())
                .ativo(request.ativo() == null || request.ativo())
                .build();

        return CategoriaMapper.toResponse(categoriaRepository.save(categoria));
    }

    @Transactional
    public CategoriaResponse atualizar(Long id, CategoriaRequest request) {
        Categoria categoria = buscarEntidadePorId(id);
        String nome = request.nome().trim();

        if (categoriaRepository.existsByNomeIgnoreCaseAndIdNot(nome, id)) {
            throw new ApiException(HttpStatus.CONFLICT, "Categoria ja cadastrada.");
        }

        categoria.setNome(nome);
        categoria.setDescricao(request.descricao());
        if (request.ativo() != null) {
            categoria.setAtivo(request.ativo());
        }

        return CategoriaMapper.toResponse(categoria);
    }

    @Transactional
    public void alterarStatus(Long id, boolean ativo) {
        Categoria categoria = buscarEntidadePorId(id);
        categoria.setAtivo(ativo);
    }
}
