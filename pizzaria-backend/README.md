# Backend

API do sistema Pizzaria Barueri.

## Projeto

O projeto Spring Boot fica em:

```text
pizzaria-api/
```

## Arquitetura

```text
controller/
service/
repository/
entity/
dto/
config/
exception/
mapper/
```

## Regras

- Controller recebe requisicoes e delega para services.
- Service concentra regras de negocio.
- Repository acessa o banco.
- DTO separa entrada e saida da API.
- Config centraliza seguranca, CORS e infraestrutura.
