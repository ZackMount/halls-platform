FROM python:3.12-slim
LABEL org.opencontainers.image.version="1.2.2"
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY app.py remote.py ./
COPY web ./web
USER 10001:10001
EXPOSE 8000
HEALTHCHECK --interval=10s --timeout=3s --start-period=3s --retries=3 CMD ["python","-c","import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/health',timeout=2).close()"]
CMD ["gunicorn","--bind","0.0.0.0:8000","--workers","1","--threads","2","--timeout","125","app:create_app()"]
