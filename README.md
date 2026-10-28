# HALLS 平台

HALLS 平台接收游戏凭证，使用独立 Judge 复算游戏过程，提供成绩榜、评判报告和回放。平台由 Flask、SQLite 和独立 worker 组成；网页资源自托管。

## 本地运行

需要 Docker 和 Docker Compose。准备客户端对应的凭证解密私钥与信任配置，将它们放在仓库外，或放入已忽略的 `secrets/` 目录：

```sh
mkdir -p data downloads secrets
cp /path/to/recipient.pem secrets/recipient.pem
cp /path/to/trust.json secrets/trust.json
docker compose up -d --build
```

在 Linux 上，确保 `data/` 可由容器用户（UID 10001）写入，两个密钥配置文件可由该用户读取。客户端项目的 `tools/proof/keygen.py` 生成解密私钥 `viewer/keys/recipient.pem` 和信任配置 `viewer/trust.json`；后者包含 `key_id` 和 `signing_public` 字段。信任配置必须与客户端的签名及加密密钥匹配，重新生成密钥后需要重新构建客户端。凭证文件、密钥和数据库均不应提交到仓库或放入镜像。

- 网站：<http://127.0.0.1:8770/>
- 管理后台：<http://127.0.0.1:8771/admin>

后台无需账号或密码，默认只监听本机地址。远程管理可通过 SSH 端口转发访问；公开网站不提供后台路由。Docker 宿主机上的其他容器可能访问此端口，应作为本机可信环境管理。

客户端下载文件及清单位于 `downloads/`。在后台配置下载、上传和成绩发布策略。对公网提供服务时，配置 `HALLS_HOSTS`、`HALLS_ORIGIN`，并在可信反向代理上启用 HTTPS；`deploy/nginx.conf` 提供参考配置。

## 源码运行

需要 Python 3.12、Rust、C++17 编译器和 Node.js。创建虚拟环境并构建 Judge 与网页资源：

```sh
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
npm ci
npm run build:web
python build_model.py
python tools/build_race_exact.py
python tools/build_api_guide.py
```

设置 `HALLS_KEY` 为解密私钥文件路径，`HALLS_TRUST` 为客户端信任配置文件路径，再分别启动网站、后台和 worker：

```sh
gunicorn --bind 127.0.0.1:8770 app:app
gunicorn --bind 127.0.0.1:8771 --workers 1 admin_wsgi:app
python worker.py
```

三个进程需要使用相同的 `HALLS_DATA` 数据目录。后台的地址和允许访问的网络可通过 `HALLS_ADMIN_HOSTS`、`HALLS_ADMIN_NETWORKS` 配置；默认仅接受本机连接。

## 项目结构

- `app.py`、`admin_wsgi.py`、`worker.py`：网站、管理后台和评判任务。
- `engine/`：凭证解析、复算和评分。
- `native*/`：各凭证版本对应的原生游戏逻辑。
- `web/`、`templates/`：页面和回放。
- `koh/`：赛事平台评分转发服务。
- `tests/`：协议、评判和界面测试。

运行测试：

```sh
PYTHONPATH=engine:tests:. python -m unittest discover -s tests -p 'test_*.py'
npm run check:web
```

赛事平台接入参见 [KOH 服务说明](koh/README.md)。第三方组件的许可信息见 [THIRD_PARTY.md](THIRD_PARTY.md) 和对应资源目录。
