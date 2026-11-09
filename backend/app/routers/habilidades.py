from fastapi import APIRouter

from app import store
from app.schemas.habilidade import Habilidade

router = APIRouter(prefix="/habilidades", tags=["Habilidades"])


@router.get("", response_model=list[Habilidade])
def listar_habilidades():
    return store.habilidades