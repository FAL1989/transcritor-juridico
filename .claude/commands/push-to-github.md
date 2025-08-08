Por favor, faça push das alterações atuais para o GitHub: $ARGUMENTS.

Siga estes passos:

1. **Verificação do Estado Atual**
   - Execute `git status` para verificar arquivos modificados
   - Execute `git log --oneline -5` para ver commits recentes
   - Verifique se há arquivos não commitados que precisam ser incluídos

2. **Preparação dos Commits**
   - Se houver arquivos não commitados, pergunte se devem ser incluídos
   - Execute `git add` nos arquivos apropriados (se confirmado)
   - Crie commit com mensagem descritiva (se necessário)

3. **Verificações de Qualidade**
   - Execute `npx tsc --noEmit` para verificar tipos TypeScript
   - Execute `npx eslint . --ext .ts,.tsx,.js,.jsx` para verificar linting
   - Execute `npx prettier --check .` para verificar formatação
   - Certifique-se de que o código passa em todas as verificações

4. **Push para GitHub**
   - Verifique a branch atual com `git branch --show-current`
   - Execute `git push origin [branch-name]` para fazer push das alterações
   - Se for a primeira vez fazendo push da branch, use `git push -u origin [branch-name]`

5. **Verificação Pós-Push**
   - Use `gh repo view --web` para abrir o repositório no browser (opcional)
   - Confirme que as alterações foram enviadas corretamente

**Exemplos de Uso:**
- `push-to-github` - Push básico das alterações atuais
- `push-to-github "feature/new-component"` - Push especificando a branch
- `push-to-github "Fix header navigation issues"` - Push com mensagem de commit específica

**Comandos Git que serão utilizados:**
- `git status` - Verificar estado do repositório
- `git add .` - Adicionar arquivos (se confirmado)
- `git commit -m "mensagem"` - Criar commit (se necessário)
- `git push origin [branch]` - Fazer push das alterações

**Nota de Segurança:**
Este comando executará operações Git que modificam o repositório. Sempre confirme as alterações antes de prosseguir com o push.

**Foco Especial para F.A.L A.I Agency:**
- Verificar que componentes de IA estão funcionando corretamente
- Garantir que não há credenciais ou chaves de API commitadas
- Validar que o design system está sendo seguido corretamente
- Confirmar que a experiência "Hiperlean" está mantida
