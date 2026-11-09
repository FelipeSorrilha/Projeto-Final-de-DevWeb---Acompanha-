from app.schemas.base import CamelModel


class Habilidade(CamelModel):
    id: int
    descricao: str
    componente: str