from fastapi import APIRouter, HTTPException, Query, status

from app import store
from app.schemas.registro import Registro, RegistroAtualizar, RegistroCriar

router = APIRouter(prefix="/registros", tags=["Registros"])


def _validar_referencias(aluno_id: int, habilidade_id: int) -> None:
    if not any(a.id == aluno_id for a in store.alunos):
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Aluno {aluno_id} não encontrado")
    if not any(h.id == habilidade_id for h in store.habilidades):
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, f"Habilidade {habilidade_id} não encontrada"
        )


def _achar_registro(registro_id: int) -> Registro:
    for registro in store.registros:
        if registro.id == registro_id:
            return registro
    raise HTTPException(status.HTTP_404_NOT_FOUND, "Registro não encontrado")


@router.get("", response_model=list[Registro])
def listar_registros(aluno_id: int | None = Query(default=None, alias="alunoId")):
    if aluno_id is None:
        return store.registros
    return [r for r in store.registros if r.aluno_id == aluno_id]


@router.post("", response_model=list[Registro], status_code=status.HTTP_201_CREATED)
def criar_registros(lista: list[RegistroCriar]):
    """Cria um ou vários registros (o registro em massa da turma usa a lista)."""
    for item in lista:
        _validar_referencias(item.aluno_id, item.habilidade_id)
    criados = []
    for item in lista:
        registro = Registro(id=store.proximo_id(store.registros), **item.model_dump())
        store.registros.append(registro)
        criados.append(registro)
    return criados


@router.put("/{registro_id}", response_model=Registro)
def editar_registro(registro_id: int, dados: RegistroAtualizar):
    registro = _achar_registro(registro_id)
    mudancas = dados.model_dump(exclude_unset=True)
    if "habilidade_id" in mudancas:
        _validar_referencias(registro.aluno_id, mudancas["habilidade_id"])
    for campo, valor in mudancas.items():
        setattr(registro, campo, valor)
    return registro


@router.delete("/{registro_id}", status_code=status.HTTP_204_NO_CONTENT)
def remover_registro(registro_id: int):
    store.registros.remove(_achar_registro(registro_id))