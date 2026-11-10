from app.schemas.aluno import Aluno
from app.schemas.habilidade import Habilidade
from app.schemas.registro import Registro
from app.schemas.sugestao import HabilidadeTurma
from app.services.registros import registros_atuais


def analisar_turma(
    alunos: list[Aluno],
    registros: list[Registro],
    habilidades: list[Habilidade],
) -> tuple[list[HabilidadeTurma], dict[int, list[str]]]:
    """Devolve as estatísticas por habilidade e as observações (sem nomes)
    dos alunos que precisam retomar, por id de habilidade."""
    por_habilidade: dict[int, list[tuple[Aluno, Registro]]] = {}
    for aluno in alunos:
        meus = [r for r in registros if r.aluno_id == aluno.id]
        for r in registros_atuais(meus):
            por_habilidade.setdefault(r.habilidade_id, []).append((aluno, r))

    resultado: list[HabilidadeTurma] = []
    observacoes: dict[int, list[str]] = {}

    for hab in habilidades:
        itens = por_habilidade.get(hab.id)
        if not itens:
            continue
        retomar = [(a, r) for a, r in itens if r.nivel == "precisa retomar"]
        em_desenv = [1 for _, r in itens if r.nivel == "em desenvolvimento"]
        dominaram = [1 for _, r in itens if r.nivel == "dominado"]

        resultado.append(
            HabilidadeTurma(
                habilidade_id=hab.id,
                descricao=hab.descricao,
                componente=hab.componente,
                avaliados=len(itens),
                precisam_retomar=len(retomar),
                em_desenvolvimento=len(em_desenv),
                dominaram=len(dominaram),
                percentual_dificuldade=round(100 * len(retomar) / len(itens)),
                alunos_para_apoio=[a.nome for a, _ in retomar],
            )
        )
        observacoes[hab.id] = [r.observacao for _, r in retomar if r.observacao][:5]

    resultado.sort(key=lambda h: h.percentual_dificuldade, reverse=True)
    return resultado, observacoes


def montar_linhas(
    total_alunos: int,
    habilidades: list[HabilidadeTurma],
    observacoes: dict[int, list[str]],
) -> list[str]:
    """Texto que vai para a IA: só números e observações, sem nomes de alunos."""
    linhas = [f"Total de alunos na turma: {total_alunos}"]
    for h in habilidades:
        linhas.append(
            f"Habilidade: {h.descricao} ({h.componente}) | avaliados: {h.avaliados} | "
            f"precisam retomar: {h.precisam_retomar} ({h.percentual_dificuldade}%) | "
            f"em desenvolvimento: {h.em_desenvolvimento} | dominaram: {h.dominaram}"
        )
        for obs in observacoes.get(h.habilidade_id, []):
            linhas.append(f"   observação de quem precisa retomar: {obs}")
    return linhas