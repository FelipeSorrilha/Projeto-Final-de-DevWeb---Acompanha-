from fastapi import APIRouter, Depends, HTTPException, status

from app import store
from app.auth.dependencias import professor_atual
from app.auth.senhas import verificar_senha
from app.auth.tokens import criar_token
from app.schemas.auth import LoginEntrada, Professor, ProfessorBD, Token

router = APIRouter(prefix="/auth", tags=["Autenticação"])


@router.post("/login", response_model=Token)
def login(dados: LoginEntrada):
    email = dados.email.strip().lower()
    professor = next((p for p in store.professores if p.email == email), None)
    if professor is None or not verificar_senha(dados.senha, professor.senha_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "E-mail ou senha incorretos")
    return Token(access_token=criar_token(professor.id))


@router.get("/eu", response_model=Professor)
def quem_sou_eu(professor: ProfessorBD = Depends(professor_atual)):
    return professor