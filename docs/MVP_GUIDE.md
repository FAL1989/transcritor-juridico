# Guia do MVP – Transcritor Jurídico

Este guia descreve o passo a passo para colocar o MVP 100% funcional (dev e produção), com checagens de saúde, variáveis de ambiente e testes rápidos do fluxo principal.

## 1) Pré‑requisitos
- Docker e Docker Compose
- Porta 3000 (frontend) e 8000 (backend) livres
- ffmpeg (já embutido na imagem do backend)

## 2) Variáveis de Ambiente
Crie um arquivo `backend/.env` com, no mínimo:

```
SECRET_KEY=troque-por-uma-chave-segura
DATABASE_URL=postgresql+asyncpg://postgres:password@postgres:5432/transcritor_juridico
REDIS_URL=redis://redis:6379/0
# Origens permitidas em PRODUÇÃO (ajuste para seu domínio):
BACKEND_CORS_ORIGINS=["http://localhost:3000"]
```

Frontend (produção) deve ser buildado com:

```
NEXT_PUBLIC_API_URL=https://SEU_BACKEND/api/v1
```

Em desenvolvimento, o default é `http://localhost:8000/api/v1`.

## 3) Subir em desenvolvimento

```
make dev
# Acesse: http://localhost:3000
# Docs API: http://localhost:8000/api/v1/docs
```

Check rápido de CORS:

```
curl -i -X OPTIONS http://localhost:8000/api/v1/auth/register \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: content-type"
```

Deve retornar 200 com os headers `access-control-allow-*`.

## 4) Fluxo funcional (dev)
1. Registro/login
   - `http://localhost:3000/auth/register` → criar usuário
   - `http://localhost:3000/auth/login` → fazer login (tokens armazenados no navegador)
2. Dashboard
   - Áudio/Vídeo: enviar arquivo, ver item na listagem (status PENDING)
   - Texto/Documentos:
     - Colar texto e aplicar modelo (Termo/Despacho) e anonimização sob demanda
     - Upload de PDF/DOCX para extrair texto
     - Comparar dois textos (policial vs judicial) – diferenças por linha

## 5) Migrações de banco (Alembic)
- Gerar migração inicial a partir dos modelos atuais:

```
make migrate-create m="initial"
make migrate
```

- Em produção, desabilitar `create_all` no startup (manter para dev). Use sempre Alembic.

## 6) Build e deploy de produção
- Backend: configure `SECRET_KEY` fixo e `BACKEND_CORS_ORIGINS` para o domínio do frontend.
- Frontend: build com a URL da API de produção.

```
# Backend
docker-compose up -d postgres redis
docker-compose up -d --build backend

# Frontend (injeta a API no build)
docker-compose build --build-arg NEXT_PUBLIC_API_URL=https://SEU_BACKEND/api/v1 frontend
docker-compose up -d frontend
```

- Coloque um proxy reverso (Nginx/Caddy) com TLS na frente dos serviços (fora do escopo deste guia).

## 7) Troubleshooting
- Erro Network/CORS no browser:
  - Confirme `BACKEND_CORS_ORIGINS` contém o domínio do frontend
  - Confirme o frontend foi buildado com `NEXT_PUBLIC_API_URL` correto
- Backend caindo em import de `docx`/`PyPDF2`:
  - O serviço de textos usa imports “lazy”; deve subir mesmo sem os pacotes
- Teste rápido do backend:

```
# Registro
curl -s -X POST http://localhost:8000/api/v1/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"t@ex.com","full_name":"Test","password":"StrongP@ssw0rd"}'

# Login
curl -s -X POST http://localhost:8000/api/v1/auth/login \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'username=t@ex.com&password=StrongP@ssw0rd'
```

## 8) Roteiro para 100% do MVP
- Infra/config
  - [ ] `SECRET_KEY` fixo em produção; CORS com domínio do frontend
  - [ ] Alembic aplicado (sem `create_all` em prod)
- Áudio/Vídeo
  - [x] Upload e listagem protegidos
  - [ ] Worker assíncrono (Redis + RQ/Celery/Arq)
  - [ ] STT com `faster-whisper` (CPU/GPU) e atualização de `status/duration/full_text`
  - [ ] SSE/WebSocket de progresso no frontend
- Texto/Documento
  - [x] Normalização + modelos (Termo/Despacho) + anonimização opcional
  - [x] Extração de PDF/DOCX (MVP sem OCR)
  - [x] Comparação A vs B por linha
  - [ ] Export DOCX/pdf com assinatura (futuro)
- LLM
  - [ ] Serviço `app/services/llm.py` (Azure OpenAI ou local) com modos “fiel” e “assistido”
  - [ ] Pós-processar STT (pontuação/normalização/summary)
  - [ ] Extração de metadados e preenchimento de templates
- Segurança/Operação
  - [ ] RBAC básico (Juíza/Escrevente/Perito)
  - [ ] Auditoria de ações
  - [ ] Rate limiting (slowapi) e logs estruturados
- Qualidade
  - [ ] Testes backend (auth/transcriptions/texts) e frontend (Jest)
  - [ ] Observabilidade (Sentry/Prometheus) e backups

---

Para dúvidas ou erros, ver `README.md` e `TODO.md`. Atualize este guia conforme as sprints.

