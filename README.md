# Transcritor Jurídico

Sistema profissional de transcrição para o setor jurídico, com suporte para transcrição automática de audiências, gestão de documentos e exportação em múltiplos formatos.

## 🚀 Tecnologias

### Backend
- **Python 3.11** com **FastAPI**
- **Supabase** (PostgreSQL + Auth + Storage)
- **pgvector** para embeddings e busca semântica
- **Redis** para cache e filas
- **Whisper AI** para transcrição
- **Azure OpenAI** (GPT-4o mini) para processamento de texto

### Frontend
- **Next.js 14** com TypeScript
- **Supabase Client** para auth e dados
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

**Estado Atual**: MVP em desenvolvimento - Banco de dados criado no Supabase ✅

### O que está pronto:
- ✅ Estrutura completa do projeto (Backend + Frontend)
- ✅ Docker Compose configurado para desenvolvimento local
- ✅ FastAPI com documentação automática
- ✅ Next.js 14 com TypeScript
- ✅ Configurações de desenvolvimento (ESLint, Prettier, Black)
- ✅ Estrutura de testes configurada
- ✅ CI/CD básico com GitHub Actions
- ✅ **Banco de dados Supabase criado com todas as tabelas**
- ✅ **pgvector habilitado para embeddings**
- ✅ **RLS (Row Level Security) configurado**
- ✅ **Template de voto para tráfico de drogas**

### Banco de Dados Supabase:
- **Projeto**: Transcritor Jurídico
- **ID**: eyrrkkopkaaszrynphpm
- **URL**: https://eyrrkkopkaaszrynphpm.supabase.co
- **Região**: sa-east-1 (São Paulo)

### Tabelas Criadas:
1. **transcriptions** - Transcrições principais com metadados jurídicos
2. **transcription_segments** - Segmentos com timestamps e identificação de palestrantes
3. **deposition_comparisons** - Comparações policial vs judicial com embeddings
4. **legal_templates** - Templates de votos e esquemas jurídicos

### Próximos passos:
Ver arquivo [TODO.md](TODO.md) para lista completa de funcionalidades a implementar.

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

## 📚 Documentação Adicional

- [Documentação da API](http://localhost:8000/api/v1/docs)
- [Estrutura do Banco de Dados](DATABASE.md)
- [Lista de Tarefas](TODO.md)
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