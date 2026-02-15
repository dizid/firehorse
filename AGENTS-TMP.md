# Available Agents — Dizid Virtual Company

Generated: 2026-02-14 | Total: 37 agents

---

## Custom Dizid Agents (18)

Defined in `~/.claude/agents/`. Full behavior rules and personas in each file.

### Dev Department (5)

| Agent | Subagent Type | Role | Score |
|-------|---------------|------|-------|
| @AI | `ai` | AI/ML specialist — prompt engineering, LLM APIs, agent orchestration, RAG, eval harnesses | 6.6 |
| @Data | `data` | Analytics + ML engineer — analytics setup, conversion tracking, ML training, dashboards, A/B testing | 5.8 |
| @FullStack | `fullstack` | Full-stack developer — feature dev, bug fixes, API work, DB ops, refactoring, performance | 6.7 |
| @Platform | `platform` | DevOps + security — deployment, CI/CD, monitoring, auth, SSL/DNS, rate limiting, cloud infra | 6.8 |
| @Product | `product` | Product designer + UX researcher — UI/UX, user flows, wireframes, component specs, accessibility | 6.6 |

### Marketing Department (5)

| Agent | Subagent Type | Role | Score |
|-------|---------------|------|-------|
| @Brand | `brand` | Brand enforcer + creative director — design tokens, brand audits, style guides, identity in code | 6.2 |
| @Content | `content` | Content publisher + strategist — blog posts, social media, newsletters, press releases, landing pages | 7.2 |
| @Growth | `growth` | Campaign executor + growth strategist — landing pages, lead capture, UTM tracking, A/B tests | 5.8 |
| @Sales | `sales` | Sales closer — proposals, pricing pages, outreach scripts, follow-ups, case studies | — |
| @SEO | `seo` | SEO implementer + analytics engineer — meta tags, sitemaps, JSON-LD, Lighthouse, Core Web Vitals | 6.4 |

### Ops Department (2)

| Agent | Subagent Type | Role | Score |
|-------|---------------|------|-------|
| @Email | `email` | Email + automation specialist — sequences, ESP management, deliverability, drip campaigns | 6.3 |
| @Ops | `ops` | Operations coordinator — project coordination, task management, scheduling, go-live | 6.3 |

### Tools Department (2)

| Agent | Subagent Type | Role | Score |
|-------|---------------|------|-------|
| @CodeImprover | `code-improver` | Code review + refactoring — readability, performance, naming, complexity reduction | 6.9 |
| @SecurityReviewer | `security-reviewer` | Security vulnerability detection — OWASP Top 10, secrets, dependency audits | 6.7 |

### Trading Department (4)

| Agent | Subagent Type | Role | Score |
|-------|---------------|------|-------|
| @BacktestQuant | `backtest-quant` | Backtest architect — strategy backtesting, walk-forward validation, overfitting detection | 6.4 |
| @EdgeMonitor | `edge-monitor` | Edge decay watchdog — model health monitoring, degradation detection | 6.3 |
| @RegimeDetector | `regime-detector` | Regime analyst — regime change detection, structural breaks, market classification | 6.1 |
| @RiskQuant | `risk-quant` | Risk quantifier — risk-adjusted returns, position sizing, drawdown, correlation analysis | 6.5 |

---

## Built-in System Agents (19)

Available as `subagent_type` in the Task tool.

### Core Agents

| Agent | Subagent Type | Purpose | Tools |
|-------|---------------|---------|-------|
| Bash Agent | `Bash` | Command execution, git ops, terminal tasks | Bash |
| General Purpose | `general-purpose` | Multi-step tasks, research, code search | All |
| Explorer | `Explore` | Fast codebase exploration, file search, keyword search | Read-only |
| Planner | `Plan` | Implementation planning, architecture design | Read-only |
| Claude Code Guide | `claude-code-guide` | Help with Claude Code features, SDK, API | Read-only + web |
| Status Line Setup | `statusline-setup` | Configure status line settings | Read, Edit |

### Feature Dev Suite

| Agent | Subagent Type | Purpose | Tools |
|-------|---------------|---------|-------|
| Code Architect | `feature-dev:code-architect` | Feature architecture, implementation blueprints | Read-only |
| Code Reviewer | `feature-dev:code-reviewer` | Bug/logic/security review, confidence filtering | Read-only |
| Code Explorer | `feature-dev:code-explorer` | Deep codebase analysis, execution path tracing | Read-only |

### Everything Claude Code Suite

| Agent | Subagent Type | Purpose | Tools |
|-------|---------------|---------|-------|
| Planner | `everything-claude-code:planner` | Complex feature + refactoring planning | Read, Grep, Glob |
| Refactor Cleaner | `everything-claude-code:refactor-cleaner` | Dead code cleanup, consolidation | All |
| Code Reviewer | `everything-claude-code:code-reviewer` | Code quality, security, maintainability | Read, Grep, Glob, Bash |
| E2E Runner | `everything-claude-code:e2e-runner` | E2E testing with Playwright | All |
| Architect | `everything-claude-code:architect` | System design, scalability, tech decisions | Read, Grep, Glob |
| Doc Updater | `everything-claude-code:doc-updater` | Documentation + codemap updates | All |
| Build Error Resolver | `everything-claude-code:build-error-resolver` | Fix build/type errors quickly | All |
| Database Reviewer | `everything-claude-code:database-reviewer` | PostgreSQL optimization, schema, security | All |
| TDD Guide | `everything-claude-code:tdd-guide` | Test-driven development enforcement | All |
| Security Reviewer | `everything-claude-code:security-reviewer` | Security vulnerability detection + remediation | All |

---

## Quick Reference — When to Use Which Agent

| Task | Primary Agent | Backup |
|------|---------------|--------|
| Build/code/fix bugs | `fullstack` | `platform` |
| Design/UX/wireframe | `product` | `fullstack` |
| Deploy/publish | `platform` | `ops` |
| Security/auth | `platform` | `fullstack` |
| Analytics/data/ML | `data` | `platform` |
| Write content/blog | `content` | `brand` |
| Launch campaigns | `growth` | `content` |
| Brand/positioning | `brand` | `content` |
| AI/prompt/LLM/agent | `ai` | `data` |
| SEO/keywords/ranking | `seo` | `content` |
| Email/newsletter | `email` | `content` |
| Code review/refactor | `code-improver` | `fullstack` |
| Security audit | `security-reviewer` | `platform` |
| Trading/backtest | `backtest-quant` | `risk-quant` |
| Codebase exploration | `Explore` | `general-purpose` |
| Implementation planning | `Plan` | `everything-claude-code:planner` |
| Build errors | `everything-claude-code:build-error-resolver` | `fullstack` |
| Database work | `everything-claude-code:database-reviewer` | `fullstack` |
