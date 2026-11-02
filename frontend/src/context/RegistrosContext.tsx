"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Registro } from "../types";
import { registrosMock } from "../data/mock";

interface RegistrosContextType {
    registros: Registro[];
    adicionarRegistros: (novos: Omit<Registro, "id">[]) => void;
    editarRegistro: (id: number, mudanca: Partial<Omit<Registro, "id">>) => void;
    removerRegistro: (id: number) => void;
}

const RegistrosContext = createContext<RegistrosContextType | null>(null);

export function RegistrosProvider({ children }: { children: ReactNode }) {
    const [registros, setRegistros] = useState<Registro[]>(registrosMock);

    function adicionarRegistros(novos: Omit<Registro, "id">[]) {
    setRegistros((atual) => {
        let proximoId = atual.length > 0 ? Math.max(...atual.map((r) => r.id)) + 1 : 1;
        return [...atual, ...novos.map((r) => ({ ...r, id: proximoId++ }))];
    });
    }

    function editarRegistro(id: number, mudanca: Partial<Omit<Registro, "id">>) {
        setRegistros((atual) => atual.map((r) => (r.id === id ? { ...r, ...mudanca } : r)));
    }

    function removerRegistro(id: number) {
        setRegistros((atual) => atual.filter((r) => r.id !== id));
    }

    return (
    <RegistrosContext.Provider
        value={{ registros, adicionarRegistros, editarRegistro, removerRegistro }}
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