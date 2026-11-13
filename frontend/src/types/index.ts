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

export interface SugestaoIA {
  resumo: string;
  conteudosParaRetomar: string[];
  atividade: string;
}

export interface Professor {
  id: number;
  nome: string;
  email: string;
}

export interface HabilidadeTurma {
  habilidadeId: number;
  descricao: string;
  componente: string;
  avaliados: number;
  precisamRetomar: number;
  emDesenvolvimento: number;
  dominaram: number;
  percentualDificuldade: number;
  alunosParaApoio: string[];
}

export interface SugestaoTurma {
  resumo: string;
  atividade: string;
  habilidades: HabilidadeTurma[];
}