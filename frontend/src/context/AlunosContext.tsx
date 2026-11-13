"use client";

import { createContext, useContext, ReactNode } from "react";
import { Aluno } from "../types";
import { useLista } from "../hooks/useLista";
import * as servico from "../services/alunos";

interface AlunosContextType {
  alunos: Aluno[];
  carregando: boolean;
  erro: string;
  recarregar: () => Promise<void>;
  adicionarAluno: (nome: string, turmaId: number) => Promise<void>;
  editarAluno: (id: number, nome: string) => Promise<void>;
  removerAluno: (id: number) => Promise<void>;
}

const AlunosContext = createContext<AlunosContextType | null>(null);

export function AlunosProvider({ children }: { children: ReactNode }) {
  const { itens: alunos, setItens, carregando, erro, recarregar } = useLista(servico.listarAlunos);

  async function adicionarAluno(nome: string, turmaId: number) {
    const novo = await servico.criarAluno({ nome, turmaId });
    setItens((atual) => [...atual, novo]);
  }

  async function editarAluno(id: number, nome: string) {
    const atualizado = await servico.editarAluno(id, nome);
    setItens((atual) => atual.map((a) => (a.id === id ? atualizado : a)));
  }

  async function removerAluno(id: number) {
    await servico.removerAluno(id);
    setItens((atual) => atual.filter((a) => a.id !== id));
  }

  return (
    <AlunosContext.Provider
      value={{ alunos, carregando, erro, recarregar, adicionarAluno, editarAluno, removerAluno }}
    >
      {children}
    </AlunosContext.Provider>
  );
}

export function useAlunos() {
  const contexto = useContext(AlunosContext);
  if (!contexto) throw new Error("useAlunos deve ser usado dentro de AlunosProvider");
  return contexto;
}