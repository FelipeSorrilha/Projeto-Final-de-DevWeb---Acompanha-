import { Habilidade } from "../types";
import Input from "./ui/input";

export const NOVA = "nova";

export interface EscolhaHabilidade {
  id: string; // id de uma habilidade existente, "nova" ou "" (nada escolhido)
  novaDescricao: string;
  novoComponente: string;
}

export const escolhaVazia: EscolhaHabilidade = { id: "", novaDescricao: "", novoComponente: "" };

export function validarEscolha(escolha: EscolhaHabilidade): string {
  if (!escolha.id) return "Escolha a habilidade.";
  if (escolha.id === NOVA && (!escolha.novaDescricao.trim() || !escolha.novoComponente.trim())) {
    return "Informe o título e o componente da nova habilidade.";
  }
  return "";
}

// Devolve o id da habilidade escolhida, criando-a antes se for nova.
export async function resolverHabilidadeId(
  escolha: EscolhaHabilidade,
  adicionar: (descricao: string, componente: string) => Promise<Habilidade>
): Promise<number> {
  if (escolha.id !== NOVA) return Number(escolha.id);
  const habilidade = await adicionar(escolha.novaDescricao.trim(), escolha.novoComponente.trim());
  return habilidade.id;
}

const campo =
  "rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500";

interface SeletorHabilidadeProps {
  habilidades: Habilidade[];
  escolha: EscolhaHabilidade;
  onChange: (escolha: EscolhaHabilidade) => void;
  idBase: string;
}

export default function SeletorHabilidade({
  habilidades,
  escolha,
  onChange,
  idBase,
}: SeletorHabilidadeProps) {
  const componentes = Array.from(new Set(habilidades.map((h) => h.componente)));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor={idBase} className="text-sm font-medium text-gray-700">
          Habilidade
        </label>
        <select
          id={idBase}
          className={campo}
          value={escolha.id}
          onChange={(e) => onChange({ ...escolha, id: e.target.value })}
        >
          <option value="">Selecione...</option>
          {habilidades.map((h) => (
            <option key={h.id} value={h.id}>
              {h.descricao} ({h.componente})
            </option>
          ))}
          <option value={NOVA}>+ Nova habilidade...</option>
        </select>
      </div>

      {escolha.id === NOVA && (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              id={`${idBase}-titulo`}
              label="Título da nova habilidade"
              placeholder="Ex.: História da Grécia Antiga"
              maxLength={120}
              value={escolha.novaDescricao}
              onChange={(e) => onChange({ ...escolha, novaDescricao: e.target.value })}
            />
            <Input
              id={`${idBase}-componente`}
              label="Componente"
              placeholder="Ex.: História"
              maxLength={60}
              list={`${idBase}-componentes`}
              value={escolha.novoComponente}
              onChange={(e) => onChange({ ...escolha, novoComponente: e.target.value })}
            />
          </div>
          <datalist id={`${idBase}-componentes`}>
            {componentes.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </>
      )}
    </div>
  );
}