package com.pizzaria.pizzaria_api.service;

import com.pizzaria.pizzaria_api.dto.AtualizarUsuarioAdminRequest;
import com.pizzaria.pizzaria_api.dto.UsuarioResponse;
import com.pizzaria.pizzaria_api.entity.Role;
import com.pizzaria.pizzaria_api.entity.Usuario;
import com.pizzaria.pizzaria_api.exception.ApiException;
import com.pizzaria.pizzaria_api.mapper.UsuarioMapper;
import com.pizzaria.pizzaria_api.repository.UsuarioRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario buscarAtivoPorEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .filter(Usuario::getAtivo)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Usuario nao encontrado."));
    }

    public List<UsuarioResponse> listarTodos() {
        return usuarioRepository.findAllByOrderByNomeAsc()
                .stream()
                .map(UsuarioMapper::toResponse)
                .toList();
    }

    @Transactional
    public UsuarioResponse atualizarAdmin(Long id, AtualizarUsuarioAdminRequest request) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Usuario nao encontrado."));

        if (request.role() == null && request.ativo() == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Informe role ou ativo para atualizar o usuario.");
        }

        boolean removeriaUltimoAdmin = usuario.getRole() == Role.ADMIN
                && usuario.getAtivo()
                && usuarioRepository.countByRoleAndAtivoTrue(Role.ADMIN) <= 1
                && (Boolean.FALSE.equals(request.ativo()) || (request.role() != null && request.role() != Role.ADMIN));

        if (removeriaUltimoAdmin) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Nao e permitido remover o ultimo admin ativo.");
        }

        if (request.role() != null) {
            usuario.setRole(request.role());
        }
        if (request.ativo() != null) {
            usuario.setAtivo(request.ativo());
        }

        return UsuarioMapper.toResponse(usuario);
    }
}