# First npm Release Checklist

适用于仓库：`liuyiwuqing/create-halo-plugin-template`

## 5 步完成首发

1. 登录 npm 并确认账号有发布权限：

```bash
npm login
npm whoami
```

2. 在 npm 后台创建包 `create-halo-plugin-template` 的 Trusted Publisher，绑定：

- GitHub repository: `liuyiwuqing/create-halo-plugin-template`
- Workflow file: `.github/workflows/publish-npm.yaml`
- Environment: `npm`

3. 在本地主分支确认工作区干净：

```bash
git checkout main
git pull --ff-only
git status --short
```

4. 准备并推送首个发布版本：

```bash
npm run release:prepare -- --version 0.1.0 --push
```

如果首发版本号已经改过，按实际版本替换 `0.1.0`。

5. 到 GitHub Actions 查看 `Publish npm CLI` 工作流是否成功，并到 npm 验证包是否已发布：

```bash
npm view create-halo-plugin-template version
```

## 失败时先检查什么

- npm Trusted Publisher 是否绑到了正确仓库和工作流文件
- GitHub Actions environment 是否叫 `npm`
- 本地是否在 `main` 分支
- 工作区是否有未提交改动
- 本地 tag 是否已经存在

## 首发后创建项目

```bash
npm create halo-plugin-template@latest -- \
  --plugin-name todo \
  --base-package com.example.helloworld \
  --display-name "Todo" \
  --author-name "Your Name"
```
