import { api } from "./api";
import { SugestaoTurma, Turma } from "../types";

export const listarTurmas = () => api<Turma[]>("/turmas");

export const criarTurma = (dados: Omit<Turma, "id">) =>
  api<Turma>("/turmas", { method: "POST", body: JSON.stringify(dados) });

export const sugestaoDaTurma = (id: number) =>
  api<SugestaoTurma>(`/turmas/${id}/sugestao`, { method: "POST" });