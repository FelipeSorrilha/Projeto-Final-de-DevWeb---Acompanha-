import { api } from "./api";
import { Registro } from "../types";

export const listarRegistros = () => api<Registro[]>("/registros");

export const criarRegistros = (lista: Omit<Registro, "id">[]) =>
  api<Registro[]>("/registros", { method: "POST", body: JSON.stringify(lista) });

export const editarRegistro = (id: number, mudanca: Partial<Omit<Registro, "id">>) =>
  api<Registro>(`/registros/${id}`, { method: "PUT", body: JSON.stringify(mudanca) });

export const removerRegistro = (id: number) =>
  api<void>(`/registros/${id}`, { method: "DELETE" });