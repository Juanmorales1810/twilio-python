from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.routerBot import routerBotWhatsApp
from config import Config
import sys

# Cargar variables de entorno
load_dotenv()

# Validar configuración
if not Config.validate_config():
    print("❌ Error: Configuración inválida. Revisa el archivo .env")
    sys.exit(1)

app = FastAPI(
    title="Toyota San Juan Chatbot API",
    description="API del chatbot inteligente para Toyota San Juan",
    version="1.0.0"
)

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(routerBotWhatsApp)

@app.get("/")
async def root():
    return {
        "message": "Toyota San Juan Chatbot API",
        "version": "1.0.0",
        "status": "active"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "message": "API funcionando correctamente"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
