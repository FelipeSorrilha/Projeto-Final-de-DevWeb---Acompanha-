export type Nivel = "dominado" | "em desenvolvimento" | "precisa retomar";

export interface Turma {
    id: number;
    nome: string;
    serie: string;
}

export interface Aluno {
    id: number;
    nome: string;
    turmaId: number;
}

export interface Habilidade {
    id: number;
    descricao: string;
    componente: string;
}

export interface Registro {
    id: number;
    alunoId: number;
    habilidadeId: number;
    observacao: string;
    nivel: Nivel;
    data: string; // formato AAAA-MM-DD
}