from pydantic import Field, field_validator

from app.schemas.base import CamelModel


class HabilidadeCriar(CamelModel):
    descricao: str = Field(min_length=1, max_length=120)
    componente: str = Field(min_length=1, max_length=60)

    @field_validator("descricao", "componente")
    @classmethod
    def sem_espacos_sobrando(cls, valor: str) -> str:
        valor = valor.strip()
        if not valor:
            raise ValueError("Não pode ficar em branco")
        return valor


class Habilidade(HabilidadeCriar):
    id: int