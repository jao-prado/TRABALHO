package com.pizzaria.pizzaria_api.service;

import com.pizzaria.pizzaria_api.dto.AuthResponse;
import com.pizzaria.pizzaria_api.dto.CadastroUsuarioRequest;
import com.pizzaria.pizzaria_api.dto.LoginRequest;
import com.pizzaria.pizzaria_api.dto.UsuarioResponse;
import com.pizzaria.pizzaria_api.entity.Role;
import com.pizzaria.pizzaria_api.entity.Usuario;
import com.pizzaria.pizzaria_api.exception.ApiException;
import com.pizzaria.pizzaria_api.mapper.UsuarioMapper;
import com.pizzaria.pizzaria_api.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService
    ) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public AuthResponse cadastrar(CadastroUsuarioRequest request) {
        String email = normalizarEmail(request.email());

        if (usuarioRepository.existsByEmail(email)) {
            throw new ApiException(HttpStatus.CONFLICT, "Email ja cadastrado.");
        }

        Usuario usuario = Usuario.builder()
                .nome(request.nome().trim())
                .email(email)
                .senhaHash(passwordEncoder.encode(request.senha()))
                .telefone(request.telefone())
                .role(Role.CLIENTE)
                .ativo(true)
                .build();

        Usuario usuarioSalvo = usuarioRepository.save(usuario);
        return gerarAuthResponse(usuarioSalvo);
    }

    public AuthResponse login(LoginRequest request) {
        String email = normalizarEmail(request.email());
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.senha())
        );

        Usuario usuario = usuarioRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Email ou senha invalidos."));

        return gerarAuthResponse(usuario);
    }

    public UsuarioResponse buscarUsuarioLogado(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .filter(Usuario::getAtivo)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Usuario nao encontrado."));

        return UsuarioMapper.toResponse(usuario);
    }

    private AuthResponse gerarAuthResponse(Usuario usuario) {
        return new AuthResponse(jwtService.gerarToken(usuario), "Bearer", UsuarioMapper.toResponse(usuario));
    }

    private String normalizarEmail(String email) {
        return email.trim().toLowerCase();
    }
}
