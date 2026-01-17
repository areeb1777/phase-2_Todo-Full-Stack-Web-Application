FROM python:3.12-slim

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose the port (Hugging Face typically uses PORT environment variable)
EXPOSE 7860

# Run the application using the app.main file structure
CMD ["python", "run.py"]