# TODO - Transcritor Jurídico

## 🚀 Alta Prioridade

### Autenticação e Segurança
- [ ] Implementar sistema de autenticação JWT
- [ ] Criar endpoints de registro e login de usuários
- [ ] Adicionar refresh tokens
- [ ] Implementar recuperação de senha
- [ ] Implementar pseudonimização de dados para LGPD

### Upload e Processamento
- [ ] Implementar upload de arquivos de áudio/vídeo
- [ ] Validar formatos de arquivo (mp3, wav, m4a, ogg, flac, mp4, avi, mov)
- [ ] Adicionar barra de progresso de upload
- [ ] Implementar limite de tamanho de arquivo (100MB)

### Transcrição
- [ ] Integrar Whisper AI para transcrição automática
- [ ] Implementar seleção de modelo Whisper (tiny, base, small, medium, large)
- [ ] Adicionar detecção automática de idioma
- [ ] Implementar segmentação por timestamps

### Comparação de Depoimentos (NOVO - Requisito Fabiana)
- [ ] Implementar comparação automática de depoimentos (policial vs judicial)
- [ ] Criar sistema de detecção de similaridade com embeddings
- [ ] Implementar geração de texto padrão para depoimentos idênticos
- [ ] Destacar divergências quando existirem
- [ ] Permitir override manual da escolha do algoritmo

### Templates e Esquemas Jurídicos (NOVO - Requisito Fabiana)
- [ ] Criar templates para votos/esquemas de crimes comuns (tráfico, etc)
- [ ] Estrutura padrão: Relatório → Denúncia → Provas → Julgamento → Dosimetria
- [ ] Sistema de múltiplos comandos/templates personalizáveis
- [ ] Biblioteca de frases padrão jurídicas

### Integração LLM (NOVO)
- [ ] Integrar Azure OpenAI com GPT-4o mini
- [ ] Implementar fusão inteligente de textos repetitivos
- [ ] Sistema de ranking de qualidade de depoimentos
- [ ] Configurar limites de budget e alertas

### Interface de Edição
- [ ] Criar editor de transcrições com sincronização de áudio
- [ ] Adicionar player de áudio/vídeo integrado
- [ ] Implementar atalhos de teclado para edição
- [ ] Adicionar corretor ortográfico especializado em termos jurídicos
- [ ] Implementar editor com atalhos para aceitar/rejeitar sugestões (Enter/F2/Ctrl+Shift+D)

### Testes
- [ ] Criar testes unitários para o backend (pytest)
- [ ] Criar testes de integração para APIs
- [ ] Implementar testes E2E no frontend
- [ ] Atingir cobertura de código > 80%

## 📊 Média Prioridade

### Processamento Assíncrono
- [ ] Criar sistema de filas com Celery para processamento assíncrono
- [ ] Implementar workers para transcrição em background
- [ ] Adicionar notificações de progresso via WebSocket
- [ ] Implementar retry automático em caso de falha
- [ ] Criar sistema de cache para economizar chamadas LLM

### Funcionalidades Avançadas
- [ ] Adicionar identificação de palestrantes (diarização)
- [ ] Implementar detecção de termos jurídicos importantes
- [ ] Criar glossário automático de termos técnicos
- [ ] Adicionar marcação de trechos importantes

### Exportação
- [ ] Criar sistema de exportação (PDF, DOCX, TXT)
- [ ] Implementar templates customizáveis para documentos
- [ ] Adicionar cabeçalho com informações do processo
- [ ] Implementar exportação com formatação jurídica padrão

### Busca e Organização
- [ ] Implementar busca full-text nas transcrições
- [ ] Adicionar filtros por data, processo, participantes
- [ ] Criar sistema de tags e categorias
- [ ] Implementar ordenação e paginação

### Colaboração
- [ ] Implementar sistema de permissões e compartilhamento
- [ ] Adicionar comentários e anotações
- [ ] Criar histórico de versões
- [ ] Implementar colaboração em tempo real

### CI/CD
- [ ] Configurar CI/CD completo
- [ ] Adicionar análise de código (SonarQube)
- [ ] Implementar deploy automático para staging
- [ ] Configurar monitoramento de erros (Sentry)

## 🎯 Baixa Prioridade

### Dashboard e Analytics
- [ ] Adicionar dashboard com estatísticas
- [ ] Implementar gráficos de uso e produtividade
- [ ] Criar relatórios de atividades
- [ ] Adicionar métricas de qualidade de transcrição

### Internacionalização
- [ ] Adicionar suporte a múltiplos idiomas
- [ ] Implementar tradução automática de transcrições
- [ ] Criar interface multilíngue
- [ ] Adicionar suporte a diferentes formatos de data/hora

### Deploy e Produção
- [ ] Preparar deploy para produção
- [ ] Configurar HTTPS e certificados SSL
- [ ] Implementar backup automático
- [ ] Criar documentação de deploy
- [ ] Configurar monitoramento e alertas

## 📝 Melhorias Futuras

### Performance
- [ ] Implementar cache Redis para transcrições
- [ ] Otimizar queries do banco de dados
- [ ] Adicionar CDN para arquivos estáticos
- [ ] Implementar compressão de áudio

### Integrações
- [ ] Integrar com sistemas de gestão processual
- [ ] Adicionar integração com Google Drive/Dropbox
- [ ] Implementar API pública
- [ ] Criar webhooks para eventos

### Mobile
- [ ] Criar aplicativo mobile (React Native)
- [ ] Implementar gravação de áudio no app
- [ ] Adicionar sincronização offline
- [ ] Implementar notificações push

## 🐛 Bugs Conhecidos
- [ ] Nenhum bug conhecido até o momento

## 📚 Documentação
- [ ] Criar guia de usuário completo
- [ ] Documentar API com exemplos
- [ ] Criar vídeos tutoriais
- [ ] Adicionar FAQ

---

**Última atualização:** 29/07/2025