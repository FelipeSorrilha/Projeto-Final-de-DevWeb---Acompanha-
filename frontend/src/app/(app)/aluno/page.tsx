"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTurmas } from "../../../context/TurmasContext";
import { useAlunos } from "../../../context/AlunosContext";
import { useRegistros } from "../../../context/RegistrosContext";
import { useHabilidades } from "../../../context/HabilidadesContext";
import { sugestaoDoAluno } from "../../../services/alunos";
import { mensagemDeErro } from "../../../services/api";
import { registrosAtuais } from "../../../utils/registros";
import { hoje } from "../../../utils/datas";
import { Nivel, Registro, SugestaoIA } from "../../../types";
import Button from "../../../components/ui/button";
import Input from "../../../components/ui/input";
import Card from "../../../components/ui/caixinha";
import Badge from "../../../components/ui/badge";
import Alerta, { TipoAlerta } from "../../../components/ui/alerta";
import EstadoCarga from "../../../components/EstadoCarga";

const niveis: Nivel[] = ["precisa retomar", "em desenvolvimento", "dominado"];

const campo =
  "rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500";

function formatarData(data: string) {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

function DetalheAluno() {
  const router = useRouter();
  const params = useSearchParams();
  const turmasCtx = useTurmas();
  const alunosCtx = useAlunos();
  const registrosCtx = useRegistros();
  const habilidadesCtx = useHabilidades();
  const { adicionarRegistros, editarRegistro, removerRegistro } = registrosCtx;
  const habilidades = habilidadesCtx.habilidades;

  // IA
  const [gerando, setGerando] = useState(false);
  const [sugestao, setSugestao] = useState<SugestaoIA | null>(null);

  // formulário (serve para "atualizar" e para "corrigir")
  const [formAberto, setFormAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [habilidadeId, setHabilidadeId] = useState("");
  const [nivel, setNivel] = useState<Nivel | "">("");
  const [observacao, setObservacao] = useState("");
  const [erroForm, setErroForm] = useState("");
  const [salvando, setSalvando] = useState(false);

  const [alertaVisivel, setAlertaVisivel] = useState(false);
  const [alertaTipo, setAlertaTipo] = useState<TipoAlerta>("sucesso");
  const [alertaMensagem, setAlertaMensagem] = useState("");

  const id = Number(params.get("id"));
  const aluno = alunosCtx.alunos.find((a) => a.id === id);
  const turma = turmasCtx.turmas.find((t) => t.id === aluno?.turmaId);
  const registros = registrosCtx.registros
    .filter((r) => r.alunoId === id)
    .sort((a, b) => b.data.localeCompare(a.data) || b.id - a.id);
  const atuais = registrosAtuais(registros);

  const carregando =
    turmasCtx.carregando ||
    alunosCtx.carregando ||
    registrosCtx.carregando ||
    habilidadesCtx.carregando;
  const erroCarga = turmasCtx.erro || alunosCtx.erro || registrosCtx.erro || habilidadesCtx.erro;

  function recarregarTudo() {
    turmasCtx.recarregar();
    alunosCtx.recarregar();
    registrosCtx.recarregar();
    habilidadesCtx.recarregar();
  }

  function avisar(tipo: TipoAlerta, mensagem: string) {
    setAlertaTipo(tipo);
    setAlertaMensagem(mensagem);
    setAlertaVisivel(true);
  }

  function nomeHabilidade(habId: number) {
    return habilidades.find((h) => h.id === habId);
  }

  async function gerarSugestao() {
    setGerando(true);
    setSugestao(null);
    try {
      setSugestao(await sugestaoDoAluno(id));
    } catch (err) {
      avisar("erro", mensagemDeErro(err));
    } finally {
      setGerando(false);
    }
  }

  function abrirNovo(habId?: number) {
    setEditandoId(null);
    setHabilidadeId(habId ? String(habId) : "");
    setNivel("");
    setObservacao("");
    setErroForm("");
    setFormAberto(true);
  }

  function abrirEdicao(r: Registro) {
    setEditandoId(r.id);
    setHabilidadeId(String(r.habilidadeId));
    setNivel(r.nivel);
    setObservacao(r.observacao);
    setErroForm("");
    setFormAberto(true);
  }

  function fecharForm() {
    setFormAberto(false);
    setEditandoId(null);
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (!habilidadeId || !nivel) {
      setErroForm("Escolha a habilidade e o nível.");
      return;
    }
    setSalvando(true);
    try {
      if (editandoId !== null) {
        await editarRegistro(editandoId, {
          habilidadeId: Number(habilidadeId),
          nivel,
          observacao: observacao.trim(),
        });
        avisar("sucesso", "Registro atualizado!");
      } else {
        await adicionarRegistros([
          {
            alunoId: id,
            habilidadeId: Number(habilidadeId),
            nivel,
            observacao: observacao.trim(),
            data: hoje(),
          },
        ]);
        avisar("sucesso", "Registro salvo!");
      }
      setSugestao(null); // a sugestão anterior não vale mais
      fecharForm();
    } catch (err) {
      avisar("erro", mensagemDeErro(err));
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(r: Registro) {
    if (!window.confirm("Excluir este registro?")) return;
    try {
      await removerRegistro(r.id);
      setSugestao(null);
      avisar("sucesso", "Registro excluído.");
    } catch (err) {
      avisar("erro", mensagemDeErro(err));
    }
  }

  if (carregando || erroCarga) {
    return (
      <main className="mx-auto w-full max-w-4xl p-6">
        <EstadoCarga carregando={carregando} erro={erroCarga} onTentarNovamente={recarregarTudo} />
      </main>
    );
  }

  if (!aluno) {
    return (
      <main className="mx-auto w-full max-w-4xl p-6">
        <p className="text-gray-700">Aluno não encontrado.</p>
        <Button className="mt-4" variante="secundario" onClick={() => router.push("/turmas")}>
          Voltar para turmas
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl p-6">
      <Button variante="secundario" onClick={() => router.push(`/turma?id=${aluno.turmaId}`)}>
        ← Voltar
      </Button>

      <div className="mt-4">
        <h1 className="text-2xl font-bold">{aluno.nome}</h1>
        <p className="text-gray-600">{turma?.nome}</p>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Situação atual</h2>
        <Button onClick={() => abrirNovo()}>Novo registro</Button>
      </div>

      {formAberto && (
        <Card className="mt-3">
          <form onSubmit={salvar} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="hab" className="text-sm font-medium text-gray-700">
                Habilidade
              </label>
              <select
                id="hab"
                className={campo}
                value={habilidadeId}
                onChange={(e) => setHabilidadeId(e.target.value)}
              >
                <option value="">Selecione...</option>
                {habilidades.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.descricao} ({h.componente})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="niv" className="text-sm font-medium text-gray-700">
                Nível
              </label>
              <select
                id="niv"
                className={campo}
                value={nivel}
                onChange={(e) => setNivel(e.target.value as Nivel | "")}
              >
                <option value="">Selecione...</option>
                {niveis.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <Input
              id="obs"
              label="Observação (opcional)"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
            />
            {erroForm && <p className="text-sm text-red-600">{erroForm}</p>}
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

      {atuais.length === 0 && (
        <p className="mt-2 text-gray-600">Nenhuma habilidade registrada ainda.</p>
      )}
      <div className="mt-3 flex flex-col gap-3">
        {atuais.map((r) => (
          <Card key={r.habilidadeId}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">{nomeHabilidade(r.habilidadeId)?.descricao}</p>
              <div className="flex items-center gap-2">
                <Badge nivel={r.nivel} />
                <Button variante="secundario" onClick={() => abrirNovo(r.habilidadeId)}>
                  Atualizar
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <h2 className="mt-8 text-lg font-semibold">Histórico de registros</h2>
      {registros.length === 0 && (
        <p className="mt-2 text-gray-600">Nenhum registro para este aluno ainda.</p>
      )}
      <div className="mt-3 flex flex-col gap-3">
        {registros.map((r) => {
          const hab = nomeHabilidade(r.habilidadeId);
          return (
            <Card key={r.id}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">{hab?.descricao}</p>
                  <p className="text-sm text-gray-500">
                    {hab?.componente} · {formatarData(r.data)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge nivel={r.nivel} />
                  <Button variante="secundario" onClick={() => abrirEdicao(r)}>
                    Editar
                  </Button>
                  <Button variante="perigo" onClick={() => excluir(r)}>
                    Excluir
                  </Button>
                </div>
              </div>
              {r.observacao && <p className="mt-2 text-gray-700">{r.observacao}</p>}
            </Card>
          );
        })}
      </div>

      <h2 className="mt-8 text-lg font-semibold">Sugestão da IA</h2>
      <Card className="mt-3">
        {!sugestao && !gerando && (
          <p className="text-gray-600">
            Gere um resumo das dificuldades e uma sugestão de retomada com base nos registros.
          </p>
        )}
        {gerando && (
          <p className="text-gray-600">Gerando sugestão... pode levar alguns segundos.</p>
        )}
        {sugestao && (
          <div className="flex flex-col gap-3">
            <div>
              <p className="font-semibold">Resumo</p>
              <p className="text-gray-700">{sugestao.resumo}</p>
            </div>
            <div>
              <p className="font-semibold">Conteúdos para retomar</p>
              {sugestao.conteudosParaRetomar.length > 0 ? (
                <ul className="list-disc pl-5 text-gray-700">
                  {sugestao.conteudosParaRetomar.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700">Nenhum no momento.</p>
              )}
            </div>
            <div>
              <p className="font-semibold">Atividade sugerida</p>
              <p className="text-gray-700">{sugestao.atividade}</p>
            </div>
          </div>
        )}
        <div className="mt-4">
          <Button onClick={gerarSugestao} carregando={gerando} disabled={registros.length === 0}>
            Gerar sugestão
          </Button>
          {registros.length === 0 && (
            <p className="mt-2 text-sm text-gray-500">
              Registre ao menos uma habilidade para gerar a sugestão.
            </p>
          )}
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

export default function AlunoPage() {
  return (
    <Suspense fallback={<p className="p-6">Carregando...</p>}>
      <DetalheAluno />
    </Suspense>
  );
}