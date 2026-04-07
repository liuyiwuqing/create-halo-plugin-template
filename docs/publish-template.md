# Publish The Template CLI

这个模板仓库现在可以同时承担两种角色：

1. Halo 插件模板源码仓库
2. npm 上的 `create-*` 脚手架包

## 推荐发布方式

### 方案一：npm `create-*` 包

适合对外分发和一键创建：

```bash
npm create halo-plugin-template@latest -- \
  --plugin-name hello-world \
  --base-package com.example.helloworld \
  --display-name "Hello World" \
  --author-name "Your Name"
```

注意：

- `create-halo-plugin` 这个 npm 包名已经被占用，不能再直接改成和 GitHub 仓库同名的 unscoped 包。
- 当前模板保持使用 `create-halo-plugin-template` 作为 unscoped 包名是合理的。
- 如果你坚持让包名和仓库更接近，建议改成 scoped 包，例如 `@liuyiwuqing/create-halo-plugin`。

如果你改成 scoped 包名，例如 `@your-scope/create-halo-plugin-template`，对应命令建议写成：

```bash
npm init @your-scope/halo-plugin-template@latest -- \
  --plugin-name hello-world \
  --base-package com.example.helloworld \
  --display-name "Hello World" \
  --author-name "Your Name"
```

### 方案二：GitHub Template Repository

适合团队内部维护“源码基线”，但不适合交互式参数初始化。通常建议保留，用来承载源码和 PR 审核；npm 包只负责分发最新模板。

## 第一次发布前

1. 检查根目录 `package.json` 的 `name`、`version`、`description`、`homepage`、`repository`、`bugs` 是否仍然指向当前仓库。
   当前模板已经按 `liuyiwuqing/create-halo-plugin` 预填。
2. 执行：

```bash
npm run publish:check
```

3. 确认打包内容只包含模板和 CLI 所需文件。
4. 登录 npm：

```bash
npm login
```

## 发布命令

### 非 scoped 包

```bash
npm publish
```

### scoped 公共包

```bash
npm publish --access public
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

- 源码仓库打 tag 或发 GitHub Release
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
- GitHub repository: `create-halo-plugin`
- npm package: `create-halo-plugin-template`
- Homepage: `https://github.com/liuyiwuqing/create-halo-plugin#readme`
- Issues: `https://github.com/liuyiwuqing/create-halo-plugin/issues`
