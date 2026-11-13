import { api, removerToken, salvarToken } from "./api";
import { Professor } from "../types";

export async function login(email: string, senha: string) {
  const resposta = await api<{ accessToken: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, senha }),
  });
  salvarToken(resposta.accessToken);
}

export function sair() {
  removerToken();
}

export const buscarProfessor = () => api<Professor>("/auth/eu");

