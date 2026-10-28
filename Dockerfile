FROM rust:1.90-bookworm AS model
RUN apt-get update && apt-get install -y --no-install-recommends python3 && rm -rf /var/lib/apt/lists/*
WORKDIR /src
COPY native ./native
COPY native-v11 ./native-v11
COPY native-v113 ./native-v113
COPY native-current ./native-current
COPY build_model.py ./
RUN python3 build_model.py
COPY engine/race_exact.cpp ./engine/race_exact.cpp
COPY tools/build_race_exact.py ./tools/build_race_exact.py
RUN python3 tools/build_race_exact.py
FROM python:3.12-slim-bookworm
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 HALLS_DATA=/data
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt && useradd -u 10001 -m halls && mkdir /data && chown halls:halls /data
COPY engine ./engine
COPY --from=model /src/engine/model ./engine/model
COPY web ./web
COPY templates ./templates
COPY private-docs ./private-docs
COPY *.py ./
COPY tools ./tools
RUN python tools/build_api_guide.py
USER halls
EXPOSE 8000
CMD ["gunicorn","--bind","0.0.0.0:8000","--workers","2","--threads","4","--timeout","35","--max-requests","1000","--max-requests-jitter","100","--access-logfile","-","--access-logformat","%(h)s %(m)s %(s)s %(B)s %(L)s","app:app"]
