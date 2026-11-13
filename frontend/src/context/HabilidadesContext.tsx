"use client";

import { createContext, useContext, ReactNode } from "react";
import { Habilidade } from "../types";
import { useLista } from "../hooks/useLista";
import { listarHabilidades } from "../services/habilidades";

interface HabilidadesContextType {
  habilidades: Habilidade[];
  carregando: boolean;
  erro: string;
  recarregar: () => Promise<void>;
}

const HabilidadesContext = createContext<HabilidadesContextType | null>(null);

export function HabilidadesProvider({ children }: { children: ReactNode }) {
  const { itens: habilidades, carregando, erro, recarregar } = useLista(listarHabilidades);

  return (
    <HabilidadesContext.Provider value={{ habilidades, carregando, erro, recarregar }}>
      {children}
    </HabilidadesContext.Provider>
  );
}

export function useHabilidades() {
  const contexto = useContext(HabilidadesContext);
  if (!contexto) throw new Error("useHabilidades deve ser usado dentro de HabilidadesProvider");
  return contexto;
}