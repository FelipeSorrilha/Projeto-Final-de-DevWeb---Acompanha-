# Acompanha+

> Um jeito simples de o professor visualizar o que cada aluno está aprendendo e precisa retomar.

Trabalho final da disciplina Desenvolvimento de Aplicações Web (UTFPR), voltado para o desenvolvimento de aplicações web com IA para apoio a professores da educação básica.

**Dupla:** Felipe Ferrer Sorrilha e Millena Sartori de Oliveira

---

## Sobre o sistema

Em turmas com diferentes níveis de conhecimento, é difícil para o professor saber quais habilidades cada aluno já desenvolveu, quais dificuldades persistem e o que precisa ser retomado. O Acompanha+ é voltado a professores da educação básica: eles cadastram suas turmas e alunos e registram, por habilidade, o nível de cada estudante (dominado, em desenvolvimento ou precisa retomar), com observações em texto livre. A IA lê esse histórico para resumir as dificuldades que persistem em cada aluno, sugerir quais conteúdos retomar e propor uma atividade de intervenção curta para o grupo que precisa. Assim, o professor passa menos tempo organizando informações e mais tempo planejando a retomada.

---

## Links

- Site (versão estática): https://acompanha-plus-nine.vercel.app
- Repositório: https://github.com/FelipeSorrilha/Projeto-Final-de-DevWeb---Acompanha-
- Site (API hospedada): https://projeto-final-de-devweb-acompanha-backend.onrender.com/docs

## Status

- [x] Sprint 1: frontend com dados mockados
- [x] Sprint 2: API FastAPI e funcionalidade de IA
- [ ] Sprint 3: integração frontend-API e login com JWT
- [ ] Sprint 4: banco de dados e manual do usuário

## O problema

Em turmas com diferentes níveis de conhecimento, é difícil identificar quais habilidades cada estudante já desenvolveu, quais dificuldades persistem e quais conteúdos precisam ser retomados. Faltam instrumentos simples que ajudem o professor a organizar essas informações e planejar intervenções pedagógicas.

## Quem vai usar

- **Professores da educação básica**, que registram o desenvolvimento dos alunos e planejam retomadas.

## Onde entra a IA

O professor registra observações e resultados por habilidade (ex.: "errou 4 de 5 questões de fração equivalente") e a IA ajuda a:

1. resumir as dificuldades que persistem em cada aluno;
2. sugerir quais conteúdos retomar e com quem;
3. propor uma atividade de intervenção curta para o grupo que precisa.

---

## Modelo de dados

- **Turma**: nome, série
- **Aluno**: nome, turma
- **Habilidade**: descrição, componente
- **Registro**: aluno, habilidade, nível, observação, data

Cada registro é uma "foto" de um momento. Quando o aluno melhora, não se edita o registro antigo: cria-se um novo, e o nível atual de cada habilidade é o registro mais recente. Assim o histórico mostra a evolução do aluno.

## Stack

- **Frontend: Next.js + Tailwind CSS.** O Next.js organiza o projeto em páginas e componentes, o que ajuda a reaproveitar partes da interface. O Tailwind permite estilizar direto no componente, sem alternar entre arquivos de CSS.
- **Backend: Python + FastAPI** *(Sprint 2)*. É leve, combina com o escopo pequeno do projeto e gera a documentação da API em `/docs` automaticamente. Python também facilita a integração com a IA.
- **Banco de dados: SQLModel** *(Sprint 4)*. Permite descrever as tabelas com classes Python e conversa direto com o FastAPI.
- **Autenticação: JWT** *(Sprint 3)*. Cada professor faz login e só acessa as informações das suas próprias turmas, já que os dados dos alunos são sensíveis.
- **IA: a definir na Sprint 2.** Será usada para resumir as dificuldades de cada aluno e sugerir retomadas.

## Estrutura do projeto

```
.
├── frontend/
│   └── src/
│       ├── app/            páginas (login, turmas, turma, aluno, registrar)
│       ├── components/ui/  componentes reutilizáveis
│       ├── context/        estado global (turmas, alunos, registros)
│       ├── data/           dados mockados
│       ├── types/          tipos das entidades
│       └── utils/          funções auxiliares
└── backend/                (Sprint 2)
```

## Como executar

### Frontend

Requisitos: Node.js 20 ou superior.

```bash
cd frontend
npm install
npm run dev
```

Acesse http://localhost:3000.

Para gerar a versão estática:

```bash
npm run build
```

O resultado fica em `frontend/out/`.

### Backend

Está na pasta Backend.
