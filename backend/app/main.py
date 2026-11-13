from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import alunos, habilidades, registros, turmas

from fastapi import Depends, FastAPI

from app.auth.dependencias import professor_atual
from app.routers import alunos, auth, habilidades, registros, turmas

app.include_router(auth.router)  # público: é onde se faz o login

protegido = [Depends(professor_atual)]
app.include_router(turmas.router, dependencies=protegido)
app.include_router(alunos.router, dependencies=protegido)
app.include_router(habilidades.router, dependencies=protegido)
app.include_router(registros.router, dependencies=protegido)

app = FastAPI(title="Acompanha+ API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.cors_origins.split(",")],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(turmas.router)
app.include_router(alunos.router)
app.include_router(habilidades.router)
app.include_router(registros.router)


@app.get("/")
def raiz():
    return {"mensagem": "API do Acompanha+", "docs": "/docs"}


@app.get("/saude")
def saude():
    return {"status": "ok", "ia_configurada": bool(settings.gemini_api_key)}