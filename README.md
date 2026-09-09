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
- Primeiro commit: [Configuração inicial do projeto](https://github.com/helyomendesdev/meubairro-ui/commit/d35bf3fa29d9349790ca4a1ceefbd22473d2f13c)

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

## Próxima etapa

### Entrega 3 — Back-end e integração UI/API

A Entrega 3 ainda está planejada. O Trello contém 16 tarefas futuras, divididas em:

- 8 tarefas de API.
- 8 tarefas de UI e integração.

Essas tarefas permanecem em `To Do` até serem implementadas e validadas.

## Prazos acadêmicos

- Entrega 1: concluída.
- Entrega 2: concluída.
- Entrega 3: próxima etapa do projeto.
- Submissão da Entrega 2 no SIGAA: até 13/09/2026 às 23h59.
