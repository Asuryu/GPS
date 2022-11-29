FROM python:alpine
COPY src/ /app
WORKDIR /app
RUN pip install -r requirements.txt
CMD ["python", "app.py"]