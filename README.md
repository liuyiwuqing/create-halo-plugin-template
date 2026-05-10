# Halo Plugin Template

通用的 Halo 插件开发模板，基于官方 `pnpm create halo-plugin` 的 Vite 预设收敛而成。

这个模板默认提供：

- Java 21 + Halo Plugin DevTools 基线
- Vite + Vue 3 + TypeScript + Tailwind CSS + shadcn-vue 的轻量前端栈
- Console / UC 路由骨架
- 真实接入 Halo Extension 的 Console CRUD 示例页，覆盖分页、筛选、弹窗表单和删除确认
- 仪表盘小部件、快速操作项、附件选择器扩展点示例
- `settings.yaml`、Console/UC 角色模板、OpenAPI 客户端生成配置
- 已接线的 `ui/src/api/generated` + `ui/src/api/index.ts` API 包装层
- 一次性初始化脚本，用于批量改插件名、包名、权限前缀和仓库信息

## 环境要求

- Java 21+
- Node.js 22+
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
# 构建插件
./gradlew build

# 后端单测
./gradlew test

# 一致性检查
node scripts/verify-template.mjs

# 前端检查
cd ui
pnpm verify

# 生成 OpenAPI 文档和 TS 客户端
cd ..
./gradlew generateApiClient

# 基于 OpenAPI 生成角色模板草稿
./gradlew generateRoleTemplates
```

## 前端技术栈

`ui` 目录使用 Vite、Vue 3、TypeScript、Tailwind CSS 和 shadcn-vue。基础组件按需放在 `ui/src/components/ui/`，全局主题变量集中在 `ui/src/assets/index.css`，`components.json` 负责 shadcn-vue 的组件路径、Tailwind 入口和别名配置。

- UI 组件：优先使用本地 shadcn-vue 风格组件和 Tailwind utility。
- 图标：使用 `lucide-vue-next`。
- 表单校验：使用 `vee-validate` + `zod`。
- 消息提示：使用 `vue-sonner`。
- 国际化：默认 `zh-CN`，入口在 `ui/src/i18n.ts`。
- 主题：支持浅色、暗黑、跟随系统/Halo 宿主暗黑 class，并支持后端 `accentColor` 覆盖主色。

VSCode 可选安装 shadcn-vue 扩展 `@selemondev.vscode-shadcn-vue`，用于快速查看文档、插入组件和使用代码片段。

## 目录说明

- `src/main/java/`：后端骨架，按 `config / endpoint / query / service / scheme / reconcile / setting / utils` 分层
- `src/main/resources/extensions/`：插件设置和角色模板
- `ui/src/index.ts`：插件 UI 唯一注册入口
- `ui/src/components/ui/`：低层通用 UI 包装
- `ui/src/components/`：业务级共享组件
- `ui/src/views/console/RecordManagementView.vue`：后台管理常见 CRUD 示例页
- `ui/src/api/index.ts`：前端唯一 API 包装出口
- `ui/src/api/generated/`：由 `generateApiClient` 生成并已接入的客户端代码
- `docs/rsbuild-switch.md`：从当前模板切换到 Rsbuild 的最小差异说明
- `docs/template-pruning.md`：初始化后如何裁剪模板能力的操作建议

## OpenAPI 与角色模板

模板已经预置了 `haloPlugin.openApi` 配置，默认会：

- 输出 OpenAPI 文档到 `api-docs/openapi/v3_0`
- 把生成的前端客户端输出到 `ui/src/api/generated`
- 为 `generateRoleTemplates` 提供基础输入

视图层不要直接写裸请求 URL，也不要直接 import 生成客户端，统一从 `ui/src/api/index.ts` 包装后再消费。

## 初始化后裁剪

主模板故意把 Console、UC、仪表盘、快捷操作、附件扩展和 PublicEndpoint 占位都带上了，方便你按需删减。

- 若只做 Console 插件，可删除 UC 路由、UC 角色模板和相关设置。
- 若不需要 CRUD 示例页，可删除 `template-records` 后端路由、`PluginTemplateRecord` Scheme、记录管理页面和对应菜单。
- 若不需要附件扩展或工作台小部件，可删除对应扩展点和配套组件。
- 具体裁剪顺序见 [docs/template-pruning.md](./docs/template-pruning.md)。

## Rsbuild

主模板只维护 Vite 版本。若需要切换到 Rsbuild，请参考 [docs/rsbuild-switch.md](./docs/rsbuild-switch.md)。

## 许可证

[GPL-3.0](./LICENSE)
