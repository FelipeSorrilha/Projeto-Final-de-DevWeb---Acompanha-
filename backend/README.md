### Backend

Requisitos: Python 3.x.

```bash
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1 # Windows (PowerShell)
pip install -r requirements.txt
```

Copie `.env.example` para `.env` e preencha `GEMINI_API_KEY`.

```bash
python -m uvicorn app.main:app --reload
```

Documentação em http://127.0.0.1:8000/docs