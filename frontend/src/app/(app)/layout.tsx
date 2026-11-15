"use client";

import { ReactNode } from "react";
import { useProtegido } from "../../hooks/useProtegido";
import { TurmasProvider } from "../../context/TurmasContext";
import { AlunosProvider } from "../../context/AlunosContext";
import { RegistrosProvider } from "../../context/RegistrosContext";
import { HabilidadesProvider } from "../../context/HabilidadesContext";

export default function AreaLogada({ children }: { children: ReactNode }) {
  const autorizado = useProtegido();

  // sem token: o hook já redirecionou para o login
  if (!autorizado) {
    return <p className="p-6 text-gray-600">Carregando...</p>;
  }

  return (
    <TurmasProvider>
      <AlunosProvider>
        <RegistrosProvider>
          <HabilidadesProvider>{children}</HabilidadesProvider>
        </RegistrosProvider>
      </AlunosProvider>
    </TurmasProvider>
  );
}