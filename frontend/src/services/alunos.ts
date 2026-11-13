import { api } from "./api";
import { Aluno, SugestaoIA } from "../types";

export const listarAlunos = () => api<Aluno[]>("/alunos");

export const criarAluno = (dados: Omit<Aluno, "id">) =>
  api<Aluno>("/alunos", { method: "POST", body: JSON.stringify(dados) });

export const editarAluno = (id: number, nome: string) =>
  api<Aluno>(`/alunos/${id}`, { method: "PUT", body: JSON.stringify({ nome }) });

export const removerAluno = (id: number) =>
  api<void>(`/alunos/${id}`, { method: "DELETE" });

export const sugestaoDoAluno = (id: number) =>
  api<SugestaoIA>(`/alunos/${id}/sugestao`, { method: "POST" });