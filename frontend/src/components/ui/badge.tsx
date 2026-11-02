import { Nivel } from "../../types";

const cores: Record<Nivel, string> = {
    "dominado": "bg-green-100 text-green-800",
    "em desenvolvimento": "bg-yellow-100 text-yellow-800",
    "precisa retomar": "bg-red-100 text-red-800",
};

export default function Badge({ nivel, quantidade }: { nivel: Nivel; quantidade?: number }) {
    return (
    <span className={`rounded-full px-3 py-1 text-sm font-medium ${cores[nivel]}`}>
        {quantidade !== undefined ? `${quantidade} ` : ""}{nivel}
    </span>
    );
}