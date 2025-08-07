# PR Check Command - Quick Analysis

## Purpose
Fast PR quality check for immediate feedback during development.

## Usage
```bash
claude pr-check
```

## Quick Checks (< 2 minutes)

### 1. Code Quality
```bash
npm run lint -- --quiet
npx tsc --noEmit
```

### 2. Build Verification
```bash
npm run build
```

### 3. Critical Tests
```bash
npm test -- --passWithNoTests --testPathIgnorePatterns=/e2e/
```

### 4. Security Basics
```bash
npm audit --audit-level=high
```

## Output Format
```
🚀 PR Quick Check Results

✅ Lint: PASSED
✅ TypeScript: PASSED  
✅ Build: PASSED
✅ Tests: PASSED (15/15)
⚠️  Security: 2 moderate vulnerabilities

⏱️ Analysis completed in 47s
```

## Integration
- Runs automatically on PR creation
- Updates PR status in real-time  
- Blocks merge if critical issues found
- Sends Slack notification with results