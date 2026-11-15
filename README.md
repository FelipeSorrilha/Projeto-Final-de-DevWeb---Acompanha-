# Acompanha+

> Um jeito simples de o professor visualizar o que cada aluno está aprendendo e precisa retomar.

Trabalho final da disciplina Desenvolvimento de Aplicações Web (UTFPR), voltado para o desenvolvimento de aplicações web com IA para apoio a professores da educação básica.

**Dupla:** Felipe Ferrer Sorrilha e Millena Sartori de Oliveira

---

## Sobre o sistema

Em turmas com diferentes níveis de conhecimento, é difícil para o professor saber quais habilidades cada aluno já desenvolveu, quais dificuldades persistem e o que precisa ser retomado. O Acompanha+ é voltado a professores da educação básica: eles entram com login, cadastram turmas e alunos e registram, por habilidade, o nível de cada estudante (dominado, em desenvolvimento ou precisa retomar), com observações em texto livre. A IA (Gemini) lê esse histórico para resumir as dificuldades que persistem em cada aluno, sugerir quais conteúdos retomar e propor uma atividade de intervenção curta. Também analisa a turma inteira: o sistema calcula, por habilidade, a porcentagem de alunos com dificuldade e a IA recomenda se vale uma revisão coletiva. Assim, o professor passa menos tempo organizando informações e mais tempo planejando a retomada.

---

## Links

- Site: https://acompanha-plus-nine.vercel.app
- API hospedada (documentação): https://projeto-final-de-devweb-acompanha-backend.onrender.com/docs
- Repositório: https://github.com/FelipeSorrilha/Projeto-Final-de-DevWeb---Acompanha-

**Conta de demonstração:** `professor@acompanha.com` / `demo1234`

> A API usa o plano gratuito do Render, que "dorme" após cerca de 15 minutos sem acesso. A primeira requisição depois disso (inclusive o login) pode levar cerca de um minuto.

## Status

- [x] Sprint 1: frontend com dados mockados
- [x] Sprint 2: API FastAPI e funcionalidade de IA
- [x] Sprint 3: integração frontend-API e login com JWT
- [ ] Sprint 4: banco de dados e manual do usuário

## Funcionalidades

- **Login com JWT.** O backend valida e devolve um token, que o frontend envia em todas as requisições protegidas. Sem token válido, a API responde 401 e o site volta para o login.
- **Turmas:** listagem e criação.
- **Alunos:** cadastro, edição e remoção por turma.
- **Habilidades:** o professor escolhe uma existente ou cria uma nova na hora de registrar. A nova passa a aparecer na lista.
- **Registro em massa:** uma habilidade para a turma inteira, com nível e observação por aluno.
- **Histórico por aluno:** situação atual por habilidade, atualização de nível, edição e exclusão de registros.
- **IA por aluno:** resumo das dificuldades e da evolução, conteúdos para retomar e atividade curta.
- **IA por turma:** análise por habilidade (porcentagem de alunos com dificuldade, com os nomes de quem precisa de apoio) e recomendação de revisão coletiva.
- **Interface:** estados de carregamento e de erro, com opção de tentar novamente.

---

## O problema

Em turmas com diferentes níveis de conhecimento, é difícil identificar quais habilidades cada estudante já desenvolveu, quais dificuldades persistem e quais conteúdos precisam ser retomados. Faltam instrumentos simples que ajudem o professor a organizar essas informações e planejar intervenções pedagógicas.

## Quem vai usar

- **Professores da educação básica**, que registram o desenvolvimento dos alunos e planejam retomadas.

## Onde entra a IA

O professor registra observações e resultados por habilidade (ex.: "errou 4 de 5 questões de fração equivalente") e a IA ajuda a:

1. resumir as dificuldades que persistem em cada aluno e a evolução dele;
2. sugerir quais conteúdos retomar;
3. propor uma atividade de intervenção curta, para o aluno ou para o grupo que precisa.

### Como a IA é usada

- **Quem faz as contas é o código.** A porcentagem de dificuldade por habilidade é calculada em Python, sobre o nível atual de cada aluno. A IA recebe os números prontos e escreve a recomendação, porque modelos de linguagem podem errar contas.
- **Os nomes dos alunos não vão para a IA.** Ela recebe só os registros e as observações.
- **Resposta estruturada.** A IA devolve JSON no formato esperado, que é validado antes de chegar ao cliente.
- **Tratamento de falhas.** Em caso de sobrecarga do serviço, o backend tenta até três vezes. Depois disso, devolve um código HTTP claro, e o site mostra a mensagem ao professor.
- **A chamada à IA fica no backend**, para a chave nunca chegar ao navegador. Por isso as rotas de IA também exigem login.
- **A IA é um apoio:** a decisão pedagógica é sempre do professor.

---

## Modelo de dados

- **Professor**: nome, e-mail, senha (guardada como hash)
- **Turma**: nome, série
- **Aluno**: nome, turma
- **Habilidade**: descrição, componente
- **Registro**: aluno, habilidade, nível, observação, data

Cada registro é uma "foto" de um momento. Quando o aluno melhora, não se edita o registro antigo: cria-se um novo, e o nível atual de cada habilidade é o registro mais recente. Assim o histórico mostra a evolução do aluno.

## Stack

- **Frontend: Next.js + Tailwind CSS.** O Next.js organiza o projeto em páginas e componentes, o que ajuda a reaproveitar partes da interface. O Tailwind permite estilizar direto no componente, sem alternar entre arquivos de CSS. Hospedado na Vercel.
- **Backend: Python + FastAPI.** É leve, combina com o escopo pequeno do projeto e gera a documentação da API em `/docs` automaticamente. Usa Pydantic para validar os dados. Hospedado no Render.
- **Autenticação: JWT.** Depois do login, o servidor entrega um token assinado, e o frontend o envia no cabeçalho `Authorization` de cada requisição. As senhas são guardadas com hash (argon2).
- **IA: Google Gemini**, pelo SDK `google-genai`. A chave e o nome do modelo ficam em variáveis de ambiente.
- **Banco de dados: SQLModel** *(Sprint 4)*. Permite descrever as tabelas com classes Python e conversa direto com o FastAPI. Por enquanto, os dados ficam em memória.

## Estrutura do projeto

```
.
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── page.tsx        login (público)
│       │   └── (app)/          área logada: turmas, turma, aluno, registrar
│       │       └── layout.tsx  verifica o token e monta os contextos
│       ├── components/         componentes reutilizáveis (ui/ e específicos)
│       ├── context/            estado global (turmas, alunos, registros, habilidades)
│       ├── hooks/              useLista (busca com carregamento e erro) e useProtegido
│       ├── services/           chamadas à API (api.ts concentra URL, token e erros)
│       ├── types/              tipos das entidades
│       └── utils/              funções auxiliares
└── backend/
    ├── app/
    │   ├── main.py         cria a API, configura o CORS e registra as rotas
    │   ├── config.py       lê as variáveis de ambiente
    │   ├── store.py        dados em memória (substituído pelo banco na Sprint 4)
    │   ├── auth/           hash de senha, criação e leitura do token, proteção das rotas
    │   ├── routers/        rotas por entidade e tradução de erros da IA em HTTP
    │   ├── schemas/        formato e validação dos dados (Pydantic)
    │   └── services/       lógica fora das rotas: chamada à IA e análise da turma
    ├── requirements.txt
    └── .env.example
```

---

## Como executar

Rode primeiro o backend e depois o frontend.

### Backend

Requisitos: Python 3 (desenvolvido com Python 3.14) e uma chave da API do Gemini, que pode ser criada em https://aistudio.google.com/apikey.

```bash
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1        # Windows (PowerShell)
# source .venv/bin/activate       # Linux/macOS
python -m pip install -r requirements.txt
```

Copie o arquivo `.env.example` para `.env` e preencha:

```
CORS_ORIGINS=http://localhost:3000
GEMINI_API_KEY=sua_chave_aqui
GEMINI_MODEL=gemini-3.8-flash
JWT_SECRET=um_valor_longo_e_aleatorio
```

Para gerar o `JWT_SECRET`:

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

Inicie o servidor a partir da pasta `backend/`:

```bash
python -m uvicorn app.main:app --reload
```

A documentação interativa fica em http://127.0.0.1:8000/docs. Para testar rotas protegidas por lá, faça `POST /auth/login`, copie o `accessToken` e use o botão **Authorize**. A rota `/saude` mostra se a API está no ar e se a IA está configurada.

### Frontend

Requisitos: Node.js 20 ou superior.

Crie o arquivo `frontend/.env.local` com o endereço da API:

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

```bash
cd frontend
npm install
npm run dev
```

Acesse http://localhost:3000 e entre com a conta de demonstração. Para gerar o build de produção, use `npm run build`.

### Variáveis de ambiente

| Variável | Onde | Para que serve |
|---|---|---|
| `GEMINI_API_KEY` | Backend | Chave da API do Gemini. Nunca deve ser commitada. |
| `GEMINI_MODEL` | Backend | Nome do modelo. Os nomes mudam com o tempo, por isso não ficam fixos no código. |
| `JWT_SECRET` | Backend | Segredo que assina os tokens. Sem ele a API não inicia. |
| `CORS_ORIGINS` | Backend | Endereços autorizados a chamar a API, separados por vírgula (o site da Vercel e `http://localhost:3000`). |
| `NEXT_PUBLIC_API_URL` | Frontend | Endereço da API, sem barra no final. É embutida no site no momento do build. |

Os arquivos `.env` e `.env.local` estão no `.gitignore`. Em produção, as variáveis são configuradas nos painéis do Render e da Vercel. Depois de mudar `NEXT_PUBLIC_API_URL` na Vercel, é preciso fazer um novo deploy.

---

## Endpoints da API

Todas as rotas exigem token, exceto `/`, `/saude` e `/auth/login`.

| Método e rota | O que faz |
|---|---|
| `POST /auth/login` | Recebe e-mail e senha e devolve o token |
| `GET /auth/eu` | Devolve o professor autenticado |
| `GET /saude` | Verifica se a API está no ar e se a IA está configurada |
| `GET /turmas`, `POST /turmas` | Lista e cria turmas |
| `GET /turmas/{id}` | Busca uma turma |
| `POST /turmas/{id}/sugestao` | **IA:** análise da turma por habilidade e recomendação |
| `GET /alunos`, `POST /alunos` | Lista (filtro opcional `?turmaId=`) e cria alunos |
| `GET /alunos/{id}`, `PUT /alunos/{id}`, `DELETE /alunos/{id}` | Busca, edita e remove um aluno |
| `POST /alunos/{id}/sugestao` | **IA:** resumo, conteúdos para retomar e atividade do aluno |
| `GET /habilidades`, `POST /habilidades` | Lista e cria habilidades |
| `GET /registros`, `POST /registros` | Lista (filtro opcional `?alunoId=`) e cria registros (aceita uma lista, para o registro em massa da turma) |
| `PUT /registros/{id}`, `DELETE /registros/{id}` | Edita e remove um registro |

### Códigos HTTP

| Código | Quando |
|---|---|
| 200 | Leitura ou operação concluída |
| 201 | Recurso criado |
| 204 | Recurso removido |
| 400 | Aluno ou turma sem registros (ou sem alunos) para analisar |
| 401 | Token ausente, inválido ou expirado; ou e-mail e senha incorretos no login |
| 404 | Turma, aluno, habilidade ou registro não encontrado |
| 409 | Habilidade que já existe |
| 422 | Dados inválidos (validação automática do Pydantic) |
| 429 | Limite de uso da IA atingido |
| 502 | Falha ao consultar a IA |
| 503 | IA não configurada ou com alta demanda |

---

