from app.schemas.base import CamelModel


class SugestaoIA(CamelModel):
    resumo: str
    conteudos_para_retomar: list[str]
    atividade: str

class HabilidadeTurma(CamelModel):
    habilidade_id: int
    descricao: str
    componente: str
    avaliados: int
    precisam_retomar: int
    em_desenvolvimento: int
    dominaram: int
    percentual_dificuldade: int
    alunos_para_apoio: list[str]


class SugestaoTurma(CamelModel):
    resumo: str
    atividade: str
    habilidades: list[HabilidadeTurma]