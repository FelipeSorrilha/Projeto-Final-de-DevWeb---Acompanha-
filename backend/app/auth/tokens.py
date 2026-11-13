from datetime import datetime, timedelta, timezone

import jwt

from app.config import settings

ALGORITMO = "HS256"


def criar_token(professor_id: int) -> str:
    expira = datetime.now(timezone.utc) + timedelta(minutes=settings.jwt_expira_minutos)
    carga = {"sub": str(professor_id), "exp": expira}
    return jwt.encode(carga, settings.jwt_secret, algorithm=ALGORITMO)


def ler_token(token: str) -> int:
    """Devolve o id do professor ou levanta jwt.PyJWTError se o token for inválido ou expirado."""
    carga = jwt.decode(token, settings.jwt_secret, algorithms=[ALGORITMO])
    return int(carga["sub"])