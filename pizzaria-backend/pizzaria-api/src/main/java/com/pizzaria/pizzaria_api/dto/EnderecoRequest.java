package com.pizzaria.pizzaria_api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record EnderecoRequest(
        @NotBlank @Size(max = 160) String rua,
        @NotBlank @Size(max = 20) String numero,
        @NotBlank @Size(max = 100) String bairro,
        @NotBlank @Size(max = 100) String cidade,
        @NotBlank @Pattern(regexp = "[A-Z]{2}") String estado,
        @Size(max = 120) String complemento,
        @NotBlank @Pattern(regexp = "\\d{8}") String cep
) {
}
