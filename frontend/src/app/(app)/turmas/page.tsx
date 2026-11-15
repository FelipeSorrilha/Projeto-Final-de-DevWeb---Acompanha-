"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTurmas } from "../../../context/TurmasContext";
import { useAlunos } from "../../../context/AlunosContext";
import { sair } from "../../../services/auth";
import { mensagemDeErro } from "../../../services/api";
import Button from "../../../components/ui/button";
import Input from "../../../components/ui/input";
import Card from "../../../components/ui/caixinha";
import Alerta, { TipoAlerta } from "../../../components/ui/alerta";

export default function Turmas() {
  const router = useRouter();
  const { turmas, carregando, erro, recarregar, adicionarTurma } = useTurmas();
  const { alunos } = useAlunos();

  const [formAberto, setFormAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [serie, setSerie] = useState("");
  const [erroNome, setErroNome] = useState("");
  const [erroSerie, setErroSerie] = useState("");
  const [salvando, setSalvando] = useState(false);

  const [alertaVisivel, setAlertaVisivel] = useState(false);
  const [alertaTipo, setAlertaTipo] = useState<TipoAlerta>("sucesso");
  const [alertaMensagem, setAlertaMensagem] = useState("");

  function avisar(tipo: TipoAlerta, mensagem: string) {
    setAlertaTipo(tipo);
    setAlertaMensagem(mensagem);
    setAlertaVisivel(true);
  }

  function fecharForm() {
    setFormAberto(false);
    setNome("");
    setSerie("");
    setErroNome("");
    setErroSerie("");
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setErroNome(nome.trim() ? "" : "Informe o nome da turma");
    setErroSerie(serie.trim() ? "" : "Informe a série");
    if (!nome.trim() || !serie.trim()) return;

    setSalvando(true);
    try {
      await adicionarTurma(nome.trim(), serie.trim());
      fecharForm();
      avisar("sucesso", "Turma criada com sucesso!");
    } catch (e) {
      avisar("erro", mensagemDeErro(e));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-4xl p-6">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold">Minhas turmas</h1>
        <div className="flex gap-2">
          <Button
            variante="secundario"
            onClick={() => {
              sair();
              router.push("/");
            }}
          >
            Sair
          </Button>
          <Button onClick={() => setFormAberto(true)}>Nova turma</Button>
        </div>
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
              <Button type="submit" carregando={salvando}>
                Salvar turma
              </Button>
              <Button type="button" variante="secundario" onClick={fecharForm}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      {carregando && (
        <p className="mt-6 text-gray-600">
          Carregando turmas... a primeira vez pode levar até 1 minuto.
        </p>
      )}

      {!carregando && erro && (
        <Card className="mt-6">
          <p className="text-red-700">{erro}</p>
          <Button className="mt-3" variante="secundario" onClick={recarregar}>
            Tentar novamente
          </Button>
        </Card>
      )}

      {!carregando && !erro && turmas.length === 0 && (
        <p className="mt-6 text-gray-600">Nenhuma turma ainda. Crie a primeira.</p>
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
        tipo={alertaTipo}
        mensagem={alertaMensagem}
        visivel={alertaVisivel}
        onFechar={() => setAlertaVisivel(false)}
      />
    </main>
  );
}