## 环境要求

- `nodejs` `18.x.x`+
- `docker` `20.x.x`+ , `docker compose` `2.x.x`+
- `postgres`
- [`pnpm`](https://pnpm.io/zh/)

## 项目运行

**安装依赖**

```bash
cd $project/backend
pnpm i
cd $project/frontend
pnpm i
```

**快速运行**

```bash
docker-compose -p soybean-admin-nest up -d
```

**本地运行**

```bash
cd $project/backend
pnpm start:dev
cd $project/frontend
pnpm dev
```
