from app.schemas.registro import Registro


def registros_atuais(registros: list[Registro]) -> list[Registro]:
    """Mantém só o registro mais recente de cada habilidade."""
    mais_recentes: dict[int, Registro] = {}
    for r in registros:
        atual = mais_recentes.get(r.habilidade_id)
        if atual is None or (r.data, r.id) > (atual.data, atual.id):
            mais_recentes[r.habilidade_id] = r
    return list(mais_recentes.values())