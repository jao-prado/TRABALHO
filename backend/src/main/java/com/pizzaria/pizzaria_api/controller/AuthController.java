package com.pizzaria.pizzaria_api.controller;

import com.pizzaria.pizzaria_api.dto.AuthResponse;
import com.pizzaria.pizzaria_api.dto.CadastroUsuarioRequest;
import com.pizzaria.pizzaria_api.dto.LoginRequest;
import com.pizzaria.pizzaria_api.dto.UsuarioResponse;
import com.pizzaria.pizzaria_api.service.AuthService;
import jakarta.validation.Valid;
import java.security.Principal;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/cadastro")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse cadastrar(@Valid @RequestBody CadastroUsuarioRequest request) {
        return authService.cadastrar(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    public UsuarioResponse me(Principal principal) {
        return authService.buscarUsuarioLogado(principal.getName());
    }
}
