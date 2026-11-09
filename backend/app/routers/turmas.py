from fastapi import APIRouter, HTTPException, status

from app import store
from app.schemas.turma import Turma, TurmaCriar

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