# Deployment - Transcritor Jurídico

## 🚀 Estratégia de Deploy por Fases

### Fase 1: MVP Individual (Vercel + Supabase)

#### Setup Inicial

1. **Supabase**
   ```bash
   # Criar projeto em supabase.com
   # Copiar URL e ANON_KEY
   ```

2. **Database Schema**
   ```sql
   -- Habilitar pgvector
   CREATE EXTENSION IF NOT EXISTS vector;

   -- Tabela de transcrições
   CREATE TABLE transcriptions (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id),
     title TEXT NOT NULL,
     file_url TEXT,
     status TEXT DEFAULT 'pending',
     transcript_text TEXT,
     metadata JSONB,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Tabela de comparações
   CREATE TABLE deposition_comparisons (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     transcription_id UUID REFERENCES transcriptions(id),
     police_text TEXT,
     court_text TEXT,
     similarity FLOAT,
     chosen_version TEXT,
     merged_text TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Tabela de templates
   CREATE TABLE templates (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id),
     name TEXT NOT NULL,
     crime_type TEXT,
     template_structure JSONB,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

3. **Edge Functions**
   ```typescript
   // supabase/functions/transcribe/index.ts
   import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
   import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

   serve(async (req) => {
     const { file_url, transcription_id } = await req.json()
     
     // Chamar Whisper API
     const transcription = await callWhisperAPI(file_url)
     
     // Atualizar banco
     const supabase = createClient(
       Deno.env.get('SUPABASE_URL')!,
       Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
     )
     
     await supabase
       .from('transcriptions')
       .update({ 
         transcript_text: transcription.text,
         status: 'completed' 
       })
       .eq('id', transcription_id)
     
     return new Response(JSON.stringify({ success: true }))
   })
   ```

4. **Frontend Deploy**
   ```bash
   # Instalar Vercel CLI
   npm i -g vercel

   # Deploy
   cd frontend
   vercel --prod
   ```

#### Variáveis de Ambiente

**.env.local (Frontend)**
```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
```

**Supabase Dashboard > Edge Functions > Secrets**
```
OPENAI_API_KEY=sk-...
AZURE_OPENAI_ENDPOINT=https://...
```

### Fase 2: Produção Escalável

#### Opção A: Continuar com Supabase Pro
- **Custo**: R$ 125-625/mês
- **Quando**: 10-50 usuários
- **Benefícios**: Zero manutenção

#### Opção B: Migrar para VPS
- **Custo**: R$ 250-500/mês
- **Quando**: Controle total necessário
- **Stack**: Docker Compose em Hetzner/Contabo

### Fase 3: Enterprise

#### Cloud Gerenciado
- **Custo**: R$ 1000-2500/mês
- **Quando**: 100+ usuários
- **Stack**: Kubernetes + managed services

## 📋 Checklist de Segurança

### LGPD Compliance
- [ ] RLS (Row Level Security) no Supabase
- [ ] Criptografia de arquivos sensíveis
- [ ] Logs de acesso auditáveis
- [ ] Política de retenção de dados
- [ ] Pseudonimização antes de enviar para LLM

### Configuração RLS
```sql
-- Habilitar RLS
ALTER TABLE transcriptions ENABLE ROW LEVEL SECURITY;

-- Política: usuários só veem seus próprios dados
CREATE POLICY "Users can only see their own transcriptions"
  ON transcriptions
  FOR ALL
  USING (auth.uid() = user_id);
```

## 🔧 Scripts Úteis

### Backup Automático
```bash
#!/bin/bash
# backup-supabase.sh
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
rclone copy backup_*.sql gdrive:backups/transcritor
```

### Monitoramento
```javascript
// Vercel Functions API
export default async function handler(req, res) {
  const health = await checkHealth()
  res.status(200).json({ 
    status: 'healthy',
    uptime: process.uptime(),
    ...health 
  })
}
```

## 📊 Estimativa de Custos por Fase

| Fase | Usuários | Infra | LLM | Total/mês |
|------|----------|-------|-----|-----------|
| MVP | 1 | R$ 0 | R$ 10 | R$ 10 |
| Beta | 5-10 | R$ 125 | R$ 50 | R$ 175 |
| Produção | 10-50 | R$ 250 | R$ 200 | R$ 450 |
| Escala | 50-100 | R$ 625 | R$ 500 | R$ 1125 |
| Enterprise | 100+ | R$ 1500 | R$ 1000 | R$ 2500 |

## 🚦 Quando Migrar

### Continuar com Vercel + Supabase se:
- ✅ < 50 usuários ativos
- ✅ < 500GB storage
- ✅ Sem requisitos on-premise
- ✅ Uptime 99.9% é suficiente

### Migrar para VPS/Cloud se:
- ❌ Requisitos de compliance específicos
- ❌ Necessidade de processamento pesado local
- ❌ Integração com sistemas legados
- ❌ Controle total sobre dados

## 📞 Suporte

Para dúvidas sobre deploy:
1. Documentação Supabase: https://supabase.com/docs
2. Documentação Vercel: https://vercel.com/docs
3. Issues do projeto: github.com/seu-usuario/transcritor-juridico