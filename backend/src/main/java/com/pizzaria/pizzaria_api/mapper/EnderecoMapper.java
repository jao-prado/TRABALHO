package com.pizzaria.pizzaria_api.mapper;

import com.pizzaria.pizzaria_api.dto.EnderecoResponse;
import com.pizzaria.pizzaria_api.entity.Endereco;

public final class EnderecoMapper {

    private EnderecoMapper() {
    }

    public static EnderecoResponse toResponse(Endereco endereco) {
        return new EnderecoResponse(
                endereco.getId(),
                endereco.getRua(),
                endereco.getNumero(),
                endereco.getBairro(),
                endereco.getCidade(),
                endereco.getEstado(),
                endereco.getComplemento(),
                endereco.getCep()
        );
    }
}
