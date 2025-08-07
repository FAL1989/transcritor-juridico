Por favor, refatore o código especificado: $ARGUMENTS.

Siga estes passos:

1. **Análise do Código Existente**
   - Use `gh issue view` se for relacionado a uma issue específica
   - Analise o código atual e identifique problemas de design
   - Verifique padrões inconsistentes ou código duplicado
   - Identifique oportunidades de melhoria na arquitetura

2. **Planejamento da Refatoração**
   - Defina objetivos claros da refatoração
   - Identifique componentes que serão afetados
   - Planeje abordagem incremental para mudanças seguras
   - Considere impacto em testes existentes

3. **Verificações Pré-Refatoração**
   - Execute `npx tsc --noEmit` para verificar tipos TypeScript
   - Execute `npx eslint . --ext .ts,.tsx,.js,.jsx` para verificar linting
   - Execute testes existentes para estabelecer baseline
   - Faça backup do estado atual (git commit)

4. **Implementação da Refatoração**
   - Aplique mudanças incrementalmente
   - Mantenha aderência aos padrões do projeto (TypeScript, ESLint, Prettier)
   - Siga convenções de nomenclatura definidas
   - Implemente melhorias de performance e legibilidade

5. **Validação Pós-Refatoração**
   - Execute `npx tsc --noEmit` para verificar tipos
   - Execute `npx eslint` nos arquivos modificados
   - Execute `npx prettier --write` para formatação
   - Execute testes para garantir funcionalidade mantida

6. **Verificações de Qualidade**
   - Analise se a refatoração atende aos padrões do design system
   - Verifique conformidade com arquitetura do projeto
   - Valide implementação de componentes shadcn/ui
   - Confirme que a experiência do usuário foi mantida ou melhorada

7. **Documentação e Commit**
   - Atualize documentação relevante se necessário
   - Crie commit com mensagem descritiva das mudanças
   - Prepare branch para Pull Request se aplicável

**Exemplos de Uso:**
- `refactor src/components/Header.tsx` - Refatora componente específico
- `refactor src/app/page.tsx` - Refatora página principal
- `refactor "src/components/ui/*.tsx"` - Refatora todos componentes UI
- `refactor src/app/api/ --issue 123` - Refatora com base em issue específica

**Tipos Comuns de Refatoração:**
- **Extração de Componentes**: Quebrar componentes grandes em menores
- **Otimização de Performance**: Melhorar renderização e carregamento
- **Melhoria de Tipagem**: Fortalecer types TypeScript
- **Simplificação de Lógica**: Reduzir complexidade ciclomática
- **Padrões de Design**: Aplicar patterns consistentes

**Foco Especial para F.A.L A.I Agency:**
- Manter conceito "Hiperlean" durante refatoração
- Otimizar componentes de IA e integração com LLMs
- Preservar experiência do usuário para consultoria em IA
- Garantir performance adequada para agência de tecnologia
- Manter design system consistente com identidade da marca

**Comando Git que será utilizado:**
- `git status` - Verificar estado antes/depois
- `git add .` - Adicionar arquivos refatorados
- `git commit -m "refactor: [descrição]"` - Commit das mudanças

**Nota de Segurança:**
Esta refatoração pode afetar funcionalidades existentes. Sempre execute testes e verificações antes de fazer commit das mudanças.
