# Acompanha+

> Um jeito simples de o professor visualizar o que cada aluno está aprendendo e precisa retomar.

Trabalho final da disciplina Desenvolvimento de Aplicações Web (UTFPR), voltado para o desenvolvimento de aplicações web com IA para apoio a professores da educação básica.

**Dupla:** Felipe Ferrer Sorrilha e Millena Sartori de Oliveira

---

## O problema

Em turmas com diferentes níveis de conhecimento, é difícil identificar quais habilidades cada estudante já desenvolveu, quais dificuldades persistem e quais conteúdos precisam ser retomados. Faltam instrumentos simples que ajudem o professor a organizar essas informações e planejar intervenções pedagógicas.


## Quem vai usar

- **Professores da educação básica**, que registram o desenvolvimento dos alunos e planejam retomadas.

## Onde entra a IA

A ideia é o professor registrar observações e resultados por habilidade (ex.: "errou 4 de 5 questões de fração equivalente") e a IA ajudar a:

1. resumir as dificuldades que persistem em cada aluno;
2. sugerir quais conteúdos retomar e com quem;
3. propor uma atividade de intervenção curta para o grupo que precisa.

---

## Stack


- **Frontend: Next.js + Tailwind CSS.** O Next.js organiza o projeto em páginas e componentes, o que ajuda a reaproveitar partes da interface. O Tailwind deixa estilizar direto no componente, sem ficar alternando entre arquivos de CSS.
- **Backend: Python + FastAPI** *(Sprint 2)*. O FastAPI é leve, combina bem com o escopo pequeno do projeto e gera a documentação da API em `/docs` automaticamente. Python também facilita a integração com a IA.
- **Banco de dados: SQLModel** *(Sprint 4)*. Permite descrever as tabelas com classes Python e conversa direto com o FastAPI.
- **Autenticação: JWT** *(Sprint 3)*. Cada professor faz login e só acessa as informações das suas próprias turmas, já que os dados dos alunos são sensíveis.
- **IA: [ainda não definida]** *(Sprint 2)*. Vai ser usada para resumir as dificuldades de cada aluno e sugerir retomadas. 
