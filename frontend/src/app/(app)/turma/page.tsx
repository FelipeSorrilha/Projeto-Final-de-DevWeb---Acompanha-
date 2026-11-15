"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTurmas } from "../../../context/TurmasContext";
import { useAlunos } from "../../../context/AlunosContext";
import { useRegistros } from "../../../context/RegistrosContext";
import { sugestaoDaTurma } from "../../../services/turmas";
import { mensagemDeErro } from "../../../services/api";
import { registrosAtuais } from "../../../utils/registros";
import { Aluno, Nivel, SugestaoTurma } from "../../../types";
import Button from "../../../components/ui/button";
import Input from "../../../components/ui/input";
import Card from "../../../components/ui/caixinha";
import Badge from "../../../components/ui/badge";
import Alerta, { TipoAlerta } from "../../../components/ui/alerta";
import EstadoCarga from "../../../components/EstadoCarga";

const niveis: Nivel[] = ["precisa retomar", "em desenvolvimento", "dominado"];

function ListaAlunos() {
  const router = useRouter();
  const params = useSearchParams();
  const turmasCtx = useTurmas();
  const alunosCtx = useAlunos();
  const registrosCtx = useRegistros();
  const { adicionarAluno, editarAluno, removerAluno } = alunosCtx;

  const [formAberto, setFormAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [nome, setNome] = useState("");
  const [erroNome, setErroNome] = useState("");
  const [salvando, setSalvando] = useState(false);

  const [gerando, setGerando] = useState(false);
  const [sugestao, setSugestao] = useState<SugestaoTurma | null>(null);

  const [alertaVisivel, setAlertaVisivel] = useState(false);
  const [alertaTipo, setAlertaTipo] = useState<TipoAlerta>("sucesso");
  const [alertaMensagem, setAlertaMensagem] = useState("");

  const id = Number(params.get("id"));
  const turma = turmasCtx.turmas.find((t) => t.id === id);
  const alunos = alunosCtx.alunos.filter((a) => a.turmaId === id);

  const carregando = turmasCtx.carregando || alunosCtx.carregando || registrosCtx.carregando;
  const erroCarga = turmasCtx.erro || alunosCtx.erro || registrosCtx.erro;

  function recarregarTudo() {
    turmasCtx.recarregar();
    alunosCtx.recarregar();
    registrosCtx.recarregar();
  }

  function avisar(tipo: TipoAlerta, mensagem: string) {
    setAlertaTipo(tipo);
    setAlertaMensagem(mensagem);
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

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) {
      setErroNome("Informe o nome do aluno");
      return;
    }
    setSalvando(true);
    try {
      if (editandoId !== null) {
        await editarAluno(editandoId, nome.trim());
        avisar("sucesso", "Aluno atualizado!");
      } else {
        await adicionarAluno(nome.trim(), id);
        avisar("sucesso", "Aluno adicionado!");
      }
      fecharForm();
    } catch (err) {
      avisar("erro", mensagemDeErro(err));
    } finally {
      setSalvando(false);
    }
  }

  async function remover(aluno: Aluno) {
    if (!window.confirm(`Remover ${aluno.nome} da turma?`)) return;
    try {
      await removerAluno(aluno.id);
      await registrosCtx.recarregar(); // a API apagou os registros do aluno
      avisar("sucesso", "Aluno removido.");
    } catch (err) {
      avisar("erro", mensagemDeErro(err));
    }
  }

  async function gerarSugestao() {
    setGerando(true);
    setSugestao(null);
    try {
      setSugestao(await sugestaoDaTurma(id));
    } catch (err) {
      avisar("erro", mensagemDeErro(err));
    } finally {
      setGerando(false);
    }
  }

  if (carregando || erroCarga) {
    return (
      <main className="mx-auto w-full max-w-4xl p-6">
        <EstadoCarga carregando={carregando} erro={erroCarga} onTentarNovamente={recarregarTudo} />
      </main>
    );
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

      <div className="mt-4 flex w-full flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">{turma.nome}</h1>
          <p className="text-gray-600">
            {turma.serie} · {alunos.length} alunos
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
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
              <Button type="submit" carregando={salvando}>
                Salvar
              </Button>
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
          const registros = registrosAtuais(
            registrosCtx.registros.filter((r) => r.alunoId === aluno.id)
          );
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

      <h2 className="mt-8 text-lg font-semibold">Sugestão da IA para a turma</h2>
      <Card className="mt-3">
        {!sugestao && !gerando && (
          <p className="text-gray-600">
            Analisa as habilidades da turma e indica onde vale uma revisão coletiva.
          </p>
        )}
        {gerando && (
          <p className="text-gray-600">Gerando sugestão... pode levar alguns segundos.</p>
        )}
        {sugestao && (
          <div className="flex flex-col gap-4">
            <div>
              <p className="font-semibold">Resumo</p>
              <p className="text-gray-700">{sugestao.resumo}</p>
            </div>
            <div>
              <p className="font-semibold">Atividade sugerida</p>
              <p className="text-gray-700">{sugestao.atividade}</p>
            </div>
            <div>
              <p className="font-semibold">Por habilidade</p>
              <div className="mt-2 flex flex-col gap-2">
                {sugestao.habilidades.map((h) => (
                  <div key={h.habilidadeId} className="rounded-lg border border-gray-200 p-3">
                    <p className="font-medium">
                      {h.descricao} <span className="text-gray-500">({h.componente})</span>
                    </p>
                    <p className="text-sm text-gray-700">
                      {h.precisamRetomar} de {h.avaliados} alunos avaliados precisam retomar (
                      {h.percentualDificuldade}%)
                    </p>
                    {h.alunosParaApoio.length > 0 && (
                      <p className="text-sm text-gray-500">
                        Apoio: {h.alunosParaApoio.join(", ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="mt-4">
          <Button onClick={gerarSugestao} carregando={gerando}>
            Gerar sugestão para a turma
          </Button>
        </div>
      </Card>

      <Alerta
        tipo={alertaTipo}
        mensagem={alertaMensagem}
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