package com.pizzaria.pizzaria_api.service;

import com.pizzaria.pizzaria_api.entity.Usuario;
import com.pizzaria.pizzaria_api.exception.ApiException;
import com.pizzaria.pizzaria_api.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

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
}
