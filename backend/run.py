import uvicorn
import os
from app.utils import ensure_tables_exist

if __name__ == "__main__":
    # Run startup tasks
    print("Ensuring database tables exist...")
    ensure_tables_exist()
    print("Database tables verified.")

    # Get port from environment or use default
    port = int(os.environ.get("PORT", 7860))

    # Run the server
    uvicorn.run(
        "app.main:app",  # Reference the app instance in app/main.py
        host="0.0.0.0",
        port=port,
        reload=False,  # Disable reload for Hugging Face Spaces
        server_header=False,  # Hide server identity
        forwarded_allow_ips="*"  # Allow all forwarded IPs
    )