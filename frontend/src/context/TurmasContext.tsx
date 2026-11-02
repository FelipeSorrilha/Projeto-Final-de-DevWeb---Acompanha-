"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Turma } from "../types";
import { turmasMock } from "../data/mock";

interface TurmasContextType {
    turmas: Turma[];
    adicionarTurma: (nome: string, serie: string) => void;
}

const TurmasContext = createContext<TurmasContextType | null>(null);

export function TurmasProvider({ children }: { children: ReactNode }) {
    const [turmas, setTurmas] = useState<Turma[]>(turmasMock);

    function adicionarTurma(nome: string, serie: string) {
    const novoId = turmas.length > 0 ? Math.max(...turmas.map((t) => t.id)) + 1 : 1;
    setTurmas([...turmas, { id: novoId, nome, serie }]);
    }

    return (
    <TurmasContext.Provider value={{ turmas, adicionarTurma }}>
        {children}
    </TurmasContext.Provider>
    );
}

export function useTurmas() {
    const contexto = useContext(TurmasContext);
    if (!contexto) throw new Error("useTurmas deve ser usado dentro de TurmasProvider");
    return contexto;
}