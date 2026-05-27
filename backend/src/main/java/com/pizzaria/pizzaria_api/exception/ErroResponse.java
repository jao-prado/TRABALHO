package com.pizzaria.pizzaria_api.exception;

import java.time.LocalDateTime;
import java.util.List;

public record ErroResponse(
        LocalDateTime timestamp,
        int status,
        String erro,
        List<String> mensagens
) {
}
