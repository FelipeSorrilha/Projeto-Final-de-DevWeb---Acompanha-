"use client";

import { useEffect } from "react";

export type TipoAlerta = "sucesso" | "atencao" | "erro";

interface AlertaProps {
    tipo: TipoAlerta;
    mensagem: string;
    descricao?: string;
    visivel: boolean;
    onFechar: () => void;
}

const estilos = {
    sucesso: {
    cor: "border-green-500",
    iconeCor: "text-green-600",
    icone: "V",
    },
    atencao: {
    cor: "border-yellow-500",
    iconeCor: "text-yellow-600",
    icone: "!",
    },
    erro: {
    cor: "border-red-500",
    iconeCor: "text-red-600",
    icone: "X",
    },
};

export default function Alerta({
    tipo,
    mensagem,
    descricao,
    visivel,
    onFechar,
}: AlertaProps) {
    useEffect(() => {
    if (!visivel) return;

    const temporizador = setTimeout(() => {
        onFechar();
    }, 4000);

    return () => clearTimeout(temporizador);
    }, [visivel, onFechar]);

    if (!visivel) return null;

    const estilo = estilos[tipo];

    return (
    <div
        role={tipo === "erro" ? "alert" : "status"}
        aria-live={tipo === "erro" ? "assertive" : "polite"}
        className={`
        fixed top-5 right-5 z-50
        w-[calc(100%-2.5rem)] max-w-sm
        rounded-lg border-l-4
        bg-white shadow-lg
        p-4
        flex items-start gap-3
        animate-in fade-in slide-in-from-right-5
        duration-300
        ${estilo.cor}
        `}
    >
      {}
        <div
        className={`
            flex items-center justify-center
            w-7 h-7 rounded-full
            bg-gray-100 font-bold text-lg
            ${estilo.iconeCor}
        `}
        >
        {estilo.icone}
        </div>

      {} 
        <div className="flex-1">
        <h3 className="font-semibold text-gray-800">
            {mensagem}
        </h3>

        {descricao && (
            <p className="text-sm text-gray-600 mt-1">
            {descricao}
            </p>
        )}
        </div>

      {}
        <button
        type="button"
        onClick={onFechar}
        aria-label="Fechar alerta"
        className="text-gray-400 hover:text-gray-700
                    text-xl font-bold transition-colors"
        >
        x
        </button>
    </div>
    );
}
