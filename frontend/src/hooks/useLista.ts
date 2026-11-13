"use client";

import { useCallback, useEffect, useState } from "react";
import { mensagemDeErro } from "../services/api";

// Busca uma lista na API e controla carregamento e erro.
export function useLista<T>(buscar: () => Promise<T[]>) {
  const [itens, setItens] = useState<T[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const recarregar = useCallback(async () => {
    setErro("");
    try {
      setItens(await buscar());
    } catch (e) {
      setErro(mensagemDeErro(e));
    } finally {
      setCarregando(false);
    }
  }, [buscar]);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  return { itens, setItens, carregando, erro, recarregar };
}