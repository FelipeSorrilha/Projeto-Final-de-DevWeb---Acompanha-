"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTurmas } from "../../context/TurmasContext";
import { useAlunos } from "../../context/AlunosContext";
import { useRegistros } from "../../context/RegistrosContext";
import { habilidadesMock } from "../../data/mock";
import { Nivel } from "../../types";
import Button from "../../components/ui/button";
import Card from "../../components/ui/caixinha";
import Alerta from "../../components/ui/alerta";

const niveis: Nivel[] = ["precisa retomar", "em desenvolvimento", "dominado"];

const campo =
  "rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500";

interface Linha {
  nivel: Nivel | "";
  observacao: string;
}

function RegistrarTurma() {
  const router = useRouter();
  const params = useSearchParams();
  const { turmas } = useTurmas();
  const { alunos: todosAlunos } = useAlunos();
  const { adicionarRegistros } = useRegistros();

  const turmaId = Number(params.get("turma"));
  const turma = turmas.find((t) => t.id === turmaId);
  const alunos = todosAlunos.filter((a) => a.turmaId === turmaId);

  const [habilidadeId, setHabilidadeId] = useState("");
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));
  const [linhas, setLinhas] = useState<Record<number, Linha>>({});
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [salvando, setSalvando] = useState(false);

function atualizar(alunoId: number, mudanca: Partial<Linha>) {
  setLinhas((atual) => {
    const anterior: Linha = atual[alunoId] ?? { nivel: "", observacao: "" };
    return { ...atual, [alunoId]: { ...anterior, ...mudanca } };
  });
}

  function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (!habilidadeId) {
      setErro("Escolha a habilidade.");
      return;
    }
    const novos = alunos
      .filter((a) => linhas[a.id]?.nivel)
      .map((a) => ({
        alunoId: a.id,
        habilidadeId: Number(habilidadeId),
        observacao: linhas[a.id].observacao.trim(),
        nivel: linhas[a.id].nivel as Nivel,
        data,
      }));
    if (novos.length === 0) {
      setErro("Escolha o nível de pelo menos um aluno.");
      return;
    }
    setErro("");
    setSalvando(true);
    adicionarRegistros(novos);
    setSucesso(true);
    setTimeout(() => router.push(`/turma?id=${turmaId}`), 1200);
  }

  if (!turma) {
    return (
      <main className="mx-auto w-full max-w-4xl p-6">
        <p className="text-gray-700">Turma não encontrada.</p>
        <Button className="mt-4" variante="secundario" onClick={() => router.push("/turmas")}>
          Voltar para turmas
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl p-6">
      <Button variante="secundario" onClick={() => router.push(`/turma?id=${turmaId}`)}>
        ← Voltar
      </Button>

      <h1 className="mt-4 text-2xl font-bold">Registrar habilidade</h1>
      <p className="text-gray-600">{turma.nome}</p>

      <form onSubmit={salvar} className="mt-4 flex flex-col gap-4">
        <Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="habilidade" className="text-sm font-medium text-gray-700">
                Habilidade
              </label>
              <select
                id="habilidade"
                className={campo}
                value={habilidadeId}
                onChange={(e) => setHabilidadeId(e.target.value)}
              >
                <option value="">Selecione...</option>
                {habilidadesMock.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.descricao} ({h.componente})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="data" className="text-sm font-medium text-gray-700">
                Data
              </label>
              <input
                id="data"
                type="date"
                className={campo}
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </div>
          </div>
        </Card>

        <Card>
          {alunos.length === 0 && (
            <p className="text-gray-600">Esta turma ainda não tem alunos.</p>
          )}
          <div className="flex flex-col gap-4">
            {alunos.map((aluno) => (
              <div key={aluno.id} className="grid items-center gap-2 sm:grid-cols-[1fr_200px_2fr]">
                <span className="font-medium">{aluno.nome}</span>
                <select
                  aria-label={`Nível de ${aluno.nome}`}
                  className={campo}
                  value={linhas[aluno.id]?.nivel ?? ""}
                  onChange={(e) => atualizar(aluno.id, { nivel: e.target.value as Nivel | "" })}
                >
                  <option value="">Nível...</option>
                  {niveis.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
                <input
                  aria-label={`Observação sobre ${aluno.nome}`}
                  placeholder="Observação (opcional)"
                  className={campo}
                  value={linhas[aluno.id]?.observacao ?? ""}
                  onChange={(e) => atualizar(aluno.id, { observacao: e.target.value })}
                />
              </div>
            ))}
          </div>
        </Card>

        {erro && <p className="text-sm text-red-600">{erro}</p>}

        <div>
          <Button type="submit" carregando={salvando}>
            Salvar registros
          </Button>
        </div>
      </form>

      <Alerta
        tipo="sucesso"
        mensagem="Registros salvos!"
        visivel={sucesso}
        onFechar={() => setSucesso(false)}
      />
    </main>
  );
}

export default function RegistrarPage() {
  return (
    <Suspense fallback={<p className="p-6">Carregando...</p>}>
      <RegistrarTurma />
    </Suspense>
  );
}