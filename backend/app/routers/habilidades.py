from fastapi import APIRouter, HTTPException, status

from app import store
from app.schemas.habilidade import Habilidade, HabilidadeCriar

router = APIRouter(prefix="/habilidades", tags=["Habilidades"])


@router.get("", response_model=list[Habilidade])
def listar_habilidades():
    return store.habilidades


@router.post("", response_model=Habilidade, status_code=status.HTTP_201_CREATED)
def criar_habilidade(dados: HabilidadeCriar):
    for existente in store.habilidades:
        if (
            existente.descricao.casefold() == dados.descricao.casefold()
            and existente.componente.casefold() == dados.componente.casefold()
        ):
            raise HTTPException(status.HTTP_409_CONFLICT, "Essa habilidade já existe")
    habilidade = Habilidade(
        id=store.proximo_id(store.habilidades), **dados.model_dump()
    )
    store.habilidades.append(habilidade)
    return habilidade