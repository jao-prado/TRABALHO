# Deploy

## Frontend - Vercel

Use o mesmo repositorio GitHub e configure:

- Root Directory: `frontend`
- Framework Preset: `Vite`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`

Variavel de ambiente:

```env
VITE_API_URL=https://URL_DO_BACKEND/api
```

## Backend - Railway ou Koyeb

Use o mesmo repositorio GitHub e configure:

- Root Directory: `backend`
- Build Command: `./mvnw clean package -DskipTests`
- Start Command: `java -jar target/pizzaria-barueri-api-0.0.1-SNAPSHOT.jar`

Variaveis de ambiente:

```env
DB_URL=jdbc:sqlserver://pizzaria_barueri.mssql.somee.com;databaseName=pizzaria_barueri;encrypt=true;trustServerCertificate=true
DB_USERNAME=joao_pedro_SQLLogin_2
DB_PASSWORD=definir-no-painel
JWT_SECRET=definir-chave-forte-com-mais-de-32-caracteres
JWT_EXPIRATION_MS=86400000
CORS_ALLOWED_ORIGINS=https://trabalho-bice-three.vercel.app
```

## Banco - Somee

Execute o script abaixo no banco SQL Server do Somee:

```text
sql/pizzaria_bd.sql
```

O backend usa `spring.jpa.hibernate.ddl-auto=validate`, entao as tabelas devem existir antes da API iniciar.