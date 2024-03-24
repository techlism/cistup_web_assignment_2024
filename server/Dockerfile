# Server Dockerfile
FROM python:3.8-slim
WORKDIR /app
COPY ./server/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY ./server /app
CMD ["flask", "run", "--host=0.0.0.0"]
