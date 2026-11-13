"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { lerToken } from "../services/api";

// Manda para o login quem não tem token. É só experiência de uso:
// quem protege os dados de verdade é a API.
export function useProtegido(): boolean {
  const router = useRouter();
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    if (lerToken()) setPronto(true);
    else router.replace("/");
  }, [router]);

  return pronto;
}