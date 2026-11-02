"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Aluno } from "../types";
import { alunosMock } from "../data/mock";

interface AlunosContextType {
    alunos: Aluno[];
    adicionarAluno: (nome: string, turmaId: number) => void;
    editarAluno: (id: number, nome: string) => void;
    removerAluno: (id: number) => void;
}

const AlunosContext = createContext<AlunosContextType | null>(null);

export function AlunosProvider({ children }: { children: ReactNode }) {
    const [alunos, setAlunos] = useState<Aluno[]>(alunosMock);

    function adicionarAluno(nome: string, turmaId: number) {
    setAlunos((atual) => {
        const novoId = atual.length > 0 ? Math.max(...atual.map((a) => a.id)) + 1 : 1;
        return [...atual, { id: novoId, nome, turmaId }];
    });
    }

    function editarAluno(id: number, nome: string) {
    setAlunos((atual) => atual.map((a) => (a.id === id ? { ...a, nome } : a)));
    }

    function removerAluno(id: number) {
    setAlunos((atual) => atual.filter((a) => a.id !== id));
    }

    return (
    <AlunosContext.Provider value={{ alunos, adicionarAluno, editarAluno, removerAluno }}>
        {children}
    </AlunosContext.Provider>
    );
}

export function useAlunos() {
    const contexto = useContext(AlunosContext);
    if (!contexto) throw new Error("useAlunos deve ser usado dentro de AlunosProvider");
    return contexto;
}
