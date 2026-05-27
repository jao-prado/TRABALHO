-- Pizzaria Barueri
-- Sprint 1 - Modelagem inicial do banco SQL Server

IF DB_ID(N'pizzaria_barueri') IS NULL
BEGIN
    CREATE DATABASE pizzaria_barueri;
END
GO

USE pizzaria_barueri;
GO

IF OBJECT_ID(N'dbo.itens_pedido', N'U') IS NOT NULL DROP TABLE dbo.itens_pedido;
IF OBJECT_ID(N'dbo.pedidos', N'U') IS NOT NULL DROP TABLE dbo.pedidos;
IF OBJECT_ID(N'dbo.produtos', N'U') IS NOT NULL DROP TABLE dbo.produtos;
IF OBJECT_ID(N'dbo.categorias', N'U') IS NOT NULL DROP TABLE dbo.categorias;
IF OBJECT_ID(N'dbo.enderecos', N'U') IS NOT NULL DROP TABLE dbo.enderecos;
IF OBJECT_ID(N'dbo.usuarios', N'U') IS NOT NULL DROP TABLE dbo.usuarios;
GO

CREATE TABLE dbo.usuarios (
    id BIGINT IDENTITY(1,1) NOT NULL,
    nome NVARCHAR(120) NOT NULL,
    email NVARCHAR(160) NOT NULL,
    senha_hash NVARCHAR(255) NOT NULL,
    telefone NVARCHAR(20) NULL,
    role NVARCHAR(20) NOT NULL,
    ativo BIT NOT NULL CONSTRAINT DF_usuarios_ativo DEFAULT 1,
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_usuarios_created_at DEFAULT SYSDATETIME(),

    CONSTRAINT PK_usuarios PRIMARY KEY (id),
    CONSTRAINT UQ_usuarios_email UNIQUE (email),
    CONSTRAINT CK_usuarios_role CHECK (role IN ('CLIENTE', 'ATENDENTE', 'ADMIN'))
);
GO

CREATE TABLE dbo.enderecos (
    id BIGINT IDENTITY(1,1) NOT NULL,
    usuario_id BIGINT NOT NULL,
    rua NVARCHAR(160) NOT NULL,
    numero NVARCHAR(20) NOT NULL,
    bairro NVARCHAR(100) NOT NULL,
    cidade NVARCHAR(100) NOT NULL,
    estado CHAR(2) NOT NULL,
    complemento NVARCHAR(120) NULL,
    cep CHAR(8) NOT NULL,

    CONSTRAINT PK_enderecos PRIMARY KEY (id),
    CONSTRAINT FK_enderecos_usuarios FOREIGN KEY (usuario_id)
        REFERENCES dbo.usuarios(id),
    CONSTRAINT CK_enderecos_estado CHECK (estado LIKE '[A-Z][A-Z]'),
    CONSTRAINT CK_enderecos_cep CHECK (cep NOT LIKE '%[^0-9]%')
);
GO

CREATE TABLE dbo.categorias (
    id BIGINT IDENTITY(1,1) NOT NULL,
    nome NVARCHAR(80) NOT NULL,
    descricao NVARCHAR(255) NULL,
    ativo BIT NOT NULL CONSTRAINT DF_categorias_ativo DEFAULT 1,

    CONSTRAINT PK_categorias PRIMARY KEY (id),
    CONSTRAINT UQ_categorias_nome UNIQUE (nome)
);
GO

CREATE TABLE dbo.produtos (
    id BIGINT IDENTITY(1,1) NOT NULL,
    nome NVARCHAR(120) NOT NULL,
    descricao NVARCHAR(500) NULL,
    preco DECIMAL(10,2) NOT NULL,
    imagem_url NVARCHAR(500) NULL,
    categoria_id BIGINT NOT NULL,
    ativo BIT NOT NULL CONSTRAINT DF_produtos_ativo DEFAULT 1,

    CONSTRAINT PK_produtos PRIMARY KEY (id),
    CONSTRAINT FK_produtos_categorias FOREIGN KEY (categoria_id)
        REFERENCES dbo.categorias(id),
    CONSTRAINT CK_produtos_preco CHECK (preco > 0)
);
GO

CREATE TABLE dbo.pedidos (
    id BIGINT IDENTITY(1,1) NOT NULL,
    usuario_id BIGINT NOT NULL,
    endereco_entrega_id BIGINT NOT NULL,
    status NVARCHAR(30) NOT NULL CONSTRAINT DF_pedidos_status DEFAULT 'PENDENTE',
    forma_pagamento NVARCHAR(40) NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    observacao NVARCHAR(500) NULL,
    created_at DATETIME2(0) NOT NULL CONSTRAINT DF_pedidos_created_at DEFAULT SYSDATETIME(),

    CONSTRAINT PK_pedidos PRIMARY KEY (id),
    CONSTRAINT FK_pedidos_usuarios FOREIGN KEY (usuario_id)
        REFERENCES dbo.usuarios(id),
    CONSTRAINT FK_pedidos_enderecos FOREIGN KEY (endereco_entrega_id)
        REFERENCES dbo.enderecos(id),
    CONSTRAINT CK_pedidos_status CHECK (
        status IN (
            'PENDENTE',
            'CONFIRMADO',
            'EM_PREPARO',
            'SAIU_PARA_ENTREGA',
            'ENTREGUE',
            'CANCELADO'
        )
    ),
    CONSTRAINT CK_pedidos_valor_total CHECK (valor_total >= 0)
);
GO

CREATE TABLE dbo.itens_pedido (
    id BIGINT IDENTITY(1,1) NOT NULL,
    pedido_id BIGINT NOT NULL,
    produto_id BIGINT NOT NULL,
    quantidade INT NOT NULL,
    valor_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,

    CONSTRAINT PK_itens_pedido PRIMARY KEY (id),
    CONSTRAINT FK_itens_pedido_pedidos FOREIGN KEY (pedido_id)
        REFERENCES dbo.pedidos(id),
    CONSTRAINT FK_itens_pedido_produtos FOREIGN KEY (produto_id)
        REFERENCES dbo.produtos(id),
    CONSTRAINT CK_itens_pedido_quantidade CHECK (quantidade > 0),
    CONSTRAINT CK_itens_pedido_valor_unitario CHECK (valor_unitario > 0),
    CONSTRAINT CK_itens_pedido_subtotal CHECK (subtotal > 0)
);
GO

CREATE INDEX IX_usuarios_email ON dbo.usuarios(email);
CREATE INDEX IX_enderecos_usuario_id ON dbo.enderecos(usuario_id);
CREATE INDEX IX_produtos_categoria_id ON dbo.produtos(categoria_id);
CREATE INDEX IX_produtos_ativo ON dbo.produtos(ativo);
CREATE INDEX IX_pedidos_usuario_id ON dbo.pedidos(usuario_id);
CREATE INDEX IX_pedidos_status ON dbo.pedidos(status);
CREATE INDEX IX_itens_pedido_pedido_id ON dbo.itens_pedido(pedido_id);
GO

INSERT INTO dbo.categorias (nome, descricao)
VALUES
    ('Pizzas', 'Pizzas salgadas do cardapio'),
    ('Bebidas', 'Bebidas para acompanhar o pedido'),
    ('Sobremesas', 'Sobremesas disponiveis no cardapio');
GO
