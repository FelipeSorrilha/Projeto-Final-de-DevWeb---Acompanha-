from fastapi import APIRouter, HTTPException, status

from app import store
from app.schemas.turma import Turma, TurmaCriar

from app.routers.ia_erros import tratar_erros_ia
from app.schemas.sugestao import SugestaoTurma
from app.services import ia
from app.services.analise_turma import analisar_turma, montar_linhas

router = APIRouter(prefix="/turmas", tags=["Turmas"])


@router.get("", response_model=list[Turma])
def listar_turmas():
    return store.turmas


@router.get("/{turma_id}", response_model=Turma)
def buscar_turma(turma_id: int):
    for turma in store.turmas:
        if turma.id == turma_id:
            return turma
    raise HTTPException(status.HTTP_404_NOT_FOUND, "Turma não encontrada")


@router.post("", response_model=Turma, status_code=status.HTTP_201_CREATED)
def criar_turma(dados: TurmaCriar):
    turma = Turma(id=store.proximo_id(store.turmas), **dados.model_dump())
    store.turmas.append(turma)
    return turma

@router.post("/{turma_id}/sugestao", response_model=SugestaoTurma)
def gerar_sugestao_turma(turma_id: int):
    buscar_turma(turma_id)  # levanta 404 se a turma não existir

    alunos_turma = [a for a in store.alunos if a.turma_id == turma_id]
    if not alunos_turma:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Turma sem alunos")

    habilidades, observacoes = analisar_turma(
        alunos_turma, store.registros, store.habilidades
    )
    if not habilidades:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST, "Turma sem registros para analisar"
        )

    linhas = montar_linhas(len(alunos_turma), habilidades, observacoes)
    resumo, atividade = tratar_erros_ia(lambda: ia.gerar_texto_turma(linhas))

    return SugestaoTurma(resumo=resumo, atividade=atividade, habilidades=habilidades)