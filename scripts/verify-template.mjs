#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const ROOT = process.cwd()
const REQUIRED_FILES = [
  'README.md',
  'build.gradle',
  'settings.gradle',
  'scripts/init-template.mjs',
  'src/main/resources/plugin.yaml',
  'src/main/resources/extensions/settings.yaml',
  'src/main/resources/extensions/roleTemplate-console.yaml',
  'src/main/resources/extensions/roleTemplate-uc.yaml',
  'ui/src/index.ts',
  'ui/src/api/index.ts',
  'ui/src/api/generated/index.ts',
  'docs/rsbuild-switch.md',
  'docs/template-pruning.md',
]
const TEXT_EXTENSIONS = new Set([
  '.md',
  '.yaml',
  '.yml',
  '.json',
  '.mjs',
  '.ts',
  '.tsx',
  '.vue',
  '.scss',
  '.css',
  '.gradle',
  '.java',
  '.properties',
  '.html',
])
const TEXT_FILE_NAMES = new Set([
  '.editorconfig',
  '.gitignore',
])
const SKIP_DIRS = new Set([
  '.git',
  '.gradle',
  'build',
  'node_modules',
  'ui/build',
  'workplace',
])
const ORIGINAL_TEMPLATE = {
  pluginName: ['halo', 'plugin', 'template'].join('-'),
  basePackage: ['run', 'halo', 'plugintemplate'].join('.'),
  classPrefix: ['Plugin', 'Template'].join(''),
}

const usage = `
Usage:
  node scripts/verify-template.mjs

  node scripts/verify-template.mjs \\
    --plugin-name hello-world \\
    --base-package com.example.helloworld \\
    --display-name "Hello World" \\
    --author-name "Your Name" \\
    [--author-website "https://github.com/your-name"] \\
    [--repo-owner your-name] \\
    [--description "Hello World - Halo 插件"]
`.trim()

const parseArgs = (argv) => {
  const args = {}

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index]

    if (token === '--help' || token === '-h') {
      args.help = true
      continue
    }

    if (!token.startsWith('--')) {
      throw new Error(`Unknown argument: ${token}`)
    }

    const key = token.slice(2)
    const value = argv[index + 1]

    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for argument: ${token}`)
    }

    args[key] = value
    index += 1
  }

  return args
}

const isTextFile = (filePath) => {
  const extension = path.extname(filePath)
  if (TEXT_EXTENSIONS.has(extension)) {
    return true
  }
  return TEXT_FILE_NAMES.has(path.basename(filePath))
}

const walkFiles = async (directory) => {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) {
      continue
    }

    const absolutePath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(absolutePath)))
      continue
    }

    files.push(absolutePath)
  }

  return files
}

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const readText = async (relativePath) =>
  fs.readFile(path.join(ROOT, relativePath), 'utf8')

const exists = async (relativePath) => {
  try {
    await fs.access(path.join(ROOT, relativePath))
    return true
  } catch {
    return false
  }
}

const findFileByPattern = async (pattern) => {
  const files = await walkFiles(ROOT)
  return files
    .map((filePath) => path.relative(ROOT, filePath))
    .find((relativePath) => pattern.test(relativePath))
}

const extractJavaConstant = (content, constantName) => {
  const pattern = new RegExp(
    `public static final (?:String|boolean) ${escapeRegExp(constantName)} = (?:"([^"]+)"|(true|false));`,
  )
  const match = content.match(pattern)
  return match?.[1] ?? match?.[2] ?? ''
}

const extractGradleGroup = (content) => content.match(/group\s+'([^']+)'/)?.[1] ?? ''

const extractRootProjectName = (content) =>
  content.match(/rootProject\.name\s*=\s*'([^']+)'/)?.[1] ?? ''

const formatResult = (status, message) => `${status} ${message}`

const fail = (results, message) => results.push(formatResult('FAIL', message))

const pass = (results, message) => results.push(formatResult('PASS', message))

const assertContains = (results, content, fragment, description) => {
  if (content.includes(fragment)) {
    pass(results, description)
    return
  }
  fail(results, `${description} (missing: ${fragment})`)
}

const verifyNoTemplateResidue = async (results) => {
  const files = await walkFiles(ROOT)
  const textFiles = files.filter(isTextFile)
  const markers = Object.values(ORIGINAL_TEMPLATE)
  const hits = []

  for (const filePath of textFiles) {
    const relativePath = path.relative(ROOT, filePath)
    const content = await fs.readFile(filePath, 'utf8')
    for (const marker of markers) {
      if (content.includes(marker)) {
        hits.push(`${relativePath}: ${marker}`)
      }
    }
  }

  if (!hits.length) {
    pass(results, 'No original starter markers remain in text files')
    return
  }

  fail(
    results,
    `Original starter markers still exist after initialization: ${hits.slice(0, 8).join(', ')}`,
  )
}

const verifyRepo = async (args) => {
  const results = []

  for (const requiredFile of REQUIRED_FILES) {
    if (await exists(requiredFile)) {
      pass(results, `Required file exists: ${requiredFile}`)
    } else {
      fail(results, `Required file is missing: ${requiredFile}`)
    }
  }

  const settingKeysPath = await findFileByPattern(/src\/main\/java\/.+SettingKeys\.java$/)
  if (!settingKeysPath) {
    fail(results, 'SettingKeys.java was not found under src/main/java')
    return results
  }
  pass(results, `Discovered setting constants: ${settingKeysPath}`)

  const [
    settingKeysContent,
    buildGradleContent,
    settingsGradleContent,
    pluginYamlContent,
    settingsYamlContent,
    consoleRoleTemplateContent,
    ucRoleTemplateContent,
    uiIndexContent,
    uiApiContent,
    readmeContent,
    providerContent,
  ] = await Promise.all([
    readText(settingKeysPath),
    readText('build.gradle'),
    readText('settings.gradle'),
    readText('src/main/resources/plugin.yaml'),
    readText('src/main/resources/extensions/settings.yaml'),
    readText('src/main/resources/extensions/roleTemplate-console.yaml'),
    readText('src/main/resources/extensions/roleTemplate-uc.yaml'),
    readText('ui/src/index.ts'),
    readText('ui/src/api/index.ts'),
    readText('README.md'),
    readText('ui/src/components/ui/PluginUiProvider.vue'),
  ])

  const pluginName = extractJavaConstant(settingKeysContent, 'PLUGIN_NAME')
  const displayName = extractJavaConstant(settingKeysContent, 'DISPLAY_NAME')
  const settingName = extractJavaConstant(settingKeysContent, 'SETTING_NAME')
  const configMapName = extractJavaConstant(settingKeysContent, 'CONFIG_MAP_NAME')
  const consolePath = extractJavaConstant(settingKeysContent, 'CONSOLE_PATH')
  const ucPath = extractJavaConstant(settingKeysContent, 'UC_PATH')
  const generatedClientPath = extractJavaConstant(settingKeysContent, 'GENERATED_CLIENT_PATH')
  const basePackage = extractGradleGroup(buildGradleContent)
  const rootProjectName = extractRootProjectName(settingsGradleContent)
  const packageDirectory = path.posix.join('src/main/java', ...basePackage.split('.'))
  const permissionPrefix = `plugin:${pluginName}:`

  if (!pluginName || !displayName || !basePackage) {
    fail(results, 'Unable to resolve plugin constants from SettingKeys.java or build.gradle')
    return results
  }

  if (rootProjectName === pluginName) {
    pass(results, `settings.gradle project name matches plugin name: ${pluginName}`)
  } else {
    fail(results, `settings.gradle project name mismatch: expected ${pluginName}, got ${rootProjectName || 'empty'}`)
  }

  if (await exists(packageDirectory)) {
    pass(results, `Java package directory exists: ${packageDirectory}`)
  } else {
    fail(results, `Java package directory is missing: ${packageDirectory}`)
  }

  assertContains(results, pluginYamlContent, `name: ${pluginName}`, 'plugin.yaml metadata name is consistent')
  assertContains(results, pluginYamlContent, `settingName: ${settingName}`, 'plugin.yaml settingName is consistent')
  assertContains(results, pluginYamlContent, `configMapName: ${configMapName}`, 'plugin.yaml configMapName is consistent')
  assertContains(results, pluginYamlContent, `displayName: "${displayName}"`, 'plugin.yaml displayName is consistent')
  assertContains(results, settingsYamlContent, `name: ${settingName}`, 'settings.yaml metadata name is consistent')

  assertContains(results, buildGradleContent, `/apis/console.${pluginName}.halo.run/v1alpha1/**`, 'OpenAPI console path matches plugin name')
  assertContains(results, buildGradleContent, `/apis/uc.${pluginName}.halo.run/v1alpha1/**`, 'OpenAPI UC path matches plugin name')
  assertContains(results, uiIndexContent, `path: '${consolePath}'`, 'Console route path matches setting constants')
  assertContains(results, uiIndexContent, `path: '${ucPath}'`, 'UC route path matches setting constants')
  assertContains(results, uiIndexContent, permissionPrefix, 'UI permissions use the current plugin prefix')
  assertContains(results, providerContent, `${pluginName}-admin-shell`, 'UI provider namespace follows the plugin prefix')
  assertContains(results, uiApiContent, `from '@/api/generated'`, 'UI API wrapper imports from the generated client')

  if (!uiApiContent.includes('/apis/')) {
    pass(results, 'UI API wrapper does not contain raw API paths')
  } else {
    fail(results, 'UI API wrapper still contains raw API paths')
  }

  assertContains(results, consoleRoleTemplateContent, permissionPrefix, 'Console role template uses the plugin permission prefix')
  assertContains(results, ucRoleTemplateContent, permissionPrefix, 'UC role template uses the plugin permission prefix')
  assertContains(results, readmeContent, 'node scripts/verify-template.mjs', 'README documents the verification command')
  assertContains(results, readmeContent, 'docs/template-pruning.md', 'README links to the pruning guide')

  if (await exists(path.posix.join(generatedClientPath, 'api'))) {
    pass(results, `Generated API directory exists: ${generatedClientPath}/api`)
  } else {
    fail(results, `Generated API directory is missing: ${generatedClientPath}/api`)
  }

  if (await exists(path.posix.join(generatedClientPath, 'models'))) {
    pass(results, `Generated model directory exists: ${generatedClientPath}/models`)
  } else {
    fail(results, `Generated model directory is missing: ${generatedClientPath}/models`)
  }

  if (args['plugin-name'] && args['plugin-name'] !== pluginName) {
    fail(results, `Expected plugin name ${args['plugin-name']}, got ${pluginName}`)
  } else if (args['plugin-name']) {
    pass(results, `Expected plugin name matches: ${pluginName}`)
  }

  if (args['base-package'] && args['base-package'] !== basePackage) {
    fail(results, `Expected base package ${args['base-package']}, got ${basePackage}`)
  } else if (args['base-package']) {
    pass(results, `Expected base package matches: ${basePackage}`)
  }

  if (args['display-name'] && args['display-name'] !== displayName) {
    fail(results, `Expected display name ${args['display-name']}, got ${displayName}`)
  } else if (args['display-name']) {
    pass(results, `Expected display name matches: ${displayName}`)
  }

  if (args['author-name']) {
    assertContains(
      results,
      pluginYamlContent,
      `name: ${args['author-name']}`,
      'plugin.yaml author name matches the expected value',
    )
  }

  if (args['author-website']) {
    assertContains(
      results,
      pluginYamlContent,
      `website: ${args['author-website']}`,
      'plugin.yaml author website matches the expected value',
    )
  }

  if (args.description) {
    assertContains(
      results,
      pluginYamlContent,
      `description: "${args.description}"`,
      'plugin.yaml description matches the expected value',
    )
  }

  if (args['repo-owner']) {
    const repoRoot = `https://github.com/${args['repo-owner']}/${pluginName}`
    assertContains(results, pluginYamlContent, `repo: ${repoRoot}`, 'plugin.yaml repo matches the expected owner')
    assertContains(results, pluginYamlContent, `homepage: ${repoRoot}#readme`, 'plugin.yaml homepage matches the expected owner')
    assertContains(results, pluginYamlContent, `issues: ${repoRoot}/issues`, 'plugin.yaml issues URL matches the expected owner')
  }

  const shouldCheckResidue =
    Boolean(args['plugin-name'] || args['base-package'] || args['display-name']) &&
    pluginName !== ORIGINAL_TEMPLATE.pluginName &&
    basePackage !== ORIGINAL_TEMPLATE.basePackage

  if (shouldCheckResidue) {
    await verifyNoTemplateResidue(results)
  }

  return results
}

const main = async () => {
  try {
    const args = parseArgs(process.argv.slice(2))

    if (args.help) {
      console.log(usage)
      return
    }

    const results = await verifyRepo(args)
    const failed = results.filter((line) => line.startsWith('FAIL'))

    for (const line of results) {
      console.log(line)
    }

    if (failed.length) {
      process.exitCode = 1
      return
    }

    console.log('PASS Starter verification completed successfully')
  } catch (error) {
    console.error(`FAIL ${error instanceof Error ? error.message : String(error)}`)
    console.error(usage)
    process.exitCode = 1
  }
}

await main()
