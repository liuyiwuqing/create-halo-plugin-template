#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import {
  normalizePermissionPrefix,
  normalizePluginName,
  normalizeRoutePrefix,
} from './lib/template-meta.mjs'

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url))
const TEMPLATE_ROOT = path.resolve(SCRIPT_DIR, '..')
const SKIP_NAMES = new Set([
  '.git',
  '.gradle',
  '.npm-cache',
  'build',
  'node_modules',
  'workplace',
  'api-docs',
  '.DS_Store',
])
const SKIP_RELATIVE_PATHS = new Set([
  '.npmignore',
  '.github/workflows/publish-npm.yaml',
  'bin',
  'docs',
  'docs/publish-template.md',
  'package.json',
  'package-lock.json',
  'pnpm-lock.yaml',
  'scripts',
  'ui/build',
])

const usage = `
Usage:
  node scripts/create-project.mjs \\
    --plugin-name todo \\
    --base-package com.example.helloworld \\
    --display-name "Todo" \\
    --author-name "Your Name" \\
    [--route-prefix /plugin-todo] \\
    [--permission-prefix plugin:plugin-todo] \\
    [--target-dir ../plugin-todo] \\
    [--author-website "https://github.com/your-name"] \\
    [--repo-owner your-name] \\
    [--description "Todo - Halo 插件"] \\
    [--install] \\
    [--build] \\
    [--halo-server]
`.trim()

const parseArgs = (argv) => {
  const parsed = {
    install: false,
    build: false,
    haloServer: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index]

    if (token === '--help' || token === '-h') {
      parsed.help = true
      continue
    }

    if (token === '--install') {
      parsed.install = true
      continue
    }

    if (token === '--build') {
      parsed.build = true
      continue
    }

    if (token === '--halo-server') {
      parsed.haloServer = true
      continue
    }

    if (!token.startsWith('--')) {
      throw new Error(`Unknown argument: ${token}`)
    }

    const key = token.slice(2)
    const value = argv[index + 1]
    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for --${key}`)
    }

    parsed[key] = value.trim()
    index += 1
  }

  if (parsed.help) {
    return {
      pluginName: '',
      basePackage: '',
      displayName: '',
      authorName: '',
      authorWebsite: '',
      repoOwner: '',
      description: '',
      targetDir: '',
      install: false,
      build: false,
      haloServer: false,
      help: true,
    }
  }

  for (const key of ['plugin-name', 'base-package', 'display-name', 'author-name']) {
    if (!parsed[key]) {
      throw new Error(`--${key} is required`)
    }
  }

  const pluginName = normalizePluginName(parsed['plugin-name'])
  const routePrefix = normalizeRoutePrefix(parsed['route-prefix'], pluginName)
  const permissionPrefix = normalizePermissionPrefix(parsed['permission-prefix'], pluginName)

  return {
    pluginName,
    basePackage: parsed['base-package'],
    displayName: parsed['display-name'],
    authorName: parsed['author-name'],
    authorWebsite: parsed['author-website'] || '',
    repoOwner: parsed['repo-owner'] || '',
    description: parsed.description || '',
    routePrefix,
    permissionPrefix,
    targetDir: path.resolve(parsed['target-dir'] || path.resolve(process.cwd(), pluginName)),
    install: parsed.install,
    build: parsed.build,
    haloServer: parsed.haloServer,
    help: parsed.help,
  }
}

const normalizeRelativePath = (sourcePath) =>
  path.relative(TEMPLATE_ROOT, sourcePath).split(path.sep).join('/')

const shouldCopy = (sourcePath) => {
  const relativePath = normalizeRelativePath(sourcePath)
  if (!relativePath) {
    return true
  }

  for (const skippedPath of SKIP_RELATIVE_PATHS) {
    if (relativePath === skippedPath || relativePath.startsWith(`${skippedPath}/`)) {
      return false
    }
  }

  if (SKIP_RELATIVE_PATHS.has(relativePath)) {
    return false
  }

  const segments = relativePath.split('/')
  return !segments.some((segment) => SKIP_NAMES.has(segment))
}

const ensureTargetDir = async (targetDir) => {
  if (targetDir === TEMPLATE_ROOT || targetDir.startsWith(`${TEMPLATE_ROOT}${path.sep}`)) {
    throw new Error('Target directory must be outside the template repository')
  }

  try {
    const entries = await fs.readdir(targetDir)
    if (entries.length > 0) {
      throw new Error(`Target directory is not empty: ${targetDir}`)
    }
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      await fs.mkdir(targetDir, { recursive: true })
      return
    }
    throw error
  }
}

const runCommand = async (command, args, cwd) => {
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: false,
    })

    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) {
        resolve(undefined)
        return
      }
      reject(new Error(`Command failed (${code}): ${command} ${args.join(' ')}`))
    })
  })
}

const buildGeneratedReadme = (options) => `# ${options.displayName}

这个项目由 Halo Plugin Template 初始化生成，当前插件基础信息如下：

- 插件名：\`${options.pluginName}\`
- Java 包名：\`${options.basePackage}\`
- UI 路由前缀：\`${options.routePrefix}\`
- 权限前缀：\`${options.permissionPrefix}:*\`

## 环境要求

- Java 21+
- Node.js 22+
- pnpm 10+
- Docker（推荐，用于 \`haloServer\`）

## 快速开始

\`\`\`bash
pnpm install --dir ui
./gradlew build
./gradlew haloServer
\`\`\`

如果只调试前端构建：

\`\`\`bash
cd ui
pnpm dev
\`\`\`

## 常用命令

\`\`\`bash
# 构建插件
./gradlew build

# 后端单测
./gradlew test

# 前端检查
cd ui
pnpm verify

# 生成 OpenAPI 文档和 TS 客户端
cd ..
./gradlew generateApiClient

# 基于 OpenAPI 生成角色模板草稿
./gradlew generateRoleTemplates
\`\`\`

## 开发建议

- 后端先补接口和 Springdoc 注解，再执行 \`./gradlew generateApiClient\`。
- 前端统一从 \`ui/src/api/index.ts\` 暴露 API，不要在页面里写裸 URL。
- 通过 \`--route-prefix\` 和 \`--permission-prefix\` 传入的规则已经写入项目，不需要再手工全局替换。
- 生成项目默认不再附带模板仓库的 \`docs/\` 和 \`scripts/\` 目录，保持业务仓库更轻。

## 目录说明

- \`src/main/java/\`：后端骨架，按 \`config / endpoint / query / service / scheme / reconcile / setting / utils\` 分层
- \`src/main/resources/extensions/\`：插件设置和角色模板
- \`ui/src/index.ts\`：插件 UI 唯一注册入口
- \`ui/src/components/ui/\`：低层通用 UI 包装
- \`ui/src/components/\`：业务级共享组件
- \`ui/src/api/index.ts\`：前端唯一 API 包装出口
- \`ui/src/api/generated/\`：由 \`generateApiClient\` 生成并已接入的客户端代码

## 裁剪模板

如果你只做 Console 页面，或不需要附件扩展、UC 页面，直接删除对应的 \`ucRoutes\`、扩展点和角色模板即可。

## 许可证

[GPL-3.0](./LICENSE)
`

const writeGeneratedReadme = async (options) => {
  await fs.writeFile(
    path.join(options.targetDir, 'README.md'),
    buildGeneratedReadme(options),
    'utf8',
  )
}

const buildInitArgs = (options) => {
  const args = [
    path.join(SCRIPT_DIR, 'init-template.mjs'),
    '--plugin-name',
    options.pluginName,
    '--base-package',
    options.basePackage,
    '--display-name',
    options.displayName,
    '--author-name',
    options.authorName,
    '--route-prefix',
    options.routePrefix,
    '--permission-prefix',
    options.permissionPrefix,
  ]

  if (options.authorWebsite) {
    args.push('--author-website', options.authorWebsite)
  }
  if (options.repoOwner) {
    args.push('--repo-owner', options.repoOwner)
  }
  if (options.description) {
    args.push('--description', options.description)
  }

  return args
}

const buildVerifyArgs = (options) => {
  const args = [
    path.join(SCRIPT_DIR, 'verify-template.mjs'),
    '--plugin-name',
    options.pluginName,
    '--base-package',
    options.basePackage,
    '--display-name',
    options.displayName,
    '--author-name',
    options.authorName,
    '--route-prefix',
    options.routePrefix,
    '--permission-prefix',
    options.permissionPrefix,
  ]

  if (options.authorWebsite) {
    args.push('--author-website', options.authorWebsite)
  }
  if (options.repoOwner) {
    args.push('--repo-owner', options.repoOwner)
  }
  if (options.description) {
    args.push('--description', options.description)
  }

  return args
}

const main = async () => {
  try {
    const options = parseArgs(process.argv.slice(2))

    if (options.help) {
      console.log(usage)
      return
    }

    await ensureTargetDir(options.targetDir)

    await fs.cp(TEMPLATE_ROOT, options.targetDir, {
      recursive: true,
      filter: (sourcePath) => shouldCopy(sourcePath),
    })

    if (process.platform !== 'win32') {
      await fs.chmod(path.join(options.targetDir, 'gradlew'), 0o755)
    }

    console.log(`Copied template to ${options.targetDir}`)

    await runCommand(process.execPath, buildInitArgs(options), options.targetDir)
    await writeGeneratedReadme(options)
    await runCommand(process.execPath, buildVerifyArgs(options), options.targetDir)

    const pnpmCommand = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'
    const gradleCommand = process.platform === 'win32' ? 'gradlew.bat' : './gradlew'

    if (options.install) {
      await runCommand(pnpmCommand, ['install', '--dir', 'ui'], options.targetDir)
    }

    if (options.build) {
      await runCommand(gradleCommand, ['build'], options.targetDir)
    }

    console.log('')
    console.log('Project created successfully')
    console.log(`Target: ${options.targetDir}`)
    console.log('Recommended next steps:')
    console.log(`  cd ${options.targetDir}`)
    if (!options.install) {
      console.log('  pnpm install --dir ui')
    }
    if (!options.build) {
      console.log('  ./gradlew build')
    }
    console.log('  ./gradlew haloServer')

    if (options.haloServer) {
      await runCommand(gradleCommand, ['haloServer'], options.targetDir)
    }
  } catch (error) {
    console.error(`Failed to create project: ${error instanceof Error ? error.message : String(error)}`)
    console.error(usage)
    process.exitCode = 1
  }
}

await main()
