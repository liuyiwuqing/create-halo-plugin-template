#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const TEMPLATE = {
  pluginName: 'halo-plugin-template',
  basePackage: 'run.halo.plugintemplate',
  classPrefix: 'PluginTemplate',
  displayName: 'Halo Plugin Template',
  authorName: 'Template Author',
  authorWebsite: 'https://github.com/example',
  repoOwner: 'example',
  description:
    'Halo plugin starter with Vite, Element Plus, extension points, and an initialization script.',
}

const TEMPLATE_PACKAGE_PATH = TEMPLATE.basePackage.split('.').join('/')
const ROOT = process.cwd()
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
  '.gitignore',
  '.editorconfig',
])
const SKIP_DIRS = new Set([
  '.git',
  '.gradle',
  'build',
  'node_modules',
  'plugin-halo-plugin-rsbuild',
  'plugin-halo-plugin-vite',
])

const usage = `
Usage:
  node scripts/init-template.mjs \\
    --plugin-name hello-world \\
    --base-package com.example.helloworld \\
    --display-name "Hello World" \\
    --author-name "Your Name" \\
    [--author-website "https://github.com/your-name"] \\
    [--repo-owner your-name] \\
    [--description "Hello World - Halo 插件"]
`.trim()

const slugify = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const toClassPrefix = (pluginName) => {
  const parts = pluginName.split(/[^a-zA-Z0-9]+/).filter(Boolean)
  if (!parts.length) {
    return 'PluginTemplate'
  }
  return parts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('')
}

const toKebabToken = (value) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .toLowerCase()

const parseArgs = (argv) => {
  const parsed = {}

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index]
    if (!token.startsWith('--')) {
      continue
    }
    const key = token.slice(2)
    const value = argv[index + 1]
    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for --${key}`)
    }
    parsed[key] = value
    index += 1
  }

  for (const key of ['plugin-name', 'base-package', 'display-name', 'author-name']) {
    if (!parsed[key]?.trim()) {
      throw new Error(`--${key} is required`)
    }
  }

  return {
    pluginName: slugify(parsed['plugin-name']),
    basePackage: parsed['base-package'].trim(),
    displayName: parsed['display-name'].trim(),
    authorName: parsed['author-name'].trim(),
    authorWebsite: parsed['author-website']?.trim() || '',
    repoOwner: parsed['repo-owner']?.trim() || '',
    description: parsed.description?.trim() || '',
  }
}

const isTextFile = (filePath) => {
  const fileName = path.basename(filePath)
  return TEXT_FILE_NAMES.has(fileName) || TEXT_EXTENSIONS.has(path.extname(filePath))
}

const walkFiles = async (directory) => {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) {
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

const replaceContent = async (filePath, replacements) => {
  if (!isTextFile(filePath)) {
    return
  }

  const original = await fs.readFile(filePath, 'utf8')
  let next = original

  for (const [from, to] of replacements) {
    next = next.split(from).join(to)
  }

  if (next !== original) {
    await fs.writeFile(filePath, next, 'utf8')
  }
}

const pruneEmptyDirectories = async (startPath, stopPath) => {
  let current = startPath

  while (current.startsWith(stopPath) && current !== stopPath) {
    const entries = await fs.readdir(current)
    if (entries.length > 0) {
      break
    }
    await fs.rmdir(current)
    current = path.dirname(current)
  }
}

const renamePackageDirectory = async (sourceRoot, targetRoot) => {
  try {
    await fs.access(sourceRoot)
  } catch {
    return
  }

  await fs.mkdir(path.dirname(targetRoot), { recursive: true })
  await fs.rename(sourceRoot, targetRoot)
  await pruneEmptyDirectories(path.dirname(sourceRoot), path.dirname(path.dirname(sourceRoot)))
}

const collectRenameTargets = async (directory, token, result = []) => {
  const entries = await fs.readdir(directory, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) {
      continue
    }

    const absolutePath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      await collectRenameTargets(absolutePath, token, result)
    }

    if (entry.name.includes(token)) {
      result.push(absolutePath)
    }
  }

  return result
}

const renameClassPrefixPaths = async (root, fromToken, toToken) => {
  const targets = await collectRenameTargets(root, fromToken)
  targets.sort((left, right) => right.length - left.length)

  for (const current of targets) {
    const target = path.join(path.dirname(current), path.basename(current).replaceAll(fromToken, toToken))
    await fs.rename(current, target)
  }
}

const main = async () => {
  try {
    const options = parseArgs(process.argv.slice(2))
    const classPrefix = toClassPrefix(options.pluginName)
    const classPrefixKebab = toKebabToken(classPrefix)
    const templateClassPrefixKebab = toKebabToken(TEMPLATE.classPrefix)
    const repoOwner = options.repoOwner || slugify(options.authorName).replace(/-/g, '')
    const authorWebsite = options.authorWebsite || `https://github.com/${repoOwner}`
    const description = options.description || `${options.displayName} - Halo 插件`
    const nextPackagePath = options.basePackage.split('.').join('/')

    const replacements = [
      [
        'https://github.com/example/halo-plugin-template/blob/main/LICENSE',
        `https://github.com/${repoOwner}/${options.pluginName}/blob/main/LICENSE`,
      ],
      [
        'https://github.com/example/halo-plugin-template/issues',
        `https://github.com/${repoOwner}/${options.pluginName}/issues`,
      ],
      [
        'https://github.com/example/halo-plugin-template#readme',
        `https://github.com/${repoOwner}/${options.pluginName}#readme`,
      ],
      [
        'https://github.com/example/halo-plugin-template',
        `https://github.com/${repoOwner}/${options.pluginName}`,
      ],
      [TEMPLATE.authorWebsite, authorWebsite],
      [TEMPLATE_PACKAGE_PATH, nextPackagePath],
      [TEMPLATE.basePackage, options.basePackage],
      [TEMPLATE.classPrefix, classPrefix],
      [TEMPLATE.displayName, options.displayName],
      [TEMPLATE.description, description],
      [TEMPLATE.authorName, options.authorName],
      [TEMPLATE.pluginName, options.pluginName],
      [templateClassPrefixKebab, classPrefixKebab],
    ]

    const files = await walkFiles(ROOT)
    for (const filePath of files) {
      await replaceContent(filePath, replacements)
    }

    await renamePackageDirectory(
      path.join(ROOT, 'src/main/java', TEMPLATE_PACKAGE_PATH),
      path.join(ROOT, 'src/main/java', nextPackagePath),
    )
    await renamePackageDirectory(
      path.join(ROOT, 'src/test/java', TEMPLATE_PACKAGE_PATH),
      path.join(ROOT, 'src/test/java', nextPackagePath),
    )
    await renameClassPrefixPaths(ROOT, TEMPLATE.classPrefix, classPrefix)
    await renameClassPrefixPaths(ROOT, templateClassPrefixKebab, classPrefixKebab)

    console.log(`Initialized template as ${options.pluginName}`)
    console.log(`Base package: ${options.basePackage}`)
    console.log(`Class prefix: ${classPrefix}`)
    console.log(`Repository owner: ${repoOwner}`)
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    console.error('')
    console.error(usage)
    process.exitCode = 1
  }
}

await main()
