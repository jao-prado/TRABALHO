package com.pizzaria.pizzaria_api.dto;

public record EnderecoResponse(
        Long id,
        String rua,
        String numero,
        String bairro,
        String cidade,
        String estado,
        String complemento,
        String cep
) {
}
