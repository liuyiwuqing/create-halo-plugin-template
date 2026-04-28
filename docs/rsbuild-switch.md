# 从 Vite 切换到 Rsbuild

这个模板只维护一套 Vite 主线。如果你的插件前端体量变大，或者希望切到 Rspack 生态，可以按下面的最小差异切换到 Rsbuild。

## 需要保留不动的部分

这些文件不用改：

- `build.gradle`
- `settings.gradle`
- `src/main/resources/plugin.yaml`
- `src/main/resources/extensions/*`
- `ui/src/index.ts`
- `ui/src/api/*`

模板里真正和 bundler 绑定的部分，只有 `ui/package.json` 与构建配置文件。

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

如果你只是为了试验构建性能，不要复制第二套 `ui-*` 目录；保持一套模板源代码，只切 bundler。
