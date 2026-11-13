"use client";

import { createContext, useContext, ReactNode } from "react";
import { Turma } from "../types";
import { useLista } from "../hooks/useLista";
import { criarTurma, listarTurmas } from "../services/turmas";

interface TurmasContextType {
  turmas: Turma[];
  carregando: boolean;
  erro: string;
  recarregar: () => Promise<void>;
  adicionarTurma: (nome: string, serie: string) => Promise<void>;
}

const TurmasContext = createContext<TurmasContextType | null>(null);

export function TurmasProvider({ children }: { children: ReactNode }) {
  const { itens: turmas, setItens, carregando, erro, recarregar } = useLista(listarTurmas);

  async function adicionarTurma(nome: string, serie: string) {
    const nova = await criarTurma({ nome, serie });
    setItens((atual) => [...atual, nova]);
  }

  return (
    <TurmasContext.Provider value={{ turmas, carregando, erro, recarregar, adicionarTurma }}>
      {children}
    </TurmasContext.Provider>
  );
}

export function useTurmas() {
  const contexto = useContext(TurmasContext);
  if (!contexto) throw new Error("useTurmas deve ser usado dentro de TurmasProvider");
  return contexto;
}