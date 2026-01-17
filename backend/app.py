from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import todos
from app.routes import auth
from app.routes import profile
from app.utils import ensure_tables_exist
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Ensure tables exist
logger.info("Ensuring database tables exist...")
ensure_tables_exist()

app = FastAPI(
    title="Todo API",
    description="API for managing todo items in the Todo application",
    version="1.0.0"
)

# Configure CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for Hugging Face Spaces deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    # Expose headers that the frontend might need
    expose_headers=["Access-Control-Allow-Origin", "Authorization"]
)

app.include_router(todos.router)
app.include_router(auth.router)
app.include_router(profile.router)

@app.get("/")
def read_root():
    return {"message": "Todo API is running"}

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "Todo API is running"}

# For Hugging Face Spaces compatibility
hf_app = app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 7860)))