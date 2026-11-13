"use client";

import { createContext, useContext, ReactNode } from "react";
import { Registro } from "../types";
import { useLista } from "../hooks/useLista";
import * as servico from "../services/registros";

interface RegistrosContextType {
  registros: Registro[];
  carregando: boolean;
  erro: string;
  recarregar: () => Promise<void>;
  adicionarRegistros: (novos: Omit<Registro, "id">[]) => Promise<void>;
  editarRegistro: (id: number, mudanca: Partial<Omit<Registro, "id">>) => Promise<void>;
  removerRegistro: (id: number) => Promise<void>;
}

const RegistrosContext = createContext<RegistrosContextType | null>(null);

export function RegistrosProvider({ children }: { children: ReactNode }) {
  const { itens: registros, setItens, carregando, erro, recarregar } = useLista(
    servico.listarRegistros
  );

  async function adicionarRegistros(novos: Omit<Registro, "id">[]) {
    const criados = await servico.criarRegistros(novos);
    setItens((atual) => [...atual, ...criados]);
  }

  async function editarRegistro(id: number, mudanca: Partial<Omit<Registro, "id">>) {
    const atualizado = await servico.editarRegistro(id, mudanca);
    setItens((atual) => atual.map((r) => (r.id === id ? atualizado : r)));
  }

  async function removerRegistro(id: number) {
    await servico.removerRegistro(id);
    setItens((atual) => atual.filter((r) => r.id !== id));
  }

  return (
    <RegistrosContext.Provider
      value={{
        registros,
        carregando,
        erro,
        recarregar,
        adicionarRegistros,
        editarRegistro,
        removerRegistro,
      }}
    >
      {children}
    </RegistrosContext.Provider>
  );
}

export function useRegistros() {
  const contexto = useContext(RegistrosContext);
  if (!contexto) throw new Error("useRegistros deve ser usado dentro de RegistrosProvider");
  return contexto;
}