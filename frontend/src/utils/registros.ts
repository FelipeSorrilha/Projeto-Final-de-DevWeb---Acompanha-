import { Registro } from "../types";

// Retorna só o registro mais recente de cada habilidade
export function registrosAtuais(registros: Registro[]): Registro[] {
    const mais_recentes = new Map<number, Registro>();
    for (const r of registros) {
    const atual = mais_recentes.get(r.habilidadeId);
    if (!atual || r.data > atual.data || (r.data === atual.data && r.id > atual.id)) {
        mais_recentes.set(r.habilidadeId, r);
    }
    }
    return Array.from(mais_recentes.values());
}