from typing import Callable, TypeVar

from fastapi import HTTPException, status

from app.services import ia

Resultado = TypeVar("Resultado")


def tratar_erros_ia(chamada: Callable[[], Resultado]) -> Resultado:
    """Executa a chamada de IA e traduz as falhas em códigos HTTP."""
    try:
        return chamada()
    except ia.IAIndisponivel:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "IA não configurada")
    except ia.IASobrecarregada:
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE,
            "A IA está com alta demanda, tente novamente em instantes",
        )
    except ia.IALimiteExcedido:
        raise HTTPException(
            status.HTTP_429_TOO_MANY_REQUESTS,
            "Limite de uso da IA atingido, tente novamente em alguns minutos",
        )
    except ia.IAFalhou as erro:
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, str(erro))