import uvicorn
from app.utils import ensure_tables_exist

if __name__ == "__main__":
    # Run startup tasks
    print("Ensuring database tables exist...")
    ensure_tables_exist()

    # Run the server
    uvicorn.run("app.main:app", host="0.0.0.0", port=7860, reload=True)