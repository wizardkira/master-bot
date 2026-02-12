# Master Bot (Fase 0 + Fase 1)

Implementacao inicial do bot Solana com frontend Vue 3 e backend NestJS/TypeScript.

## Entregue neste checkpoint

- Estrutura de monorepo (`frontend` + `backend`)
- Setup de desenvolvimento com Docker Compose (PostgreSQL + Redis + apps)
- Frontend Vue com dashboard base, controle dos 3 modos e WebSocket realtime
- Backend NestJS com:
  - API base (`/api/bot`, `/api/positions`, `/api/analytics`)
  - WebSocket Gateway (eventos de status/log/incidentes)
  - Prisma schema completo (tokens, analises, posicoes, ITIL)
  - ITIL Error Handling:
    - IncidentService
    - ProblemService
    - KnowledgeService
    - ChangeService
  - Observabilidade:
    - Winston logger estruturado (JSON)
    - Prometheus metrics endpoint (`GET /api/metrics`)
    - OpenTelemetry bootstrap (OTLP opcional)
  - Resiliencia:
    - RetryManager (exponential backoff)
    - CircuitBreaker
    - SolanaRpcService com failover primario/secundario/terciario
  - Seguranca basica:
    - Helmet
    - ValidationPipe global
    - RateLimit guard global
- Testes unitarios iniciais para modulos criticos de error handling
- Seed de Knowledge Base com 5 artigos de erros conhecidos

## Estrutura

- `frontend/` Vue 3 + Vite + Pinia + Socket.IO Client + ApexCharts + Tailwind
- `backend/` NestJS 10 + Prisma + Redis + Socket.IO + Winston + OpenTelemetry
- `docker-compose.yml`
- `.env.example`
- `scripts/`

## Requisitos

- Node.js 20+
- Docker + Docker Compose

## Setup rapido

1. Copiar env:

```bash
cp .env.example .env
```

2. Subir infra local:

```bash
docker compose up -d postgres redis
```

3. Instalar dependencias:

```bash
npm install
```

4. Preparar banco:

```bash
npm run prisma:generate --workspace backend
npm run prisma:migrate --workspace backend
npm run prisma:seed --workspace backend
```

5. Rodar backend:

```bash
npm run dev:backend
```

6. Rodar frontend:

```bash
npm run dev:frontend
```

## Scripts uteis

- `scripts/dev-backend.ps1`
- `scripts/dev-all.ps1`
- `scripts/dev-down.ps1`

## Testes

```bash
npm run test --workspace backend
```

## Observacoes de seguranca

- Nunca commitar `WALLET_PRIVATE_KEY`
- Sempre usar devnet/simulacao antes de mainnet
- Manter limites de risco (`MAX_POSITIONS`, `MAX_POSITION_SIZE_SOL`, `SLIPPAGE_BPS`)

## Proxima fase

- Fase 2: Integracoes externas completas (PumpPortal, RugCheck, InsightX, Jupiter) com cache e filas.
