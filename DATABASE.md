# Estrutura do Banco de Dados - Transcritor Jurídico

## 🗄️ Informações do Projeto Supabase

- **Nome**: Transcritor Jurídico
- **ID**: eyrrkkopkaaszrynphpm
- **URL**: https://eyrrkkopkaaszrynphpm.supabase.co
- **Região**: sa-east-1 (São Paulo)
- **Database**: PostgreSQL 17.4.1

## 📊 Tabelas

### 1. transcriptions
Armazena as transcrições principais com metadados jurídicos.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único (PK) |
| user_id | UUID | Referência ao usuário (FK -> auth.users) |
| title | TEXT | Título da transcrição |
| original_filename | TEXT | Nome do arquivo original |
| file_url | TEXT | URL do arquivo no storage |
| file_size | BIGINT | Tamanho do arquivo em bytes |
| duration | FLOAT | Duração em segundos |
| status | TEXT | Status: pending, processing, completed, failed, reviewed |
| language | TEXT | Idioma (padrão: 'pt') |
| case_number | TEXT | Número do processo |
| court | TEXT | Tribunal/Vara |
| hearing_date | TIMESTAMPTZ | Data da audiência |
| participants | JSONB | Lista de participantes |
| full_text | TEXT | Texto completo da transcrição |
| summary | TEXT | Resumo gerado |
| created_at | TIMESTAMPTZ | Data de criação |
| updated_at | TIMESTAMPTZ | Data de atualização |
| completed_at | TIMESTAMPTZ | Data de conclusão |

### 2. transcription_segments
Segmentos da transcrição com timestamps e identificação de palestrantes.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único (PK) |
| transcription_id | UUID | Referência à transcrição (FK) |
| start_time | FLOAT | Tempo inicial em segundos |
| end_time | FLOAT | Tempo final em segundos |
| text | TEXT | Texto do segmento |
| speaker | TEXT | Identificação do palestrante |
| confidence | FLOAT | Score de confiança |
| created_at | TIMESTAMPTZ | Data de criação |
| updated_at | TIMESTAMPTZ | Data de atualização |

### 3. deposition_comparisons
Comparações entre depoimentos da fase policial e judicial.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único (PK) |
| transcription_id | UUID | Referência à transcrição (FK) |
| witness_name | TEXT | Nome da testemunha |
| police_text | TEXT | Texto do depoimento policial |
| court_text | TEXT | Texto do depoimento judicial |
| similarity | FLOAT | Score de similaridade (0-1) |
| chosen_version | TEXT | Versão escolhida: police, court, merged, both |
| merged_text | TEXT | Texto mesclado (quando aplicável) |
| embeddings_police | vector(1536) | Embeddings do texto policial |
| embeddings_court | vector(1536) | Embeddings do texto judicial |
| created_at | TIMESTAMPTZ | Data de criação |
| updated_at | TIMESTAMPTZ | Data de atualização |

### 4. legal_templates
Templates de votos e esquemas jurídicos.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único (PK) |
| user_id | UUID | Referência ao usuário (FK) |
| name | TEXT | Nome do template |
| crime_type | TEXT | Tipo de crime |
| template_structure | JSONB | Estrutura do template |
| is_public | BOOLEAN | Template público ou privado |
| usage_count | INTEGER | Contador de uso |
| created_at | TIMESTAMPTZ | Data de criação |
| updated_at | TIMESTAMPTZ | Data de atualização |

## 🔐 Segurança (RLS)

Todas as tabelas têm Row Level Security (RLS) habilitado com as seguintes políticas:

### transcriptions
- SELECT: Usuários só veem suas próprias transcrições
- INSERT: Usuários só podem criar com seu próprio user_id
- UPDATE: Usuários só podem atualizar suas transcrições
- DELETE: Usuários só podem deletar suas transcrições

### transcription_segments & deposition_comparisons
- SELECT: Herdam permissão da transcrição pai

### legal_templates
- SELECT: Usuários veem seus templates OU templates públicos
- INSERT/UPDATE/DELETE: Apenas templates próprios

## 🚀 Índices

Para otimização de performance:
- `idx_transcriptions_user_id`
- `idx_transcriptions_status`
- `idx_transcriptions_case_number`
- `idx_segments_transcription_id`
- `idx_comparisons_transcription_id`
- `idx_templates_user_id`
- `idx_templates_crime_type`

## 🔧 Extensões

- **pgvector**: Habilitado para armazenar e buscar embeddings de alta dimensão

## 📝 Template Exemplo

Um template de "Voto - Tráfico de Drogas" já foi criado como exemplo público, contendo:
- Seções padrão (Relatório, Fundamentação, Dosimetria, Dispositivo)
- Variáveis substituíveis (NOME_RÉU, NOME_TESTEMUNHA, etc.)
- Marcação para auto-merge de depoimentos

## 🔄 Migrações

Para adicionar novas colunas ou tabelas, use o Supabase Dashboard ou crie migrações SQL versionadas.