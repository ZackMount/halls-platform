# HALLS KOH 服务

KOH 容器连接赛事平台与 HALLS。玩家在容器页面上传 `.hproof`，服务先查询文件哈希，再将未重复的凭证提交 HALLS 评判。完成后玩家复制提交码，在赛事平台的文本框中提交；独立评测服务验证提交码并返回分数。

## 运行

```sh
docker build -t halls-koh .
cp runtime.env.example runtime.env
# 按实际平台地址配置 runtime.env
docker run --rm --env-file runtime.env -p 127.0.0.1:8000:8000 halls-koh
```

在 HALLS 后台创建 KOH 用途的 API Key，仅通过运行时环境注入。`runtime.env` 和 API Key 不应提交到仓库或写入镜像。

- 网页靶机：`HALLS_SUBMISSION_MODE=proof`、`HALLS_WEB_UPLOADS=1`。
- 独立评测：`HALLS_SUBMISSION_MODE=receipt`、`HALLS_WEB_UPLOADS=0`，赛事平台使用文本提交。
- `HALLS_API_BASE` 设置 HALLS 地址，`HALLS_PROBLEM_URL` 设置返回赛事题目的链接。

`/check` 返回百分制得分；赛事平台按其题目满分换算。可通过 `HALLS_CHECK_TIMEOUT` 配置评判等待时间，默认 110 秒。

测试：

```sh
python -m unittest discover -s . -p 'test_*.py'
```
