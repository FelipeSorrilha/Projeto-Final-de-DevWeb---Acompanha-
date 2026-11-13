"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTurmas } from "../../context/TurmasContext";
import { useAlunos } from "../../context/AlunosContext";
import Button from "../../components/ui/button";
import Input from "../../components/ui/input";
import Card from "../../components/ui/caixinha";
import Alerta from "../../components/ui/alerta";
import { sair } from "../../services/auth";

export default function Turmas() {
  const router = useRouter();
  const { turmas, adicionarTurma } = useTurmas();
  const { alunos } = useAlunos();

  const [formAberto, setFormAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [serie, setSerie] = useState("");
  const [erroNome, setErroNome] = useState("");
  const [erroSerie, setErroSerie] = useState("");
  const [sucesso, setSucesso] = useState(false);

  function fecharForm() {
    setFormAberto(false);
    setNome("");
    setSerie("");
    setErroNome("");
    setErroSerie("");
  }

  function salvar(e: React.FormEvent) {
    e.preventDefault();
    setErroNome(nome.trim() ? "" : "Informe o nome da turma");
    setErroSerie(serie.trim() ? "" : "Informe a série");
    if (!nome.trim() || !serie.trim()) return;

    adicionarTurma(nome.trim(), serie.trim());
    fecharForm();
    setSucesso(true);
  }

  return (
    <main className="mx-auto w-full max-w-4xl p-6">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Minhas turmas</h1>
        <Button onClick={() => setFormAberto(true)}>Nova turma</Button>
      </div>


      <div className="flex gap-2">
        <Button variante="secundario" onClick={() => { sair(); router.push("/"); }}>
          Sair
        </Button>
        <Button onClick={() => setFormAberto(true)}>Nova turma</Button>
      </div>

      {formAberto && (
        <Card className="mt-4">
          <form onSubmit={salvar} className="flex flex-col gap-4">
            <Input
              id="nome"
              label="Nome da turma"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              erro={erroNome}
            />
            <Input
              id="serie"
              label="Série"
              value={serie}
              onChange={(e) => setSerie(e.target.value)}
              erro={erroSerie}
            />
            <div className="flex gap-2">
              <Button type="submit">Salvar turma</Button>
              <Button type="button" variante="secundario" onClick={fecharForm}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {turmas.map((turma) => {
          const qtd = alunos.filter((a) => a.turmaId === turma.id).length;
          return (
            <Card key={turma.id} onClick={() => router.push(`/turma?id=${turma.id}`)}>
              <h2 className="text-lg font-semibold">{turma.nome}</h2>
              <p className="text-gray-600">{turma.serie}</p>
              <p className="mt-2 text-sm text-gray-500">{qtd} alunos</p>
            </Card>
          );
        })}
      </div>

      <Alerta
        tipo="sucesso"
        mensagem="Turma criada com sucesso!"
        visivel={sucesso}
        onFechar={() => setSucesso(false)}
      />
    </main>
  );
}