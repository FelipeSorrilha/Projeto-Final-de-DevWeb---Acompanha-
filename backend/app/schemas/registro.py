from typing import Literal

from pydantic import Field

from app.schemas.base import CamelModel

Nivel = Literal["dominado", "em desenvolvimento", "precisa retomar"]
DATA_REGEX = r"^\d{4}-\d{2}-\d{2}$"


class RegistroCriar(CamelModel):
    aluno_id: int
    habilidade_id: int
    nivel: Nivel
    observacao: str = ""
    data: str = Field(pattern=DATA_REGEX)


class RegistroAtualizar(CamelModel):
    habilidade_id: int | None = None
    nivel: Nivel | None = None
    observacao: str | None = None


class Registro(RegistroCriar):
    id: int