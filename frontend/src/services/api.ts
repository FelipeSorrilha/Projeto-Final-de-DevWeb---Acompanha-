const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CHAVE_TOKEN = "acompanha_token";

export class ApiError extends Error {
  status: number;
  constructor(status: number, mensagem: string) {
    super(mensagem);
    this.status = status;
  }
}

export function lerToken(): string | null {
  try {
    return localStorage.getItem(CHAVE_TOKEN);
  } catch {
    return null;
  }
}

export function salvarToken(token: string) {
  localStorage.setItem(CHAVE_TOKEN, token);
}

export function removerToken() {
  try {
    localStorage.removeItem(CHAVE_TOKEN);
  } catch {
    // sem acesso ao armazenamento: nada a remover
  }
}

export async function api<T>(caminho: string, opcoes: RequestInit = {}): Promise<T> {
  if (!API_URL) {
    throw new ApiError(0, "URL da API não configurada.");
  }

  const headers = new Headers(opcoes.headers);
  if (opcoes.body) headers.set("Content-Type", "application/json");
  const token = lerToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let resposta: Response;
  try {
    resposta = await fetch(`${API_URL}${caminho}`, { ...opcoes, headers });
  } catch {
    throw new ApiError(0, "Não foi possível conectar ao servidor. Tente novamente.");
  }

  // token ausente, inválido ou expirado: volta para o login
  if (resposta.status === 401 && caminho !== "/auth/login") {
    removerToken();
    window.location.href = "/";
    throw new ApiError(401, "Sessão expirada. Faça login novamente.");
  }

  if (!resposta.ok) {
    let mensagem = "Ocorreu um erro inesperado.";
    try {
      const corpo = await resposta.json();
      if (typeof corpo.detail === "string") mensagem = corpo.detail;
      else if (resposta.status === 422) mensagem = "Dados inválidos. Confira os campos.";
    } catch {
      // resposta sem JSON: mantém a mensagem padrão
    }
    throw new ApiError(resposta.status, mensagem);
  }

  if (resposta.status === 204) return undefined as T;
  return resposta.json() as Promise<T>;
}