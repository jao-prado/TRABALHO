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

## Configuracao Local

Defina as variaveis de ambiente antes de iniciar a API:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET`
- `CORS_ALLOWED_ORIGINS`

O arquivo `application-example.properties` mostra os nomes oficiais das propriedades.
