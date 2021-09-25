# SocialRSS Server

## 使用方法

1. 需要准备一个清爽的 NPM 环境，请使用 NPM 官方源进行安装！
2. 环境依赖 Redis 缓存和 MySQL/MariaDB 数据库，需要一个较新的版本，不然会有些特性不受支持，出现报错！
3. 修改 `src/app.config.ts` 文件调整数据库连接信息
4. 执行 `pnpm install` 安装依赖，`pnpm start:dev` 运行开发模式


## Docker 部署


```bash
cd
mkdir -p srss/server
cd srss/server
wget https://cdn.jsdelivr.net/gh/Privoce/SocialRSS-server@master/docker-compose.yml
docker-compose up -d
```

## 作者

@Innei & @Dreamer-Paul
