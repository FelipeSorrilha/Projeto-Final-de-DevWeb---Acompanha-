from app.schemas.base import CamelModel


class SugestaoIA(CamelModel):
    resumo: str
    conteudos_para_retomar: list[str]
    atividade: str