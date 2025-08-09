# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.2.0] - 2025-08-09

### Added
- **Pipeline CI/CD completo** com quality gates rigorosos ([adc16bc](https://github.com/user/repo/commit/adc16bc))
  - Cobertura de testes obrigatória (≥80%)
  - Proteção de branches para main/develop
  - Deployment automatizado no Vercel com smoke tests
  - Monitoring contínuo e health checks
  - Rollback automático de emergência
  - Lighthouse audits para performance
  - CODEOWNERS para revisões obrigatórias
  - Security scanning com CodeQL e Trivy
- **Health check endpoint** em `/api/health` com validação de conectividade
- **Monitoring e observabilidade** em produção
- **Configuração completa de CI/CD** para desenvolvimento profissional

### Fixed
- **Proxy inteligente com trailing slash** ([81f2c85](https://github.com/user/repo/commit/81f2c85))
  - PROBLEMA CRÍTICO: Ciclo de falhas entre auth e transcriptions RESOLVIDO
  - Auth endpoints sem slash (/login, /register, /me)
  - Collections com slash (/transcriptions/)
  - Resources com ID sem slash (/transcriptions/123)
  - Text operations sem slash (/texts/normalize, etc)
  - Headers Authorization preservados
  - Sem ciclos de redirect 307

### Security
- **Análise de segurança automatizada** com CodeQL
- **Scanning de vulnerabilidades** com Trivy
- **Headers de segurança** configurados no proxy
- **Validação de tokens** em todas as requisições autenticadas

### Performance
- **Coverage de testes: 97%** - qualidade enterprise
- **Lighthouse CI** para auditoria contínua de performance
- **Proxy otimizado** com lógica baseada em evidência
- **Caching inteligente** para reduzir latência

## [1.1.0] - 2025-08-08

### Added
- **Sistema de processamento de texto** completo
  - Normalização de texto jurídico
  - Extração de entidades legais
  - Comparação de documentos
  - Export para DOCX com formatação
- **Integração Redis/Queue** para processamento assíncrono
- **CORS configurado** para produção

### Fixed
- **Proxy de API robusto** via API Routes do Next.js
- **NEXT_PUBLIC_API_URL configurável** por ambiente
- **Mixed content/CORS resolvido** via rewrites Vercel
- **Preservação de headers Authorization** em todas as requisições

### Changed
- **Arquitetura de proxy** migrada para API Routes (mais estável)
- **Configuração unificada** via variáveis de ambiente

## [1.0.0] - 2025-08-07

### Added
- **Sistema de autenticação JWT completo**
  - Endpoints de login, register, refresh, me
  - Middleware de autenticação
  - Validação de tokens
  - Testes de integração (97% coverage)
- **Sistema de transcrições**
  - Upload de arquivos de áudio/vídeo
  - Listagem com paginação e filtros
  - Detalhamento de transcrições
  - Metadados jurídicos (caso, tribunal, data)
- **Frontend Next.js 14 completo**
  - Páginas de autenticação (login/register)
  - Dashboard com upload e listagem
  - Cliente API com React Query
  - UI com Tailwind CSS + Radix UI
  - Formulários com React Hook Form + Zod

### Security
- **JWT tokens** com refresh automático
- **Proteção CSRF** em todos os endpoints
- **Validação de entrada** com Pydantic/Zod
- **Headers seguros** configurados

### Performance
- **Testes automatizados** (Backend: pytest, Frontend: Jest)
- **Coverage 97%** no backend
- **Linting automatizado** (Black, Flake8, ESLint, Prettier)
- **CI/CD GitHub Actions** estável

## [0.1.0] - 2025-07-29

### Added
- **Estrutura inicial do projeto** com FastAPI (backend) e Next.js (frontend)
- **Configuração Docker Compose** para desenvolvimento
- **Modelos de banco de dados** para usuários e transcrições
- **Documentação automática da API** com Swagger
- **Configuração de desenvolvimento** com hot reload
- **Banco de dados Supabase** com 4 tabelas principais:
  - `transcriptions` - Transcrições com metadados jurídicos
  - `transcription_segments` - Segmentos com timestamps
  - `deposition_comparisons` - Comparações policial vs judicial
  - `legal_templates` - Templates de votos e esquemas
- **Extensão pgvector** para busca semântica e embeddings
- **Políticas RLS** (Row Level Security) em todas as tabelas
- **Template inicial** para voto de tráfico de drogas
- **Índices otimizados** para performance

### Configured
- **PostgreSQL via Supabase** como banco principal
- **Redis Docker** para cache e filas
- **VS Code** com extensões recomendadas
- **Supabase MCP** para gerenciamento do banco
- **Sistema de templates jurídicos** com variáveis
- **Estrutura para comparação** de depoimentos

---

## Notas de Desenvolvimento

### Fase 1 - COMPLETA ✅
- ✅ **Autenticação JWT** - Sistema completo com testes
- ✅ **Upload de arquivos** - Funcional com validação
- ✅ **Interface de usuário** - Dashboard responsivo
- ✅ **Testes automatizados** - 97% coverage
- ✅ **CI/CD Pipeline** - Deploy automático
- ✅ **Proxy inteligente** - Trailing slash resolvido
- ✅ **Documentação** - Atualizada e completa

### Commits Importantes
- [adc16bc](https://github.com/user/repo/commit/adc16bc) - Pipeline CI/CD completo
- [81f2c85](https://github.com/user/repo/commit/81f2c85) - Proxy inteligente (trailing slash)
- [02b391c](https://github.com/user/repo/commit/02b391c) - Integração processamento de texto
- [bcca19f](https://github.com/user/repo/commit/bcca19f) - Autenticação JWT inicial
- [35c8d1d](https://github.com/user/repo/commit/35c8d1d) - Sistema de transcrições

### Breaking Changes
- **v1.0.0**: Migração para JWT authentication (incompatível com sessões antigas)
- **v1.1.0**: Nova arquitetura de proxy via API Routes
- **v1.2.0**: Requisitos de coverage obrigatórios no CI/CD

### Próximas Fases
- **Fase 2**: Integração OpenAI Whisper para transcrição
- **Fase 3**: Editor de transcrições em tempo real
- **Fase 4**: Sistema de templates jurídicos avançado

---

*Este projeto segue as melhores práticas de desenvolvimento com foco em qualidade, segurança e performance enterprise.*