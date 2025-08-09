# Setup Secrets - Configuração de Produção

Este documento contém as instruções para configurar os secrets necessários para o pipeline CI/CD funcionar corretamente.

## GitHub Secrets Necessários

### Vercel Integration
```bash
# 1. Instalar Vercel CLI se não tiver
npm install -g vercel@latest

# 2. Login no Vercel
vercel login

# 3. Obter Org ID
vercel teams ls

# 4. Obter Project ID (execute na pasta do projeto)
cd frontend
vercel link
cat .vercel/project.json

# 5. Obter Token de API
# Vá para https://vercel.com/account/tokens
# Crie um novo token com escopo "Full Account"
```

### Configurar no GitHub Repository

Vá para: `https://github.com/FAL1989/transcritor-juridico/settings/secrets/actions`

Adicione os seguintes secrets:

| Nome | Descrição | Como obter |
|------|-----------|------------|
| `VERCEL_TOKEN` | Token de API do Vercel | vercel.com/account/tokens |
| `VERCEL_ORG_ID` | ID da organização | `vercel teams ls` |
| `VERCEL_PROJECT_ID` | ID do projeto | `.vercel/project.json` após `vercel link` |

### Opcional - Notificações (Recomendado)

| Nome | Descrição | Como obter |
|------|-----------|------------|
| `SLACK_WEBHOOK_URL` | Webhook do Slack para alertas | Slack App Settings |
| `DISCORD_WEBHOOK_URL` | Webhook do Discord para alertas | Discord Channel Settings |

## Comandos de Configuração

```bash
# 1. Configurar secrets via GitHub CLI
gh secret set VERCEL_TOKEN --body="your-vercel-token"
gh secret set VERCEL_ORG_ID --body="your-org-id"
gh secret set VERCEL_PROJECT_ID --body="your-project-id"

# 2. Verificar se os secrets foram configurados
gh secret list

# 3. Testar o workflow de deployment
gh workflow run deploy-prod.yml

# 4. Verificar execução
gh run list --workflow=deploy-prod.yml
```

## Verificação da Configuração

### 1. Branch Protection
```bash
# Verificar se as regras foram aplicadas
gh api repos/FAL1989/transcritor-juridico/branches/main/protection
```

### 2. Webhooks de Saúde
```bash
# Testar health check local
curl -f http://localhost:3000/api/health

# Testar health check em produção (após deploy)
curl -f https://your-vercel-url.vercel.app/api/health
```

### 3. Monitoring
```bash
# Executar manualmente o monitoring
gh workflow run monitoring.yml

# Ver logs de execução
gh run list --workflow=monitoring.yml
```

## Troubleshooting

### Erro: "Workflow not found"
- Certifique-se de que fez push dos arquivos de workflow
- Aguarde alguns minutos para sincronização do GitHub

### Erro: "Secret not found" 
```bash
# Listar secrets existentes
gh secret list

# Reconfigurar secret específico
gh secret set VERCEL_TOKEN --body="new-token"
```

### Erro de deployment no Vercel
```bash
# Verificar logs do Vercel
vercel logs your-deployment-url

# Verificar variáveis de ambiente
vercel env ls
```

## Security Best Practices

1. **Rotação de Tokens**: Configure rotação automática dos tokens do Vercel
2. **Princípio do Menor Privilégio**: Use tokens com escopo mínimo necessário  
3. **Audit Logs**: Monitore o uso dos secrets via GitHub Audit Log
4. **Environment Variables**: Nunca commite secrets no código

## Next Steps

1. Configure os secrets conforme instruções acima
2. Execute o workflow de branch protection
3. Teste um deployment completo
4. Configure alertas de monitoramento
5. Documente procedimentos específicos da equipe