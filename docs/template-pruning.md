# Template Pruning Guide

这个 starter 预置的是“可删减的上限”，不是要求每个插件都把所有模块保留下来。

## 建议保留

- `src/main/resources/plugin.yaml`、`settings.yaml`、角色模板：这是 Halo 插件最稳定的元数据骨架。
- `ui/src/index.ts`：继续作为唯一 UI 注册出口，避免路由、扩展点和权限定义分散。
- `ui/src/api/index.ts`：所有前端请求统一经过这一层，不要在页面里直连生成客户端或裸 URL。
- `scripts/init-template.mjs` 和 `scripts/verify-template.mjs`：一个负责初始化，一个负责验收，后续孵化多个插件时都能复用。
- `ui/src/lib/template.ts`：共用的表格列定义、状态格式化、受众标签等工具函数，裁剪后可按需保留需要的部分。
- `ui/src/composables/useTemplateOverview.ts`：Console / UC 双端复用的概览数据加载逻辑。

## 按需删除

- 不需要 User Center 时：
  删除 `PluginTemplateUcEndpoint`、`roleTemplate-uc.yaml`、`ucRoutes` 和相关 `enableUcDashboard` 设置。
  如果 UC 概览页也不需要，一并删除 `ui/src/views/uc/UcDashboardView.vue`。
- 不需要附件扩展标签页时：
  删除 `PluginTemplateAttachmentTab.vue`、`attachment:selector:create` 扩展点和 `enableAttachmentProvider` 设置。
- 不需要工作台小部件或快速操作时：
  删除 `PluginTemplateDashboardWidget.vue`、`console:dashboard:*` 扩展点，以及对应权限项。
- 不需要概览页时：
  删除 `PluginTemplateOverviewPage.vue`、`views/console/ConsoleDashboardView.vue`、`views/uc/UcDashboardView.vue`。
  以及 `ui/src/composables/useTemplateOverview.ts` 和 `ui/src/lib/template.ts` 中仅被概览页使用的函数。
- 不需要公共 API 时：
  保留 `PluginTemplatePublicEndpoint.java` 作为占位即可，真正需要公开接口时再加 `@Component` 和路由。
- 不需要 UI 基础组件时：
  `ui/src/components/ui/` 下的 `UiMetricCard.vue`、`UiSectionCard.vue`、`UiStatusPill.vue`、`PluginUiProvider.vue` 可按需保留或删除。

## 增量开发顺序

1. 先补后端接口和 Springdoc 注解。
2. 执行 `./gradlew generateApiClient` 更新 `ui/src/api/generated/`。
3. 只在 `ui/src/api/index.ts` 暴露业务可用的 API 包装。
4. 页面和组件只依赖本地包装层，不直接引用生成客户端。

## 初始化后的最小验收

```bash
node scripts/verify-template.mjs \
  --plugin-name todo \
  --base-package com.example.helloworld \
  --display-name "Todo" \
  --author-name "Your Name" \
  --route-prefix /plugin-todo \
  --permission-prefix plugin:plugin-todo

./gradlew build
cd ui && pnpm test:unit
```

如果模板已经剪裁过，只要 `verify-template.mjs` 和构建通过，就说明插件的基础边界仍然一致。
