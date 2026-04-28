# 从 Vite 切换到 Rsbuild

这个模板只维护一套 Vite 主线。如果你的插件前端体量变大，或者希望切到 Rspack 生态，可以按下面的最小差异切换到 Rsbuild。

## 需要保留不动的部分

这些文件不用改：

- `build.gradle`（根项目通过 `com.github.node-gradle.node` 插件管理 Node 运行时，与 Rsbuild 无冲突）
- `settings.gradle`
- `src/main/resources/plugin.yaml`
- `src/main/resources/extensions/*`
- `ui/src/index.ts`
- `ui/src/api/*`

模板里真正和 bundler 绑定的部分，只有 `ui/package.json`、`ui/build.gradle`（子项目 node-gradle 插件配置）与构建配置文件。

## 变更步骤

1. 替换 `ui/package.json` 的脚本与依赖

把：

```json
"build-only": "vite build",
"dev": "vite build --watch --mode=development"
```

替换成：

```json
"build-only": "rsbuild build",
"dev": "rsbuild build --watch --env-mode=development"
```

把 `vite` 从 `devDependencies` 移除，新增：

```json
"@rsbuild/core": "^1.7.3",
"@rsbuild/plugin-sass": "^1.5.0"
```

2. 新建 `ui/rsbuild.config.ts`

```ts
import { rsbuildConfig } from '@halo-dev/ui-plugin-bundler-kit'
import type { RsbuildConfig } from '@rsbuild/core'
import { pluginSass } from '@rsbuild/plugin-sass'
import Icons from 'unplugin-icons/rspack'

export default rsbuildConfig({
  rsbuild: {
    resolve: {
      alias: {
        '@': './src',
      },
    },
    plugins: [pluginSass()],
    tools: {
      rspack: {
        plugins: [Icons({ compiler: 'vue3' })],
      },
    },
  },
}) as RsbuildConfig
```

3. 删除 `ui/vite.config.ts`

Rsbuild 启用后不再需要 Vite 配置文件。

4.（可选）更新 `build.gradle` 中的 `watchDomains`

根项目 `build.gradle` 的 `haloPlugin.watchDomains.uiSource` 引用了 `ui/vite.config.ts`。
切换到 Rsbuild 后可改为 `ui/rsbuild.config.ts`：

```groovy
watchDomains {
    uiSource {
        files files('ui/src/', 'ui/rsbuild.config.ts', 'ui/package.json')
    }
}
```

## 验证

完成后执行：

```bash
pnpm install --dir ui
cd ui
pnpm build
pnpm dev
```

然后回到项目根目录执行：

```bash
./gradlew build
./gradlew haloServer
```

`./gradlew build` 会自动触发 `verifyTemplateConsistency`，确保切换 Rsbuild 后模板内部引用仍然一致。

如果你只是为了试验构建性能，不要复制第二套 `ui-*` 目录；保持一套模板源代码，只切 bundler。
