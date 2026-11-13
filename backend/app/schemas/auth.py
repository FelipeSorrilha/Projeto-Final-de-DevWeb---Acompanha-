from pydantic import Field

from app.schemas.base import CamelModel


class LoginEntrada(CamelModel):
    email: str = Field(min_length=3)
    senha: str = Field(min_length=1)


class Token(CamelModel):
    access_token: str
    token_type: str = "bearer"


class Professor(CamelModel):
    id: int
    nome: str
    email: str


class ProfessorBD(Professor):
    senha_hash: str