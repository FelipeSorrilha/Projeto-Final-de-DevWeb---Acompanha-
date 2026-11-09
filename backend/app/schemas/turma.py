from pydantic import Field

from app.schemas.base import CamelModel


class TurmaCriar(CamelModel):
    nome: str = Field(min_length=1)
    serie: str = Field(min_length=1)


class Turma(TurmaCriar):
    id: int