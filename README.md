# MeuBairro UI

Front-end do projeto acadêmico MeuBairro, desenvolvido na disciplina Projeto Integrador II do curso de Tecnologia em Sistemas para Internet da UESPI/UAPI.

## Integrantes

- Hélio Mendes da Silva
- Francisca Ranielly Ferreira de Araújo
- Josemilton Felix Baptista
- Kayo Mykael da Silva Santiago

## Objetivo

Permitir que moradores registrem problemas do bairro, acompanhem o atendimento das denúncias e consultem informações da comunidade.

## Organização das entregas

### Entrega 1 — Concepção e planejamento

Entrega concluída com os artefatos iniciais do projeto:

- Revisão do Projeto Integrador I.
- Documentação inicial com diagramas UML.
- Prototipação das telas em versões desktop e mobile.
- Criação e configuração do quadro do projeto no Trello.
- Criação e priorização do backlog.
- Organização da primeira sprint.
- Confirmação dos integrantes do grupo.

Quadro de gestão:

- Trello: https://trello.com/b/P9AG1QOV/meubairro

### Entrega 2 — Projeto front-end

Entrega concluída. O objetivo foi definir a stack front-end, criar e versionar o projeto UI, integrar o código ao repositório remoto e implementar as tarefas da primeira sprint.

#### Tecnologias definidas

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Vitest
- Testing Library
- Oxlint

#### Funcionalidades implementadas na Sprint 1

1. Tela de login responsiva.
2. Painel do morador com resumo, denúncias recentes e notícias.
3. Formulário de nova denúncia com localização aproximada.
4. Mapa de denúncias com filtros, lista e marcações.

Também foram incluídas as rotas auxiliares de `Minhas denúncias` e `Notícias` para manter a navegação funcional.

#### Versionamento e colaboração

- Repositório: https://github.com/helyomendesdev/meubairro-ui
- Branch principal: `main`
- Quadro Trello: https://trello.com/b/P9AG1QOV/meubairro
- Primeiro commit: [Configuração inicial do projeto](https://github.com/helyomendesdev/meubairro-ui/commit/28aa88bd9cad45dd2841831253fd8385bc8ad635)

#### Validação

A implementação foi validada com:

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
```

Resultados registrados:

- 5 testes automatizados aprovados.
- Lint aprovado.
- Type-check aprovado.
- Build de produção aprovado.
- Layout verificado em desktop e mobile.

#### CI/CD e deploy

O projeto possui pipeline automatizado no GitHub Actions. O CI executa instalação das dependências, lint, type-check, build e testes. Após a aprovação, o CD publica a aplicação no GitHub Pages.

- Workflow: https://github.com/helyomendesdev/meubairro-ui/actions
- Execução validada: https://github.com/helyomendesdev/meubairro-ui/actions/runs/34407269075
- Aplicação publicada: https://helyomendesdev.github.io/meubairro-ui/

## Execução local

Pré-requisitos: Node.js e npm instalados.

```bash
npm install
npm run dev
```

Para validar o projeto:

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
```

## Entrega 3 — Projeto back-end

A Entrega 3 mantém a API em repositório separado e não antecipa a integração UI/API. A API do MeuBairro está em:

- Repositório: https://github.com/helyomendesdev/meubairro-api
- Branch estável: `main`
- Commit funcional: `f85510f`

A integração UI/API foi revertida no commit `0ef7f83` e será retomada na Entrega 4, cujo período oficial é de 13/10/2026 a 30/11/2026. A UI deste repositório permanece no estado da Entrega 2, sem cliente HTTP, autenticação persistida ou rotas protegidas antecipadas.

No Trello, as oito tarefas de UI não integradas da Entrega 3 estão concluídas e documentadas individualmente. As tarefas de integração UI/API estão registradas separadamente como `[ENTREGA 4][UI/API]` em `To Do` e não foram antecipadas.

## Entrega 4 — Integração UI/API

A UI consome a API real (FastAPI) em todas as telas de morador. A URL base vem de `VITE_API_URL` (ver `.env.example`; padrão `http://localhost:8000`).

Funcionalidades integradas:

- Cliente HTTP com timeout, `ApiError` e mensagens amigáveis, lendo o payload de erro uniforme da API (`detail`/`error` e `fields` por campo em validação 422) (`src/api/client.ts`).
- Login via `POST /api/v1/auth/login`, sessão persistida em `localStorage` e validada em `GET /api/v1/auth/me`, com rotas protegidas; a sessão só é descartada em 401/403 confirmado pela API (`src/api/auth.ts`, `src/api/session.ts`, `src/auth/`).
- Formulário de nova denúncia conectado a `POST /api/v1/reports`, com estado de envio, erros por campo vindos do 422 da API e validação client-side de coordenadas (latitude -90..90, longitude -180..180) (`src/pages/NewReportPage.tsx`).
- Painel do morador com dados reais de `GET /api/v1/reports/mine` e total do bairro via `GET /api/v1/reports/stats` (`src/pages/DashboardPage.tsx`).
- Mapa de denúncias com dados de `GET /api/v1/reports`, contadores via `GET /api/v1/reports/stats`, filtro server-side (`?status=` / `?category=` quando um único valor está isolado), busca por texto e estado vazio distinto ("sem registros" × "sem resultados para os filtros") (`src/pages/MapPage.tsx`).
- "Minhas denúncias" conectada a `GET /api/v1/reports/mine`, com carregamento, erro com "Tentar novamente" e estado vazio (`src/pages/ResidentListsPage.tsx`).
- Estados de carregamento e de erro com botão "Tentar novamente" em todas as telas que consultam a API (`src/hooks/useMyReports.ts`, `src/hooks/usePublicReports.ts`, `src/components/AsyncState.tsx`).
- Testes de integração UI/API com `fetch` simulado cobrindo login, painel, criação de denúncia, filtros server-side do mapa, erros por campo e falhas de rede (`src/integration.test.tsx`).

Contrato ampliado consumido pela UI (implementado na API na Entrega 4): `GET /api/v1/reports/stats` (agregações por status e categoria), filtros `?status=`/`?category=` e paginação `?limit=`/`?offset=` com header `X-Total-Count` na listagem pública, `ETag`/`If-None-Match` (304), erro 422 uniforme com `fields`, e 401 com mensagem específica de sessão expirada.

Para executar a integração localmente: suba a API (`uv run uvicorn app.main:app --port 8000` no repositório `meubairro-api`) e a UI (`npm run dev`), depois acesse `http://localhost:5173/meubairro-ui/`.

## Prazos acadêmicos

- Entrega 1: concluída.
- Entrega 2: concluída.
- Entrega 3: próxima etapa do projeto.
- Submissão da Entrega 2 no SIGAA: até 13/09/2026 às 23h59.
