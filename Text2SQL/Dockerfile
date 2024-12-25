# Use an official Python runtime as a base image
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# Install required dependencies
RUN pip install websockets transformers torch tensorflow-cpu

# Copy the Python WebSocket server code into the container
COPY server.py /app/

# Expose the port the WebSocket server will listen on
EXPOSE 8765

# Command to run the WebSocket server
CMD ["python", "server.py"]
