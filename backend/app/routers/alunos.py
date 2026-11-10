from fastapi import APIRouter, HTTPException, Query, status

from app import store
from app.schemas.aluno import Aluno, AlunoAtualizar, AlunoCriar

from app.schemas.sugestao import SugestaoIA
from app.services import ia
from app.services.registros import registros_atuais

from app.routers.ia_erros import tratar_erros_ia

router = APIRouter(prefix="/alunos", tags=["Alunos"])


def _achar_aluno(aluno_id: int) -> Aluno:
    for aluno in store.alunos:
        if aluno.id == aluno_id:
            return aluno
    raise HTTPException(status.HTTP_404_NOT_FOUND, "Aluno não encontrado")


@router.get("", response_model=list[Aluno])
def listar_alunos(turma_id: int | None = Query(default=None, alias="turmaId")):
    if turma_id is None:
        return store.alunos
    return [a for a in store.alunos if a.turma_id == turma_id]


@router.get("/{aluno_id}", response_model=Aluno)
def buscar_aluno(aluno_id: int):
    return _achar_aluno(aluno_id)


@router.post("", response_model=Aluno, status_code=status.HTTP_201_CREATED)
def criar_aluno(dados: AlunoCriar):
    if not any(t.id == dados.turma_id for t in store.turmas):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Turma não encontrada")
    aluno = Aluno(id=store.proximo_id(store.alunos), **dados.model_dump())
    store.alunos.append(aluno)
    return aluno


@router.put("/{aluno_id}", response_model=Aluno)
def editar_aluno(aluno_id: int, dados: AlunoAtualizar):
    aluno = _achar_aluno(aluno_id)
    aluno.nome = dados.nome
    return aluno


@router.delete("/{aluno_id}", status_code=status.HTTP_204_NO_CONTENT)
def remover_aluno(aluno_id: int):
    aluno = _achar_aluno(aluno_id)
    store.alunos.remove(aluno)
    # remove também os registros do aluno
    store.registros[:] = [r for r in store.registros if r.aluno_id != aluno_id]


@router.post("/{aluno_id}/sugestao", response_model=SugestaoIA)
def gerar_sugestao_ia(aluno_id: int):
    _achar_aluno(aluno_id)
    registros = sorted(
        (r for r in store.registros if r.aluno_id == aluno_id),
        key=lambda r: (r.data, r.id),
    )
    if not registros:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST, "Aluno sem registros para analisar"
        )

    habilidades = {h.id: h for h in store.habilidades}
    atuais = {r.id for r in registros_atuais(registros)}

    linhas = []
    for r in registros:
        hab = habilidades[r.habilidade_id]
        marca = " [NÍVEL ATUAL]" if r.id in atuais else ""
        linhas.append(
            f"{r.data} | {hab.descricao} ({hab.componente}) | "
            f"{r.nivel}{marca} | {r.observacao or 'sem observação'}"
        )

    try:
        return tratar_erros_ia(lambda: ia.gerar_sugestao(linhas))
    except ia.IAIndisponivel:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "IA não configurada")
    except ia.IASobrecarregada:
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE,
            "A IA está com alta demanda, tente novamente em instantes",
        )
    except ia.IALimiteExcedido:
        raise HTTPException(
            status.HTTP_429_TOO_MANY_REQUESTS,
            "Limite de uso da IA atingido, tente novamente em alguns minutos",
        )
    except ia.IAFalhou as erro:
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, str(erro))