package com.pizzaria.pizzaria_api.service;

import com.pizzaria.pizzaria_api.dto.EnderecoRequest;
import com.pizzaria.pizzaria_api.dto.EnderecoResponse;
import com.pizzaria.pizzaria_api.entity.Endereco;
import com.pizzaria.pizzaria_api.entity.Usuario;
import com.pizzaria.pizzaria_api.exception.ApiException;
import com.pizzaria.pizzaria_api.mapper.EnderecoMapper;
import com.pizzaria.pizzaria_api.repository.EnderecoRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EnderecoService {

    private final EnderecoRepository enderecoRepository;
    private final UsuarioService usuarioService;

    public EnderecoService(EnderecoRepository enderecoRepository, UsuarioService usuarioService) {
        this.enderecoRepository = enderecoRepository;
        this.usuarioService = usuarioService;
    }

    public List<EnderecoResponse> listarDoUsuario(String email) {
        Usuario usuario = usuarioService.buscarAtivoPorEmail(email);

        return enderecoRepository.findByUsuarioIdOrderByIdDesc(usuario.getId())
                .stream()
                .map(EnderecoMapper::toResponse)
                .toList();
    }

    public Endereco buscarDoUsuario(Long enderecoId, Usuario usuario) {
        return enderecoRepository.findByIdAndUsuarioId(enderecoId, usuario.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Endereco nao encontrado."));
    }

    @Transactional
    public EnderecoResponse criar(String email, EnderecoRequest request) {
        Usuario usuario = usuarioService.buscarAtivoPorEmail(email);

        Endereco endereco = Endereco.builder()
                .usuario(usuario)
                .rua(request.rua().trim())
                .numero(request.numero().trim())
                .bairro(request.bairro().trim())
                .cidade(request.cidade().trim())
                .estado(request.estado())
                .complemento(request.complemento())
                .cep(request.cep())
                .build();

        return EnderecoMapper.toResponse(enderecoRepository.save(endereco));
    }
}
