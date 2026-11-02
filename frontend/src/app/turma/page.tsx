"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTurmas } from "../../context/TurmasContext";
import { useAlunos } from "../../context/AlunosContext";
import { useRegistros } from "../../context/RegistrosContext";
import { Aluno, Nivel } from "../../types";
import Button from "../../components/ui/button";
import Input from "../../components/ui/input";
import Card from "../../components/ui/caixinha";
import Badge from "../../components/ui/badge";
import Alerta from "../../components/ui/alerta";
import { registrosAtuais } from "../../utils/registros";

const niveis: Nivel[] = ["precisa retomar", "em desenvolvimento", "dominado"];

function ListaAlunos() {
  const router = useRouter();
  const params = useSearchParams();
  const { turmas } = useTurmas();
  const { alunos: todosAlunos, adicionarAluno, editarAluno, removerAluno } = useAlunos();

  const { registros: todosRegistros } = useRegistros();
  const [formAberto, setFormAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [nome, setNome] = useState("");
  const [erroNome, setErroNome] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [alertaVisivel, setAlertaVisivel] = useState(false);

  const id = Number(params.get("id"));
  const turma = turmas.find((t) => t.id === id);
  const alunos = todosAlunos.filter((a) => a.turmaId === id);

  function avisar(texto: string) {
    setMensagem(texto);
    setAlertaVisivel(true);
  }

  function abrirNovo() {
    setEditandoId(null);
    setNome("");
    setErroNome("");
    setFormAberto(true);
  }

  function abrirEdicao(aluno: Aluno) {
    setEditandoId(aluno.id);
    setNome(aluno.nome);
    setErroNome("");
    setFormAberto(true);
  }

  function fecharForm() {
    setFormAberto(false);
    setEditandoId(null);
    setNome("");
    setErroNome("");
  }

  function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) {
      setErroNome("Informe o nome do aluno");
      return;
    }
    if (editandoId !== null) {
      editarAluno(editandoId, nome.trim());
      avisar("Aluno atualizado!");
    } else {
      adicionarAluno(nome.trim(), id);
      avisar("Aluno adicionado!");
    }
    fecharForm();
  }

  function remover(aluno: Aluno) {
    if (window.confirm(`Remover ${aluno.nome} da turma?`)) {
      removerAluno(aluno.id);
      avisar("Aluno removido.");
    }
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
      <Button variante="secundario" onClick={() => router.push("/turmas")}>
        ← Voltar
      </Button>

      <div className="mt-4 flex w-full items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{turma.nome}</h1>
          <p className="text-gray-600">
            {turma.serie} · {alunos.length} alunos
          </p>
        </div>
        <div className="flex gap-2">
            <Button variante="secundario" onClick={() => router.push(`/registrar?turma=${id}`)}>
                Registrar habilidade
            </Button>
            <Button onClick={abrirNovo}>Adicionar aluno</Button>
            </div>
      </div>

      {formAberto && (
        <Card className="mt-4">
          <form onSubmit={salvar} className="flex flex-col gap-4">
            <Input
              id="nome-aluno"
              label={editandoId !== null ? "Editar nome do aluno" : "Nome do aluno"}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              erro={erroNome}
            />
            <div className="flex gap-2">
              <Button type="submit">Salvar</Button>
              <Button type="button" variante="secundario" onClick={fecharForm}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      {alunos.length === 0 && (
        <p className="mt-6 text-gray-600">Nenhum aluno nesta turma ainda.</p>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {alunos.map((aluno) => {
          const registros = registrosAtuais(todosRegistros.filter((r) => r.alunoId === aluno.id));
          return (
            <Card key={aluno.id} onClick={() => router.push(`/aluno?id=${aluno.id}`)}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-semibold">{aluno.nome}</h2>
                <div className="flex flex-wrap items-center gap-2">
                  {registros.length === 0 && (
                    <span className="text-sm text-gray-500">Sem registros</span>
                  )}
                  {niveis.map((nivel) => {
                    const qtd = registros.filter((r) => r.nivel === nivel).length;
                    return qtd > 0 ? <Badge key={nivel} nivel={nivel} quantidade={qtd} /> : null;
                  })}
                  <Button
                    variante="secundario"
                    onClick={(e) => {
                      e.stopPropagation();
                      abrirEdicao(aluno);
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    variante="perigo"
                    onClick={(e) => {
                      e.stopPropagation();
                      remover(aluno);
                    }}
                  >
                    Remover
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Alerta
        tipo="sucesso"
        mensagem={mensagem}
        visivel={alertaVisivel}
        onFechar={() => setAlertaVisivel(false)}
      />
    </main>
  );
}

export default function TurmaPage() {
  return (
    <Suspense fallback={<p className="p-6">Carregando...</p>}>
      <ListaAlunos />
    </Suspense>
  );
}