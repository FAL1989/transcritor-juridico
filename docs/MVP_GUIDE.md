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
# Em produção, use uma lista JSON de origens permitidas e/ou regex:
BACKEND_CORS_ORIGINS=["https://SEU_FRONTEND"]
# Opcional: regex para domínios (ex.: Vercel + sslip.io)
BACKEND_CORS_ORIGIN_REGEX="https://(.*\\.vercel\\.app|.*\\.sslip\\.io)"
```

Frontend (produção) deve ser buildado com:

```
# Preferencialmente use BACKEND_URL no ambiente do servidor (Vercel):
# BACKEND_URL=https://SEU_BACKEND/api/v1
# Como fallback (injeta no build):
NEXT_PUBLIC_API_URL=https://SEU_BACKEND/api/v1
```

Em desenvolvimento, o default é `http://localhost:8000/api/v1`.

Observação: no Vercel, configure o projeto com Preset "Next.js", Root Directory `frontend/` e não
defina "Output Directory" manualmente. Defina `BACKEND_URL` (e opcionalmente `NEXT_PUBLIC_API_URL`) nos Environment Variables.

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
      - Upload de PDF/DOCX para extrair texto (imports lazy; backend sobe mesmo sem as libs)
      - Comparar dois textos (policial vs judicial) – diferenças por linha
      - Exportar DOCX básico (python-docx)

## 5) Migrações de banco (Alembic)
- Gerar migração inicial a partir dos modelos atuais:

```
make migrate-create m="initial"
make migrate
```

 - Em produção, desabilitar `create_all` no startup (manter para dev). Use sempre Alembic.

## 6) Build e deploy de produção
- Backend: configure `SECRET_KEY` fixo e `BACKEND_CORS_ORIGINS`/`BACKEND_CORS_ORIGIN_REGEX` para o domínio do frontend.
- Frontend: build com a URL da API de produção.

```
# Backend (sem expor portas; usar proxy reverso em produção)
docker-compose up -d postgres redis
docker-compose up -d --build backend

# Frontend (injeta a API no build caso não use BACKEND_URL)
docker-compose build --build-arg NEXT_PUBLIC_API_URL=https://SEU_BACKEND/api/v1 frontend
docker-compose up -d frontend
```

- Coloque um proxy reverso (Nginx/Caddy) com TLS na frente dos serviços. Exemplo Nginx:

```
server {
  listen 80;
  server_name api.SEUDOMINIO;
  client_max_body_size 100m;
  location / {
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_pass http://127.0.0.1:18000; # mapear backend interno
  }
}
```

Para TLS automático com Let's Encrypt:

```
certbot --nginx -d api.SEUDOMINIO -m seu-email@dominio.com --agree-tos --redirect --non-interactive
```

## 7) Troubleshooting
- Erro Network/CORS no browser:
  - Confirme `BACKEND_CORS_ORIGINS` contém o domínio do frontend
  - Confirme o frontend foi buildado com `NEXT_PUBLIC_API_URL` correto
- Se usar regex, confirme `BACKEND_CORS_ORIGIN_REGEX` válido
- Backend caindo em import de `docx`/`PyPDF2`:
  - O serviço de textos usa imports “lazy”; deve subir mesmo sem os pacotes
- CI quebrando no frontend por ESLint:
  - Garanta `@typescript-eslint/parser` e `@typescript-eslint/eslint-plugin` instalados e declarados no `.eslintrc`
  - Dica: em CI, garanta permissões de `.next/cache` antes do `next build`
    (`mkdir -p .next/cache && chmod -R 777 .next`)
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
  - [x] `SECRET_KEY` fixo em produção; CORS com domínio do frontend (ORIGINS/REGEX)
  - [ ] Alembic aplicado (sem `create_all` em prod)
- Áudio/Vídeo
  - [x] Upload e listagem protegidos
  - [x] Worker assíncrono (Redis + RQ) – MVP
  - [ ] STT com `faster-whisper` (CPU/GPU) e atualização de `status/duration/full_text`
  - [ ] SSE/WebSocket de progresso no frontend
- Texto/Documento
  - [x] Normalização + modelos (Termo/Despacho) + anonimização opcional
  - [x] Extração de PDF/DOCX (MVP sem OCR)
  - [x] Comparação A vs B por linha
  - [x] Export DOCX básico
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
  - [x] Testes backend (auth/transcriptions/texts) cobrem fluxo MVP
  - [ ] Testes frontend (Jest) e E2E
  - [ ] Observabilidade (Sentry/Prometheus) e backups

---

Para dúvidas ou erros, ver `README.md`. Atualize este guia conforme as sprints.

