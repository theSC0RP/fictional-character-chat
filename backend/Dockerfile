# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory inside container
WORKDIR /app

# Install OS-level dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libffi-dev \
    libssl-dev \
    curl \
    build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install pipenv globally
RUN pip install pipenv

# Copy only Pipfile and Pipfile.lock first (for better layer caching)
COPY Pipfile Pipfile.lock ./

# Install Python dependencies into system environment (not virtualenv)
RUN pipenv install --deploy --system --ignore-pipfile

# Copy the app code (this will get overridden by bind mount in dev)
COPY app/ app/

# Expose FastAPI port
EXPOSE 8000

# Run with hot reload (only works if bind mount allows code changes)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]