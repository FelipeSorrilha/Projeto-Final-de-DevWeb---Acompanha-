"use client";

import { createContext, useContext, ReactNode } from "react";
import { Habilidade } from "../types";
import { useLista } from "../hooks/useLista";
import { criarHabilidade, listarHabilidades } from "../services/habilidades";

interface HabilidadesContextType {
  habilidades: Habilidade[];
  carregando: boolean;
  erro: string;
  recarregar: () => Promise<void>;
  adicionarHabilidade: (descricao: string, componente: string) => Promise<Habilidade>;
}

const HabilidadesContext = createContext<HabilidadesContextType | null>(null);

const igual = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

export function HabilidadesProvider({ children }: { children: ReactNode }) {
  const { itens: habilidades, setItens, carregando, erro, recarregar } = useLista(listarHabilidades);

  // Se a habilidade já existe, devolve a existente em vez de criar outra.
  async function adicionarHabilidade(descricao: string, componente: string) {
    const existente = habilidades.find(
      (h) => igual(h.descricao, descricao) && igual(h.componente, componente)
    );
    if (existente) return existente;

    const nova = await criarHabilidade({ descricao, componente });
    setItens((atual) => [...atual, nova]);
    return nova;
  }

  return (
    <HabilidadesContext.Provider
      value={{ habilidades, carregando, erro, recarregar, adicionarHabilidade }}
    >
      {children}
    </HabilidadesContext.Provider>
  );
}

export function useHabilidades() {
  const contexto = useContext(HabilidadesContext);
  if (!contexto) throw new Error("useHabilidades deve ser usado dentro de HabilidadesProvider");
  return contexto;
}