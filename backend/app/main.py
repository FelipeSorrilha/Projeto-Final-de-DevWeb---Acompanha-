from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import alunos, habilidades, registros, turmas

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