# Transcritor Jurídico

Sistema profissional de transcrição para o setor jurídico, com suporte para transcrição automática de audiências, gestão de documentos e exportação em múltiplos formatos.

## 🚀 Tecnologias

### Backend
- **Python 3.11** com **FastAPI**
- **PostgreSQL** (SQLAlchemy Async)
- **pgvector** (planejado) para embeddings e busca semântica
- **Redis** para cache e filas
- **Whisper AI** para transcrição
- **Azure OpenAI** (GPT-4o mini) para processamento de texto

### Frontend
- **Next.js 14** com TypeScript
- **JWT** para auth (frontend consumindo API via API Routes proxy)
- **React Query** para gerenciamento de estado
- **Tailwind CSS** para estilização
- **React Hook Form** + **Zod** para formulários
- **Radix UI** para componentes acessíveis

## 📋 Pré-requisitos

- Docker e Docker Compose
- Python 3.11+
- Node.js 18+
- Make (opcional, mas recomendado)

## 🔧 Instalação e Configuração

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/transcritor-juridico.git
cd transcritor-juridico
```

### 2. Configure as variáveis de ambiente
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

### 3. Inicie com Docker (Recomendado)
```bash
# Iniciar todos os serviços
make dev

# Ou manualmente
docker-compose up -d
```

### 4. Instalação Local (Desenvolvimento)

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\\Scripts\\activate  # Windows

pip install -r requirements.txt
```

#### Frontend
```bash
cd frontend
npm install
```

## 🚀 Executando o Projeto

### Com Docker
```bash
# Iniciar
make up

# Parar
make down

# Ver logs
make logs
```

### Desenvolvimento Local

#### Backend
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

#### Frontend
```bash
cd frontend
npm run dev
```

## 📍 URLs de Acesso

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Documentação API**: http://localhost:8000/api/v1/docs
- **PgAdmin**: http://localhost:5050 (user: admin@transcritor.com, senha: admin)

## 🔌 Proxy de API no Frontend (Vercel Functions)

O frontend usa uma rota serverless de captura total em `frontend/src/app/api/[...path]/route.ts` para proxyar todas as chamadas para o backend, evitando problemas de CORS, redirects 307 e mixed content. O cliente do frontend consome sempre `"/api"`.

- Backend de destino é controlado por variável de ambiente no servidor: `BACKEND_URL` (preferencial) ou `NEXT_PUBLIC_API_URL`. Exemplo:

```bash
# Vercel/produção (Project Settings → Environment Variables)
BACKEND_URL=https://api.SEUDOMINIO/api/v1
# opcional (fallback)
NEXT_PUBLIC_API_URL=https://api.SEUDOMINIO/api/v1
```

Em desenvolvimento local, se não definido, o proxy usa `http://localhost:8000/api/v1` por padrão.

Endpoints do frontend devem chamar sempre caminhos relativos:

```ts
// exemplo
await fetch('/api/auth/login', { method: 'POST', body: ... })
```

## 🧪 Testes

### Executar todos os testes
```bash
make test
```

### Backend
```bash
cd backend
pytest -v
```

### Frontend
```bash
cd frontend
npm test
```

## 📝 Comandos Úteis

```bash
# Ver todos os comandos disponíveis
make help

# Formatar código
make format

# Executar linters
make lint

# Criar migração de banco
make migrate-create m="descrição da migração"

# Aplicar migrações
make migrate

# Acessar shell do PostgreSQL
make db-shell

# Acessar Redis CLI
make redis-cli
```

## 🏗️ Estrutura do Projeto

```
transcritor-juridico/
├── backend/
│   ├── app/
│   │   ├── api/          # Endpoints da API
│   │   ├── core/         # Configurações core
│   │   ├── models/       # Modelos SQLAlchemy
│   │   ├── schemas/      # Schemas Pydantic
│   │   ├── services/     # Lógica de negócio
│   │   └── utils/        # Utilitários
│   ├── tests/            # Testes
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/          # App directory (Next.js 14)
│   │   ├── components/   # Componentes React
│   │   ├── hooks/        # Custom hooks
│   │   ├── lib/          # Bibliotecas e utilitários
│   │   └── types/        # TypeScript types
│   └── package.json
├── docker/               # Configurações Docker
├── database/            # Scripts SQL
├── .github/             # GitHub Actions
├── docker-compose.yml
├── Makefile
└── README.md
```

## 🔒 Segurança

- Autenticação JWT implementada
- Criptografia de senhas com bcrypt
- CORS configurado
- Rate limiting
- Validação de entrada com Pydantic
- Sanitização de uploads de arquivo

## 📊 Status do Projeto

**Estado Atual**: MVP em desenvolvimento - API e modelos iniciais com PostgreSQL local ✅

### O que está pronto:
- ✅ Estrutura completa do projeto (Backend + Frontend)
- ✅ Docker Compose configurado para desenvolvimento local
- ✅ FastAPI com documentação automática
- ✅ Next.js 14 com TypeScript
- ✅ Configurações de desenvolvimento (ESLint, Prettier, Black)
- ✅ Estrutura de testes configurada
- ✅ CI/CD básico com GitHub Actions
- ✅ **Autenticação JWT (register/login/refresh/me)**
- ✅ **Modelos iniciais (User, Transcription, Segment)**
- ✅ **Docker Compose com Postgres/Redis/Backend/Frontend**
- ⏳ **Alembic migrations** (em progresso)
- ⏳ **Whisper integração** (planejado)


### Tabelas Criadas:
1. **transcriptions** - Transcrições principais com metadados jurídicos
2. **transcription_segments** - Segmentos com timestamps e identificação de palestrantes
3. **deposition_comparisons** - Comparações policial vs judicial com embeddings
4. **legal_templates** - Templates de votos e esquemas jurídicos

### Próximos passos:
- Consolidar Alembic e desabilitar `create_all` em produção
- Integrar STT (faster-whisper) e progresso em tempo real
- Testes E2E (Playwright) para o fluxo de upload e autenticação

## 🚢 Deploy

### Produção com Docker
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Variáveis de Ambiente de Produção
- Configure DATABASE_URL para banco PostgreSQL de produção
- Configure REDIS_URL para Redis de produção
- Defina SECRET_KEY única e segura
- Configure serviço de email SMTP
- Configure storage S3 se necessário
- Configure BACKEND_URL no ambiente do frontend (Vercel) apontando para `https://SEU_BACKEND/api/v1`

## 📚 Documentação Adicional

- [Documentação da API](http://localhost:8000/api/v1/docs)
- [Guia do MVP](docs/MVP_GUIDE.md)
- [Estrutura do Banco de Dados](DATABASE.md)
- [Guia de Deploy](DEPLOYMENT.md)
- [Changelog](CHANGELOG.md)
- [Guia de Contribuição](CONTRIBUTING.md) *(a criar)*

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua branch de feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.