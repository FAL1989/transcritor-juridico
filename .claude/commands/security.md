Por favor, execute uma auditoria de segurança completa do projeto: $ARGUMENTS.

Siga estes passos:

1. **Análise de Dependências**
   - Execute `npm audit` para verificar vulnerabilidades conhecidas
   - Use `npm audit fix` para corrigir vulnerabilidades automáticas
   - Analise dependências desatualizadas com `npm outdated`
   - Verifique se há pacotes maliciosos ou suspeitos

2. **Verificação de Código**
   - Execute `npx eslint . --ext .ts,.tsx,.js,.jsx` com foco em regras de segurança
   - Verifique hardcoded secrets ou chaves de API
   - Analise componentes que lidam com entrada de usuário
   - Examine rotas de API para validação de entrada

3. **Auditoria de Configurações**
   - Verifique arquivos `.env` e `.env.example`
   - Analise configurações do Next.js em `next.config.js`
   - Examine headers de segurança (CSP, HSTS, etc.)
   - Verifique configurações de CORS em API routes

4. **Análise de Autenticação e Autorização**
   - Verifique implementação de autenticação (se aplicável)
   - Analise middleware de autorização
   - Examine validação de tokens e sessões
   - Verifique proteção de rotas sensíveis

5. **Segurança Frontend**
   - Analise componentes para XSS vulnerabilities
   - Verifique sanitização de dados de entrada
   - Examine uso de `dangerouslySetInnerHTML`
   - Analise download/upload de arquivos

6. **Segurança Backend (API Routes)**
   - Verifique validação de entrada com Zod ou similar
   - Analise rate limiting implementation
   - Examine tratamento de erros (não vazar informações)
   - Verifique logs de segurança

7. **Análise de Terceiros**
   - Audite integrações com serviços externos
   - Verifique configurações de CDNs
   - Analise widgets de terceiros (analytics, chat, etc.)
   - Examine bibliotecas de UI (shadcn/ui, etc.)

8. **Verificações Específicas para IA**
   - Analise prompt injection vulnerabilities
   - Verifique sanitização de inputs para LLMs
   - Examine rate limiting em endpoints de IA
   - Analise logs de interações com IA

9. **Relatório de Segurança**
   - Gere relatório com vulnerabilidades encontradas
   - Priorize issues por severidade (Critical, High, Medium, Low)
   - Forneça recomendações de correção
   - Sugira implementações de segurança adicionais

**Exemplos de Uso:**
- `security` - Auditoria completa do projeto
- `security --deps` - Foca apenas em dependências
- `security --api` - Foca em rotas de API
- `security --frontend` - Foca em componentes frontend
- `security --ai` - Foca em funcionalidades de IA

**Ferramentas Utilizadas:**
- `npm audit` - Auditoria de dependências
- `eslint-plugin-security` - Regras de segurança ESLint
- `madge` - Análise de dependências circulares
- `bundlewatch` - Monitoramento de tamanho de bundle

**Checklist de Segurança F.A.L A.I Agency:**

### Infraestrutura
- [ ] Headers de segurança configurados
- [ ] HTTPS enforced em produção
- [ ] Environment variables protegidas
- [ ] Rate limiting implementado
- [ ] Logs de segurança configurados

### Frontend
- [ ] Input validation implementada
- [ ] XSS protection ativa
- [ ] CSP headers configurados
- [ ] Sanitização de dados de entrada
- [ ] Componentes UI seguros (shadcn/ui)

### Backend (API Routes)
- [ ] Validação de schema com Zod
- [ ] Autenticação/autorização implementada
- [ ] Error handling seguro
- [ ] SQL injection prevention
- [ ] File upload security

### IA e LLMs
- [ ] Prompt injection protection
- [ ] Input sanitization para LLMs
- [ ] Rate limiting em endpoints de IA
- [ ] Logs de interações com IA
- [ ] Validação de outputs de IA

### Dependências
- [ ] Dependências atualizadas
- [ ] Vulnerabilidades conhecidas resolvidas
- [ ] Pacotes não utilizados removidos
- [ ] License compliance verificada

### Dados e Privacidade
- [ ] LGPD compliance (dados brasileiros)
- [ ] Cookies policy implementada
- [ ] Data encryption em trânsito/repouso
- [ ] Backup security verificada

**Comandos de Verificação:**
