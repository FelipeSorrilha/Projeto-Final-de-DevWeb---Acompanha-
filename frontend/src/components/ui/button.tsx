import { ButtonHTMLAttributes } from "react";

type Variante = "primario" | "secundario" | "perigo";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variante?: Variante;
    carregando?: boolean;
}

const estilos: Record<Variante, string> = {
    primario: "bg-blue-600 text-white hover:bg-blue-700",
    secundario: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    perigo: "bg-red-600 text-white hover:bg-red-700",
};

export default function Button({
    variante = "primario",
    carregando = false,
    disabled,
    children,
    className = "",
    ...resto
}: ButtonProps) {
    return (
    <button
        disabled={disabled || carregando}
        className={`rounded-lg px-4 py-2 font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${estilos[variante]} ${className}`}
        {...resto}
    >
        {carregando ? "Aguarde..." : children}
    </button>
    );
}