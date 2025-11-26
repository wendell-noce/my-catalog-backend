# My Catalog Backend

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

API RESTful desenvolvida com NestJS, Prisma e PostgreSQL (Supabase) para gerenciamento de catálogo com autenticação JWT.

## 🚀 Tecnologias

- **[NestJS](https://nestjs.com/)** - Framework Node.js progressivo
- **[Prisma](https://www.prisma.io/)** - ORM moderno para TypeScript
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[Supabase](https://supabase.com/)** - Backend-as-a-Service (PostgreSQL gerenciado)
- **[JWT](https://jwt.io/)** - Autenticação stateless
- **[Bcrypt](https://github.com/kelektiv/node.bcrypt.js)** - Hash de senhas

## 📋 Pré-requisitos

- Node.js >= 18
- npm ou yarn
- Conta no Supabase (ou PostgreSQL local)

## ⚙️ Instalação

### 1. Clone o repositório

```bash
git clone <seu-repositorio>
cd my-catalog-backend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres:SUA_SENHA@db.xxx.supabase.co:5432/postgres"

# JWT Secrets (gere valores seguros)
JWT_SECRET="seu-secret-super-seguro-minimo-32-caracteres"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="outro-secret-diferente-tambem-forte"
JWT_REFRESH_EXPIRES_IN="7d"

# App
PORT=3000
NODE_ENV=development
```

**Para gerar secrets seguros:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Execute as migrations

```bash
npx prisma migrate dev
```

### 5. Gere o Prisma Client

```bash
npx prisma generate
```

## 🏃 Executando o projeto

### Desenvolvimento

```bash
npm run start:dev
```

A API estará rodando em: `http://localhost:3000`

### Produção

```bash
npm run build
npm run start:prod
```

### Visualizar o banco de dados

```bash
npx prisma studio
```

Abre em: `http://localhost:5555`

## 📁 Estrutura do Projeto

```
src/
├── modules/
│   ├── auth/                    # Autenticação
│   │   ├── dto/                 # Data Transfer Objects
│   │   ├── interfaces/          # Interfaces de resposta
│   │   ├── repositories/        # Acesso a dados (refresh tokens)
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   │
│   └── users/                   # Usuários
│       ├── dto/
│       ├── repositories/        # Acesso a dados (users)
│       ├── users.service.ts
│       └── users.module.ts
│
├── shared/
│   └── prisma/                  # Configuração do Prisma
│       ├── prisma.service.ts
│       └── prisma.module.ts
│
├── app.module.ts
└── main.ts
```

## 🔐 Endpoints da API

### Autenticação

#### Registro de usuário

```http
POST /auth/register
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "senha123",
  "name": "Nome do Usuário"
}
```

**Resposta (201):**

```json
{
  "user": {
    "id": "uuid",
    "email": "usuario@exemplo.com",
    "name": "Nome do Usuário",
    "avatar": null,
    "provider": "local",
    "createdAt": "2024-11-24T..."
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Resposta (200):**

```json
{
  "user": {
    "id": "uuid",
    "email": "usuario@exemplo.com",
    "name": "Nome do Usuário",
    "avatar": null
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

## 🗄️ Banco de Dados

### Schema Prisma

```prisma
model User {
  id            String          @id @default(uuid())
  email         String          @unique
  password      String?
  name          String?
  avatar        String?
  provider      String?         @default("local")
  providerId    String?
  isActive      Boolean         @default(true)
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
  refreshTokens RefreshToken[]
}

model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  expiresAt DateTime
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Diagrama ER

Acesse [dbdiagram.io](https://dbdiagram.io) e cole o código abaixo para visualizar:

```sql
Table users {
  id uuid [pk]
  email varchar(255) [unique, not null]
  password varchar(255)
  name varchar(255)
  avatar varchar(500)
  provider varchar(50) [default: 'local']
  provider_id varchar(255)
  is_active boolean [default: true]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}

Table refresh_tokens {
  id uuid [pk]
  token varchar(500) [unique, not null]
  user_id uuid [not null]
  expires_at timestamp [not null]
  created_at timestamp [default: `now()`]
}

Ref: refresh_tokens.user_id > users.id [delete: cascade]
```

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Coverage
npm run test:cov
```

## 🛠️ Scripts Disponíveis

```bash
npm run start          # Inicia em modo normal
npm run start:dev      # Inicia em modo desenvolvimento (watch)
npm run start:prod     # Inicia em modo produção
npm run build          # Compila o projeto
npm run format         # Formata o código com Prettier
npm run lint           # Executa o ESLint
```

## 🔒 Segurança

- Senhas hasheadas com **bcrypt** (salt rounds: 10)
- Tokens JWT com expiração curta (15min para access, 7 dias para refresh)
- Refresh tokens armazenados no banco para controle de sessões
- Validação de DTOs com **class-validator**
- Variáveis sensíveis em `.env` (não commitadas)

## 📝 Roadmap

- [x] Autenticação JWT
- [x] Cadastro e Login
- [x] Repository Pattern
- [x] Tipagem completa com TypeScript
- [ ] Google OAuth
- [ ] Refresh Token endpoint
- [ ] Guards JWT (rotas protegidas)
- [ ] Roles e Permissions
- [ ] Testes unitários e e2e
- [ ] Documentação Swagger/OpenAPI
- [ ] Rate limiting
- [ ] Docker e Docker Compose

## 🤝 Contribuindo

Contribuições são sempre bem-vindas!

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👤 Autor

**Seu Nome**

- GitHub: [@seu-usuario](https://github.com/seu-usuario)
- LinkedIn: [Seu Nome](https://linkedin.com/in/seu-perfil)

---

⭐️ Se este projeto te ajudou, deixe uma estrela!

**Feito com ❤️ e [NestJS](https://nestjs.com/)**
