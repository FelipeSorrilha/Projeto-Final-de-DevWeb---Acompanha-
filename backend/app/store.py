from app.schemas.aluno import Aluno
from app.schemas.habilidade import Habilidade
from app.schemas.registro import Registro
from app.schemas.turma import Turma

turmas: list[Turma] = [
    Turma(id=1, nome="6º Ano A", serie="6º ano"),
    Turma(id=2, nome="7º Ano B", serie="7º ano"),
]

alunos: list[Aluno] = [
    Aluno(id=1, nome="Ana Beatriz Souza", turma_id=1),
    Aluno(id=2, nome="Bruno Lima", turma_id=1),
    Aluno(id=3, nome="Carla Mendes", turma_id=1),
    Aluno(id=4, nome="Davi Oliveira", turma_id=1),
    Aluno(id=5, nome="Eduarda Ferreira", turma_id=2),
    Aluno(id=6, nome="Felipe Rocha", turma_id=2),
    Aluno(id=7, nome="Gabriela Santos", turma_id=2),
    Aluno(id=8, nome="Heitor Almeida", turma_id=2),
]

habilidades: list[Habilidade] = [
    Habilidade(id=1, descricao="Frações equivalentes", componente="Matemática"),
    Habilidade(id=2, descricao="Operações com números decimais", componente="Matemática"),
    Habilidade(id=3, descricao="Interpretação de texto", componente="Língua Portuguesa"),
    Habilidade(id=4, descricao="Acentuação gráfica", componente="Língua Portuguesa"),
    Habilidade(id=5, descricao="Leitura de gráficos e tabelas", componente="Matemática"),
]

# (id, aluno, habilidade, observação, nível, data)
_registros = [
    (1, 1, 1, "Errou 4 de 5 questões de fração equivalente.", "precisa retomar", "2026-10-20"),
    (2, 1, 3, "Identificou a ideia central do texto sem ajuda.", "dominado", "2026-10-22"),
    (3, 2, 1, "Acertou 3 de 5, confunde ao simplificar frações.", "em desenvolvimento", "2026-10-20"),
    (4, 2, 2, "Erra o alinhamento da vírgula na adição.", "precisa retomar", "2026-10-27"),
    (5, 3, 1, "Acertou 5 de 5 questões de fração equivalente.", "dominado", "2026-10-20"),
    (6, 3, 4, "Esquece o acento em palavras proparoxítonas.", "em desenvolvimento", "2026-10-23"),
    (7, 4, 3, "Tem dificuldade em inferir informações que não estão explícitas.", "precisa retomar", "2026-10-22"),
    (8, 4, 2, "Resolveu corretamente 4 de 5 problemas com decimais.", "dominado", "2026-10-27"),
    (9, 5, 5, "Lê o gráfico de barras, mas erra ao comparar valores.", "em desenvolvimento", "2026-10-21"),
    (10, 5, 3, "Responde bem às questões de interpretação.", "dominado", "2026-10-24"),
    (11, 6, 5, "Não soube localizar dados em tabelas de dupla entrada.", "precisa retomar", "2026-10-21"),
    (12, 6, 4, "Acentua corretamente oxítonas e paroxítonas.", "dominado", "2026-10-24"),
    (13, 7, 2, "Erra a multiplicação de decimais por 10 e por 100.", "precisa retomar", "2026-10-28"),
    (14, 7, 3, "Compreende o texto, mas tem dificuldade em justificar a resposta.", "em desenvolvimento", "2026-10-24"),
    (15, 8, 1, "Domina a comparação e a simplificação de frações.", "dominado", "2026-10-28"),
    (16, 8, 5, "Interpreta gráficos de linha sem dificuldade.", "dominado", "2026-10-28"),
]

registros: list[Registro] = [
    Registro(id=i, aluno_id=a, habilidade_id=h, observacao=o, nivel=n, data=d)
    for (i, a, h, o, n, d) in _registros
]


def proximo_id(lista) -> int:
    return max((item.id for item in lista), default=0) + 1