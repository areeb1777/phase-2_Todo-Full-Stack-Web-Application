"""
Hugging Face Space Interface for the Todo API
This file serves as the entry point for Hugging Face Spaces deployment
"""

from app import app as application

# For Hugging Face Spaces, we export the FastAPI app instance
# The space will handle the server configuration
app = application

# If running as a script (for local development), start the server
if __name__ == "__main__":
    import uvicorn
    import os

    port = int(os.environ.get("PORT", 7860))
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=port,
        reload=False,
        server_header=False,
        forwarded_allow_ips="*"
    )