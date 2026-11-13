import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app import store
from app.auth.tokens import ler_token
from app.schemas.auth import ProfessorBD

_esquema = HTTPBearer(auto_error=False)


def professor_atual(
    credenciais: HTTPAuthorizationCredentials | None = Depends(_esquema),
) -> ProfessorBD:
    nao_autenticado = HTTPException(
        status.HTTP_401_UNAUTHORIZED,
        "Não autenticado",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if credenciais is None:
        raise nao_autenticado
    try:
        professor_id = ler_token(credenciais.credentials)
    except (jwt.PyJWTError, KeyError, ValueError):
        raise nao_autenticado
    for professor in store.professores:
        if professor.id == professor_id:
            return professor
    raise nao_autenticado