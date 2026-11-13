import { api } from "./api";
import { Habilidade } from "../types";

export const listarHabilidades = () => api<Habilidade[]>("/habilidades");