"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../components/ui/button";
import Input from "../components/ui/input";
import Card from "../components/ui/caixinha";
import Alerta from "../components/ui/alerta";
import { login } from "../services/auth";
import { ApiError } from "../services/api";

export default function Landing() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");

async function entrar(e: React.FormEvent) {
  e.preventDefault();
  if (!email.trim() || !senha.trim()) {
    setMensagemErro("Preencha e-mail e senha");
    setErro(true);
    return;
  }
  setCarregando(true);
  try {
    await login(email.trim(), senha);
    router.push("/turmas");
  } catch (e) {
    setMensagemErro(e instanceof ApiError ? e.message : "Erro inesperado ao entrar");
    setErro(true);
    setCarregando(false);
  }
}

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Acompanha+</h1>
        <p className="mt-2 text-gray-600">
          Um jeito simples de ver o que cada aluno está aprendendo e precisa retomar.
        </p>
      </div>

      <Card className="w-full max-w-sm">
        <form onSubmit={entrar} className="flex flex-col gap-4">
          <Input
            id="email"
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            id="senha"
            label="Senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <Button type="submit" carregando={carregando}>
            Entrar
          </Button>
          {carregando && (
            <p className="text-sm text-gray-500">
              Conectando ao servidor... a primeira vez pode levar até 1 minuto.
            </p>
          )}
        </form>
      </Card>

    <Alerta
      tipo="erro"
      mensagem={mensagemErro}
      visivel={erro}
      onFechar={() => setErro(false)}
    />
    </main>
  );
}