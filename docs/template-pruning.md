# Template Pruning Guide

这个 starter 预置的是“可删减的上限”，不是要求每个插件都把所有模块保留下来。

## 建议保留

- `src/main/resources/plugin.yaml`、`settings.yaml`、角色模板：这是 Halo 插件最稳定的元数据骨架。
- `ui/src/index.ts`：继续作为唯一 UI 注册出口，避免路由、扩展点和权限定义分散。
- `ui/src/api/index.ts`：所有前端请求统一经过这一层，不要在页面里直连生成客户端或裸 URL。
- `scripts/init-template.mjs` 和 `scripts/verify-template.mjs`：一个负责初始化，一个负责验收，后续孵化多个插件时都能复用。

## 按需删除

- 不需要 User Center 时：
  删除 `PluginTemplateUcEndpoint`、`roleTemplate-uc.yaml`、`ucRoutes` 和相关 `enableUcDashboard` 设置。
- 不需要附件扩展标签页时：
  删除 `PluginTemplateAttachmentTab.vue`、`attachment:selector:create` 扩展点和 `enableAttachmentProvider` 设置。
- 不需要工作台小部件或快速操作时：
  删除 `PluginTemplateDashboardWidget.vue`、`console:dashboard:*` 扩展点，以及对应权限项。
- 不需要公共 API 时：
  保留 `PluginTemplatePublicEndpoint.java` 作为占位即可，真正需要公开接口时再加 `@Component` 和路由。

## 增量开发顺序

1. 先补后端接口和 Springdoc 注解。
2. 执行 `./gradlew generateApiClient` 更新 `ui/src/api/generated/`。
3. 只在 `ui/src/api/index.ts` 暴露业务可用的 API 包装。
4. 页面和组件只依赖本地包装层，不直接引用生成客户端。

## 初始化后的最小验收

```bash
node scripts/verify-template.mjs \
  --plugin-name hello-world \
  --base-package com.example.helloworld \
  --display-name "Hello World" \
  --author-name "Your Name"

./gradlew build
cd ui && pnpm test:unit
```

如果模板已经剪裁过，只要 `verify-template.mjs` 和构建通过，就说明插件的基础边界仍然一致。
