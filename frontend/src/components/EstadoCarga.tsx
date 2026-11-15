import Button from "./ui/button";
import Card from "./ui/caixinha";

interface EstadoCargaProps {
  carregando: boolean;
  erro: string;
  onTentarNovamente: () => void;
}

export default function EstadoCarga({ carregando, erro, onTentarNovamente }: EstadoCargaProps) {
  if (carregando) {
    return (
      <p className="text-gray-600">
        Carregando... a primeira vez pode levar até 1 minuto.
      </p>
    );
  }
  return (
    <Card>
      <p className="text-red-700">{erro}</p>
      <Button className="mt-3" variante="secundario" onClick={onTentarNovamente}>
        Tentar novamente
      </Button>
    </Card>
  );
}