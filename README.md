# MeuBairro UI

Front-end do projeto acadêmico MeuBairro, desenvolvido na disciplina Projeto Integrador II do curso de Tecnologia em Sistemas para Internet da UESPI/UAPI.

## Integrantes

- Hélio Mendes da Silva
- Francisca Ranielly Ferreira de Araújo
- Josemilton Felix Baptista
- Kayo Mykael da Silva Santiago

## Objetivo

Permitir que moradores registrem problemas do bairro, acompanhem o atendimento das denúncias e consultem informações da comunidade.

## Repositórios

- UI: https://github.com/helyomendesdev/meubairro-ui
- API: https://github.com/helyomendesdev/meubairro-api
- Trello: https://trello.com/b/P9AG1QOV/meubairro

## Organização das entregas

### Entrega 1 — Concepção e planejamento

Entrega concluída com os artefatos iniciais do projeto:

- revisão do Projeto Integrador I;
- documentação inicial com diagramas UML;
- prototipação das telas desktop e mobile;
- criação e configuração do quadro do projeto no Trello;
- criação, priorização e organização do backlog;
- organização da primeira sprint;
- confirmação dos integrantes do grupo.

### Entrega 2 — Projeto front-end

Entrega concluída. A interface foi construída e versionada com:

- React 19;
- TypeScript;
- Vite;
- Tailwind CSS;
- React Router;
- Vitest e Testing Library;
- Oxlint.

Funcionalidades da interface:

1. tela de login responsiva;
2. cadastro de morador;
3. painel do morador com resumo, denúncias recentes e notícias;
4. formulário de nova denúncia;
5. lista de minhas denúncias;
6. mapa de denúncias com filtros, lista e marcações;
7. rotas auxiliares de notícias e navegação mobile.

Aplicação publicada anteriormente no GitHub Pages:

https://helyomendesdev.github.io/meubairro-ui/

### Entrega 3 — Projeto back-end e integração inicial UI/API

A Entrega 3 exige stack back-end definida, repositório separado, API versionada e tarefas organizadas no Trello. A API foi implementada no repositório separado `meubairro-api` com:

- Python 3.12+;
- FastAPI e Uvicorn;
- SQLAlchemy 2;
- SQLite para desenvolvimento e PostgreSQL configurável para produção;
- JWT para autenticação;
- Argon2 para hash de senhas;
- pytest, HTTPX, Ruff e uv.

A integração inicial da UI com a API cobre:

- login e persistência da sessão JWT;
- hidratação da sessão por `GET /api/v1/auth/me`;
- cadastro de morador;
- proteção das rotas autenticadas;
- criação de denúncia por `POST /api/v1/reports`;
- listagem das denúncias do morador;
- filtros de status, categoria e texto no mapa;
- estados de carregamento, erro e lista vazia.

Endpoints utilizados pela UI:

- `POST /api/v1/auth/login`;
- `POST /api/v1/auth/register`;
- `GET /api/v1/auth/me`;
- `POST /api/v1/reports`;
- `GET /api/v1/reports/mine`;
- `GET /api/v1/reports`.

A integração usa `VITE_API_BASE_URL`. Em desenvolvimento, o padrão é `http://127.0.0.1:8000/api/v1`.

## Execução local

Pré-requisitos: Node.js, npm, Python 3.12+ e uv.

1. Inicie a API em outro terminal:

```bash
cd /Users/helyomendes/Projects/meubairro-api
uv sync --dev
uv run uvicorn app.main:app --reload
```

2. Configure a UI:

```bash
cd /Users/helyomendes/Projects/meubairro-ui
cp .env.example .env
npm install
npm run dev
```

Se a API estiver em outra URL, ajuste `VITE_API_BASE_URL` no `.env`.

## Validação

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
```

Validação local desta integração:

- 11 testes automatizados aprovados;
- testes do cliente tipado para login e Authorization Bearer;
- teste de hidratação da sessão autenticada;
- teste de criação de denúncia e retorno à lista;
- teste de filtro do mapa convertido em query string;
- lint executado com avisos não bloqueantes do plugin React;
- type-check aprovado;
- build de produção aprovado.

A API possui validação própria no repositório `meubairro-api`:

```bash
uv run ruff check .
uv run python -m compileall -q app tests
uv run pytest -q
```

## CI/CD

O GitHub Actions executa instalação, lint, type-check, build e testes. O deploy existente publica a UI no GitHub Pages quando há push em `main`.

- Workflow: https://github.com/helyomendesdev/meubairro-ui/actions
- API Actions: https://github.com/helyomendesdev/meubairro-api/actions

A UI atualmente espera a API em uma URL configurada por ambiente. O GitHub Pages não fornece um back-end; para uso público é necessário publicar a API e configurar `VITE_API_BASE_URL` no build/deploy.

## Entrega acadêmica

Os cartões do Trello devem manter separadas as obrigações formais da Entrega 3 e as tarefas de implementação da API/UI. A integração completa e o deploy público da API permanecem dependentes da infraestrutura e das evidências exigidas pela disciplina.

## Prazos registrados

- Entrega 1: concluída.
- Entrega 2: concluída e submetida no SIGAA.
- Entrega 3: execução de 14/09/2026 a 10/10/2026; submissão até 11/10/2026 às 23h59.
