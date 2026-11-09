from pydantic import Field

from app.schemas.base import CamelModel


class AlunoCriar(CamelModel):
    nome: str = Field(min_length=1)
    turma_id: int


class AlunoAtualizar(CamelModel):
    nome: str = Field(min_length=1)


class Aluno(AlunoCriar):
    id: int