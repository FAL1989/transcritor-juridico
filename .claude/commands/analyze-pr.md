# Analyze PR Command

## Purpose
Comprehensive automated analysis of GitHub Pull Requests with actionable insights and recommendations.

## Usage
```bash
claude analyze-pr [PR_NUMBER] [--deep] [--security] [--performance]
```

## Analysis Steps

### 1. **Code Quality Analysis**
```bash
# Run linting and type checking
npm run lint
npx tsc --noEmit
npm run build
```

### 2. **Test Coverage Analysis**
```bash
# Run tests with coverage
npm test -- --coverage
```

### 3. **Security Scan**
```bash
# Dependency and code security analysis
npm audit
# Scan for hardcoded secrets
grep -r "api_key\|secret\|password\|token" src/ --exclude-dir=node_modules
```

### 4. **Performance Analysis**
```bash
# Bundle analysis
npm run build -- --analyze
# Check for performance regressions
lighthouse --chrome-flags="--headless" http://localhost:3000
```

### 5. **Business Logic Review**
- Verify messaging consistency
- Check CTA optimization
- Validate conversion funnels
- Review email integration

## Automated Report Generation

Creates comprehensive analysis report with:
- ✅ **Passed Checks**: All successful validations
- ⚠️ **Warnings**: Issues requiring attention
- ❌ **Critical Issues**: Blocking problems
- 📊 **Metrics**: Performance and quality scores
- 💡 **Recommendations**: Action items for improvement

## Integration Points

### GitHub Integration
- Fetches PR details via GitHub API
- Posts analysis results as PR comments
- Updates PR status checks
- Creates follow-up issues for critical items

### Slack/Teams Integration
- Sends analysis summary to team channels
- Alerts for critical security issues
- Performance regression notifications

## Example Output
```markdown
## 🔍 PR Analysis Report - PR #1

### ✅ Quality Score: 85/100

**Passed Checks:**
- TypeScript compilation ✅
- ESLint rules ✅  
- Test coverage (92%) ✅
- Security scan ✅

**⚠️ Warnings:**
- Bundle size increased by 12KB
- 3 new dependencies added
- Hero image missing priority prop

**💡 Recommendations:**
1. Optimize new dependencies for production
2. Add priority prop to hero images
3. Consider code splitting for heavy components

**🎯 Business Impact:**
- Premium messaging implementation: ✅
- Email integration working: ✅
- Mobile responsiveness: ✅
- Conversion path optimized: ✅
```

## Command Shortcuts

### Quick Analysis
```bash
# Basic quality checks
claude pr-check
```

### Deep Analysis  
```bash
# Comprehensive review with all checks
claude pr-deep
```

### Security Focus
```bash
# Security-focused analysis
claude pr-security
```

### Performance Focus
```bash
# Performance-focused analysis  
claude pr-performance
```