# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Adicionado - 29/07/2025
- Estrutura inicial do projeto com FastAPI (backend) e Next.js (frontend)
- Configuração do Docker Compose para desenvolvimento
- Modelos de banco de dados para usuários e transcrições
- Documentação automática da API com Swagger
- Configuração de linters e formatadores (Black, Flake8, ESLint, Prettier)
- GitHub Actions para CI/CD
- Estrutura de testes com pytest e Jest
- README.md com instruções de instalação e uso
- TODO.md com roadmap do projeto
- **Banco de dados Supabase com 4 tabelas principais**:
  - `transcriptions` - Armazena transcrições com metadados jurídicos
  - `transcription_segments` - Segmentos com timestamps
  - `deposition_comparisons` - Comparações policial vs judicial
  - `legal_templates` - Templates de votos e esquemas
- **Extensão pgvector para busca semântica e embeddings**
- **Políticas RLS (Row Level Security) em todas as tabelas**
- **Template inicial para voto de tráfico de drogas**
- **Índices otimizados para performance**

### Configurado
- PostgreSQL como banco de dados principal (via Supabase)
- Redis para cache e filas (Docker local)
- Ambiente de desenvolvimento com hot reload
- CORS e configurações de segurança básicas
- VS Code com extensões recomendadas
- **Supabase MCP para gerenciamento do banco**
- **Estrutura para comparação automática de depoimentos**
- **Sistema de templates jurídicos com variáveis**

## [0.1.0] - TBD

*Primeira versão será lançada após implementação das funcionalidades básicas de autenticação e upload.*