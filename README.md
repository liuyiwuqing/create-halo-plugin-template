# Halo Plugin Template

通用的 Halo 插件开发模板，基于官方 `pnpm create halo-plugin` 的 Vite 预设收敛而成。

这个模板默认提供：

- Java 21 + Halo Plugin DevTools 0.6.2 基线
- Gradle `com.github.node-gradle.node` 插件自动下载并管理 Node 运行时，`./gradlew build` / `haloServer` 不依赖系统 PATH
- `@halo-dev/ui-shared` + `@halo-dev/components` + Element Plus 的 UI 组合
- Console / UC 路由骨架
- 仪表盘小部件（指标卡 + 功能网格）、快速操作项、附件选择器扩展点示例
- Console / UC 概览页、通用表格、UI 基础组件（UiMetricCard / UiSectionCard / UiStatusPill）
- `settings.yaml`、Console/UC 角色模板、OpenAPI 客户端生成配置
- 已接线的 `ui/src/api/generated` + `ui/src/api/index.ts` API 包装层
- `verifyTemplateConsistency` 自动集成到 `./gradlew check`，构建即验收一致性
- 一次性初始化脚本，用于批量改插件名、包名、权限前缀和仓库信息

## 环境要求

- Java 21+
- Node.js 22+（仅 `init-template.mjs` / `create-project.mjs` 等脚本需要；`./gradlew build` 由 node-gradle 插件自动管理，无需系统 Node）
- pnpm 10+
- Docker（推荐，用于 `haloServer`）

## 快速开始

推荐直接用一键脚本从当前模板创建新项目目录：

```bash
node scripts/create-project.mjs \
  --plugin-name todo \
  --base-package com.example.helloworld \
  --display-name "Todo" \
  --author-name "Your Name" \
  --route-prefix /plugin-todo \
  --permission-prefix plugin:plugin-todo \
  --target-dir ../plugin-todo \
  --install \
  --build
```

这个脚本会自动完成：

- 复制模板到目标目录
- 执行 `init-template.mjs`
- 执行 `verify-template.mjs`
- 可选安装前端依赖
- 可选执行 `./gradlew build`

如果你已经手工复制好了目录，再使用下面的初始化方式也可以。

如果你后续把这个模板发布成 npm 的 `create-*` 包，还可以直接远程一键创建：

```bash
npm create halo-plugin-template@latest -- \
  --plugin-name todo \
  --base-package com.example.helloworld \
  --display-name "Todo" \
  --author-name "Your Name"
```

发布说明见 [docs/publish-template.md](./docs/publish-template.md)。
首发操作清单见 [docs/first-npm-release-checklist.md](./docs/first-npm-release-checklist.md)。

当前 GitHub 仓库名和 unscoped npm 包名统一为 `create-halo-plugin-template`，便于后续维护和分发。

如果你要在发布前做一次完整自检，直接执行：

```bash
npm run publish:check
```

如果你要准备一个新版本发布，可以直接执行：

```bash
npm run release:prepare -- --bump patch
```

如果你已经在 npm 侧配置好了 Trusted Publishing，并且希望本地完成检查、提交、打 tag、推送一条龙：

```bash
npm run release:prepare -- --bump patch --push
```

这条命令会自动：

- 校验当前分支必须是 `main`
- 校验工作区必须是干净状态
- 更新根目录 `package.json` 的版本号
- 执行 `npm run publish:check`
- 创建 `chore: release vX.Y.Z` 提交
- 创建 `vX.Y.Z` tag
- 可选推送 `main` 和 tag

仓库当前使用 `push tag -> publish-npm.yaml` 的方式触发 npm 发布。

先运行初始化脚本，把模板占位符替换成你的插件信息：

```bash
node scripts/init-template.mjs \
  --plugin-name todo \
  --base-package com.example.helloworld \
  --display-name "Todo" \
  --author-name "Your Name" \
  --route-prefix /plugin-todo \
  --permission-prefix plugin:plugin-todo \
  --author-website "https://github.com/your-name" \
  --repo-owner your-name \
  --description "Todo - Halo 插件"
```

这个脚本是一次性的。执行后会连同自身模板常量一起改写，确保生成出来的项目里不再残留模板占位符。

初始化完成后，马上执行一次模板一致性检查：

```bash
node scripts/verify-template.mjs \
  --plugin-name todo \
  --base-package com.example.helloworld \
  --display-name "Todo" \
  --author-name "Your Name" \
  --route-prefix /plugin-todo \
  --permission-prefix plugin:plugin-todo
```

然后安装前端依赖并启动开发环境：

```bash
pnpm install --dir ui
./gradlew haloServer
```

如果只调试前端构建：

```bash
cd ui
pnpm dev
```

## 常用命令

```bash
# 构建插件（自动包含 verifyTemplateConsistency 前置检查）
./gradlew build

# 后端单测
./gradlew test

# 模板一致性检查（也可单独执行，不触发编译）
node scripts/verify-template.mjs

# 启动开发服务器（Docker，自动构建 UI 并挂载）
./gradlew haloServer

# 前端检查
cd ui
pnpm verify

# 生成 OpenAPI 文档和 TS 客户端
cd ..
./gradlew generateApiClient

# 基于 OpenAPI 生成角色模板草稿
./gradlew generateRoleTemplates
```

## 目录说明

```
├── build.gradle                    # 根 Gradle 构建（含 node-gradle 插件、Halo 插件平台配置）
├── settings.gradle                 # 包含 ui 子项目
├── package.json                    # npm 包配置（create-halo-plugin-template）
├── scripts/                        # 初始化、校验、发布脚本
│   ├── create-project.mjs          # 一键创建新插件项目
│   ├── init-template.mjs           # 批量替换模板占位符
│   ├── verify-template.mjs         # 模板一致性校验
│   ├── release.mjs                 # 版本发布流程
│   └── publish-check.mjs           # 发布前检查
├── src/main/java/                  # 后端骨架
│   └── run/halo/plugintemplate/
│       ├── PluginTemplatePlugin.java        # 插件主入口
│       ├── endpoint/                        # Console / UC / Public API 端点
│       ├── service/                         # 业务逻辑层
│       ├── reconcile/                       # Settings Reconciler
│       ├── scheme/                          # 数据模型定义
│       ├── dto/                             # 数据传输对象
│       ├── query/                           # 查询参数
│       ├── config/                          # Spring 配置
│       ├── setting/                         # 设置常量与 Handler
│       └── utils/                           # 工具类
├── src/main/resources/
│   ├── plugin.yaml                           # 插件清单
│   └── extensions/                           # settings.yaml、角色模板
├── ui/                             # 前端子项目（Vite + Vue 3 + TypeScript）
│   └── src/
│       ├── index.ts                          # 插件 UI 唯一注册入口
│       ├── views/console/                    # Console 仪表盘页面
│       ├── views/uc/                         # UC 仪表盘页面
│       ├── components/                       # 业务组件（概览页、小部件、表格、附件扩展）
│       ├── components/ui/                    # 低层通用 UI 包装
│       ├── composables/                      # 组合式函数（useTemplateOverview）
│       ├── lib/                              # 工具库（template、theme、plugin-ui）
│       ├── api/index.ts                      # 前端唯一 API 包装出口
│       └── api/generated/                    # 由 generateApiClient 生成的客户端代码
└── docs/                           # 文档
    ├── publish-template.md         # npm 发布说明
    ├── first-npm-release-checklist.md  # 首发操作清单
    ├── rsbuild-switch.md           # Vite → Rsbuild 切换指南
    └── template-pruning.md         # 初始化后裁剪指南
```

## 构建与验证

`./gradlew build` 会自动执行以下流程：

1. `nodeSetup` — 由 node-gradle 插件下载并配置 Node 22 运行时
2. `ui:pnpmBuild` — 构建前端
3. `compileJava` — 编译后端
4. `verifyTemplateConsistency` — 运行 `verify-template.mjs`，检查 35+ 项模板内部一致性
5. `check` / `test` — 执行后端单测

如果你的系统已经安装了 Node 22+，node-gradle 插件会优先使用系统 Node；否则自动下载。
`init-template.mjs` 和 `create-project.mjs` 是纯 Node 脚本，需要系统 PATH 中有 `node` 命令。

## OpenAPI 与角色模板

模板已经预置了 `haloPlugin.openApi` 配置，默认会：

- 输出 OpenAPI 文档到 `api-docs/openapi/v3_0`
- 把生成的前端客户端输出到 `ui/src/api/generated`
- 为 `generateRoleTemplates` 提供基础输入

视图层不要直接写裸请求 URL，也不要直接 import 生成客户端，统一从 `ui/src/api/index.ts` 包装后再消费。

## 初始化后裁剪

主模板故意把 Console、UC、仪表盘、快捷操作、附件扩展和 PublicEndpoint 占位都带上了，方便你按需删减。

- 若只做 Console 插件，可删除 UC 路由、UC 角色模板和相关设置。
- 若不需要附件扩展或工作台小部件，可删除对应扩展点和配套组件。
- 若不需要概览页，可删除 `PluginTemplateOverviewPage.vue` 及 `views/console/`、`views/uc/`。
- 具体裁剪顺序见 [docs/template-pruning.md](./docs/template-pruning.md)。

## 仪表盘小部件

`PluginTemplateDashboardWidget.vue` 采用指标卡 + 功能网格布局：

- Hero 区域：突出显示 `stats[0]` 的数值，右侧集成开关控件
- 功能网格：2 列布局，每项带彩色左边条（橙/绿交替）+ 浅色背景
- 数据来源：后端 `/overview` API 返回的 `stats`、`features`、`checklist`

## Rsbuild

主模板只维护 Vite 版本。若需要切换到 Rsbuild，请参考 [docs/rsbuild-switch.md](./docs/rsbuild-switch.md)。

## 许可证

[GPL-3.0](./LICENSE)
