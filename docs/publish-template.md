# Publish The Template CLI

这个模板仓库现在可以同时承担两种角色：

1. Halo 插件模板源码仓库
2. npm 上的 `create-*` 脚手架包

如果你现在就是要做首发，直接看 [first-npm-release-checklist.md](./first-npm-release-checklist.md)。

## 推荐发布方式

### 方案一：npm `create-*` 包

适合对外分发和一键创建：

```bash
npm create halo-plugin-template@latest -- \
  --plugin-name todo \
  --base-package com.example.helloworld \
  --display-name "Todo" \
  --author-name "Your Name"
```

注意：

- 当前模板已经把 GitHub 仓库名和 npm 包名统一为 `create-halo-plugin-template`。
- 如果后续你还想再区分“源码仓库名”和“npm 包名”，优先考虑 scoped 包，而不是再拆回两套不一致命名。
- 如果你坚持让包名进一步品牌化，建议改成 scoped 包，例如 `@liuyiwuqing/create-halo-plugin-template`。

如果你改成 scoped 包名，例如 `@your-scope/create-halo-plugin-template`，对应命令建议写成：

```bash
npm init @your-scope/halo-plugin-template@latest -- \
  --plugin-name todo \
  --base-package com.example.helloworld \
  --display-name "Todo" \
  --author-name "Your Name"
```

### 方案二：GitHub Template Repository

适合团队内部维护“源码基线”，但不适合交互式参数初始化。通常建议保留，用来承载源码和 PR 审核；npm 包只负责分发最新模板。

## 第一次发布前

1. 检查根目录 `package.json` 的 `name`、`version`、`description`、`homepage`、`repository`、`bugs` 是否仍然指向当前仓库。
   当前模板已经按 `liuyiwuqing/create-halo-plugin-template` 预填。
2. 执行：

```bash
npm run publish:check
```

3. 确认打包内容只包含模板和 CLI 所需文件。
4. 登录 npm：

```bash
npm login
```

5. 在 npm 后台为包 `create-halo-plugin-template` 配置 Trusted Publisher，绑定：

- GitHub repository: `liuyiwuqing/create-halo-plugin-template`
- Workflow file: `.github/workflows/publish-npm.yaml`
- Environment: `npm`

## 发布命令

### 一键准备下个版本

```bash
npm run release:prepare -- --bump patch
```

这会自动完成版本号更新、发布前检查、提交和打 tag。

### 一键准备并推送发布

```bash
npm run release:prepare -- --bump patch --push
```

这会在本地完成检查后直接推送 `main` 和 `vX.Y.Z` tag。
当前仓库使用 tag push 触发 [publish-npm.yaml](../.github/workflows/publish-npm.yaml)，所以只要 npm Trusted Publishing 已经配置好，推送 tag 后就会自动发布。

### 手工发布

```bash
npm publish
```

### scoped 公共包手工发布

```bash
npm publish --access public
```

### 指定版本号准备发布

```bash
npm run release:prepare -- --version 1.0.0
```

或者直接推送：

```bash
npm run release:prepare -- --version 1.0.0 --push
```

## 持续发布建议

- GitHub 仓库继续作为模板源码主仓库。
- npm 包只跟模板版本，不跟具体业务插件版本混用。
- 每次模板有破坏性修改时，提升主版本号。
- 发布前至少执行：

```bash
node scripts/verify-template.mjs
cd ui && pnpm verify
cd .. && ./gradlew build
npm pack --dry-run
```

## CI 发布

如果你要做自动发布，优先用 npm Trusted Publishing，而不是长期有效的 npm token。

- 源码仓库推送 `v*` tag
- GitHub Actions 触发 [publish-npm.yaml](../.github/workflows/publish-npm.yaml) 工作流
- npm 侧配置 Trusted Publisher

Trusted Publisher 里要填写的工作流文件名必须和仓库里的一致，也就是 `publish-npm.yaml`。

另外，npm 官方目前要求 Trusted Publishing 使用 npm CLI `11.5.1+` 和 Node `22.14.0+`；工作流里已经显式升级到了这个版本线。

## 平台建议

- 对外开源分发：npm + GitHub Template Repository
- 团队内私有分发：GitHub Template Repository + GitHub Release tarball
- 需要固定版本初始化：npm 最方便，因为天然支持 `@latest` 或指定版本

## 当前仓库绑定

- GitHub owner: `liuyiwuqing`
- GitHub repository: `create-halo-plugin-template`
- npm package: `create-halo-plugin-template`
- Homepage: `https://github.com/liuyiwuqing/create-halo-plugin-template#readme`
- Issues: `https://github.com/liuyiwuqing/create-halo-plugin-template/issues`
