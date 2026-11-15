import { api } from "./api";
import { Habilidade } from "../types";

export const listarHabilidades = () => api<Habilidade[]>("/habilidades");

export const criarHabilidade = (dados: Omit<Habilidade, "id">) =>
  api<Habilidade>("/habilidades", { method: "POST", body: JSON.stringify(dados) });