import { Turma, Aluno, Habilidade, Registro } from "../types";

export const turmasMock: Turma[] = [
    { id: 1, nome: "6º Ano A", serie: "6º ano" },
    { id: 2, nome: "7º Ano B", serie: "7º ano" },
];

export const alunosMock: Aluno[] = [
    { id: 1, nome: "Ana Beatriz Souza", turmaId: 1 },
    { id: 2, nome: "Bruno Lima", turmaId: 1 },
    { id: 3, nome: "Carla Mendes", turmaId: 1 },
    { id: 4, nome: "Davi Oliveira", turmaId: 1 },
    { id: 5, nome: "Patrick Jane", turmaId: 1 },
    { id: 6, nome: "Eduarda Ferreira", turmaId: 2 },
    { id: 7, nome: "Felipe Ferrer", turmaId: 1 },
    { id: 8, nome: "Gabriela Santos", turmaId: 2 },
    { id: 9, nome: "Heloisa Felipetto", turmaId: 2 },
    { id: 10, nome: "Millena Sartori", turmaId: 2 }, 
    { id: 11, nome: "Grace Van Pelt", turmaId: 2 }
];

export const habilidadesMock: Habilidade[] = [
    { id: 1, descricao: "Frações equivalentes", componente: "Matemática" },
    { id: 2, descricao: "Operações com números decimais", componente: "Matemática" },
    { id: 3, descricao: "Interpretação de texto", componente: "Língua Portuguesa" },
    { id: 4, descricao: "Acentuação gráfica", componente: "Língua Portuguesa" },
    { id: 5, descricao: "Leitura de gráficos e tabelas", componente: "Matemática" },
];

export const registrosMock: Registro[] = [
    { id: 1, alunoId: 1, habilidadeId: 1, observacao: "Errou 4 de 5 questões de fração equivalente.", nivel: "precisa retomar", data: "2026-10-20" },
    { id: 2, alunoId: 1, habilidadeId: 3, observacao: "Identificou a ideia central do texto sem ajuda.", nivel: "dominado", data: "2026-10-22" },
    { id: 3, alunoId: 2, habilidadeId: 1, observacao: "Acertou 3 de 5, confunde ao simplificar frações.", nivel: "em desenvolvimento", data: "2026-10-20" },
    { id: 4, alunoId: 2, habilidadeId: 2, observacao: "Erra o alinhamento da vírgula na adição.", nivel: "precisa retomar", data: "2026-10-27" },
    { id: 5, alunoId: 3, habilidadeId: 1, observacao: "Acertou 5 de 5 questões de fração equivalente.", nivel: "dominado", data: "2026-10-20" },
    { id: 6, alunoId: 3, habilidadeId: 4, observacao: "Esquece o acento em palavras proparoxítonas.", nivel: "em desenvolvimento", data: "2026-10-23" },
    { id: 7, alunoId: 4, habilidadeId: 3, observacao: "Tem dificuldade em inferir informações que não estão explícitas.", nivel: "precisa retomar", data: "2026-10-22" },
    { id: 8, alunoId: 4, habilidadeId: 2, observacao: "Resolveu corretamente 4 de 5 problemas com decimais.", nivel: "dominado", data: "2026-10-27" },
    { id: 9, alunoId: 5, habilidadeId: 5, observacao: "Lê o gráfico de barras, mas erra ao comparar valores.", nivel: "em desenvolvimento", data: "2026-10-21" },
    { id: 10, alunoId: 5, habilidadeId: 3, observacao: "Responde bem às questões de interpretação.", nivel: "dominado", data: "2026-10-24" },
    { id: 11, alunoId: 6, habilidadeId: 5, observacao: "Não soube localizar dados em tabelas de dupla entrada.", nivel: "precisa retomar", data: "2026-10-21" },
    { id: 12, alunoId: 6, habilidadeId: 4, observacao: "Acentua corretamente oxítonas e paroxítonas.", nivel: "dominado", data: "2026-10-24" },
    { id: 13, alunoId: 7, habilidadeId: 2, observacao: "Erra a multiplicação de decimais por 10 e por 100.", nivel: "precisa retomar", data: "2026-10-28" },
    { id: 14, alunoId: 7, habilidadeId: 3, observacao: "Compreende o texto, mas tem dificuldade em justificar a resposta.", nivel: "em desenvolvimento", data: "2026-10-24" },
    { id: 15, alunoId: 8, habilidadeId: 1, observacao: "Domina a comparação e a simplificação de frações.", nivel: "dominado", data: "2026-10-28" },
    { id: 16, alunoId: 8, habilidadeId: 5, observacao: "Interpreta gráficos de linha sem dificuldade.", nivel: "dominado", data: "2026-10-28" },
];