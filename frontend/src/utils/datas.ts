// Data de hoje no formato AAAA-MM-DD, no fuso local do navegador.
export function hoje(): string {
  return new Date().toLocaleDateString("en-CA");
}