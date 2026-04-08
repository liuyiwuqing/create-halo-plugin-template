#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { spawn } from 'node:child_process'

const ROOT = process.cwd()
const PACKAGE_JSON_PATH = path.join(ROOT, 'package.json')

const usage = `
Usage:
  node scripts/release.mjs --bump patch|minor|major [--skip-checks] [--push]
  node scripts/release.mjs --version x.y.z [--skip-checks] [--push]

Examples:
  node scripts/release.mjs --bump patch
  node scripts/release.mjs --bump minor --push
  node scripts/release.mjs --version 1.0.0 --push
`.trim()

const parseArgs = (argv) => {
  const options = {
    bump: null,
    version: null,
    push: false,
    skipChecks: false,
    help: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index]

    if (token === '--help' || token === '-h') {
      options.help = true
      continue
    }

    if (token === '--push') {
      options.push = true
      continue
    }

    if (token === '--skip-checks') {
      options.skipChecks = true
      continue
    }

    if (token === '--bump') {
      const value = argv[index + 1]
      if (!value) {
        throw new Error('Missing value for --bump')
      }
      options.bump = value
      index += 1
      continue
    }

    if (token === '--version') {
      const value = argv[index + 1]
      if (!value) {
        throw new Error('Missing value for --version')
      }
      options.version = value
      index += 1
      continue
    }

    throw new Error(`Unknown argument: ${token}`)
  }

  if (!options.help && !options.bump && !options.version) {
    throw new Error('Either --bump or --version is required')
  }

  if (options.bump && options.version) {
    throw new Error('Use either --bump or --version, not both')
  }

  return options
}

const runCommand = async (command, args, cwd = ROOT) => {
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

const captureCommand = async (command, args, cwd = ROOT) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: false,
    })

    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString()
    })

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString()
    })

    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) {
        resolve(stdout.trim())
        return
      }
      reject(
        new Error(
          `Command failed (${code}): ${command} ${args.join(' ')}\n${stderr.trim()}`.trim(),
        ),
      )
    })
  })

const parseVersion = (version) => {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version)
  if (!match) {
    throw new Error(`Invalid semver version: ${version}`)
  }

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  }
}

const bumpVersion = (version, bumpType) => {
  const parsed = parseVersion(version)

  switch (bumpType) {
    case 'patch':
      return `${parsed.major}.${parsed.minor}.${parsed.patch + 1}`
    case 'minor':
      return `${parsed.major}.${parsed.minor + 1}.0`
    case 'major':
      return `${parsed.major + 1}.0.0`
    default:
      throw new Error(`Unsupported bump type: ${bumpType}`)
  }
}

const compareVersions = (left, right) => {
  const leftParsed = parseVersion(left)
  const rightParsed = parseVersion(right)

  if (leftParsed.major !== rightParsed.major) {
    return leftParsed.major - rightParsed.major
  }

  if (leftParsed.minor !== rightParsed.minor) {
    return leftParsed.minor - rightParsed.minor
  }

  return leftParsed.patch - rightParsed.patch
}

const fetchPublishedVersions = async (packageName) => {
  try {
    const output = await captureCommand('npm', ['view', packageName, 'versions', '--json'])
    if (!output) {
      return []
    }

    const parsed = JSON.parse(output)
    if (Array.isArray(parsed)) {
      return parsed
    }

    return [String(parsed)]
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (message.includes('E404') || message.includes('404 Not Found')) {
      return []
    }
    throw error
  }
}

const main = async () => {
  let originalPackageJson = null

  try {
    const options = parseArgs(process.argv.slice(2))

    if (options.help) {
      console.log(usage)
      return
    }

    const gitStatus = await captureCommand('git', ['status', '--porcelain'])
    if (gitStatus) {
      throw new Error('Working tree is not clean. Commit or stash changes before releasing.')
    }

    const currentBranch = await captureCommand('git', ['branch', '--show-current'])
    if (currentBranch !== 'main') {
      throw new Error(`Release must be prepared from main. Current branch: ${currentBranch}`)
    }

    const packageJsonRaw = await fs.readFile(PACKAGE_JSON_PATH, 'utf8')
    originalPackageJson = packageJsonRaw
    const packageJson = JSON.parse(packageJsonRaw)

    const nextVersion = options.version ?? bumpVersion(packageJson.version, options.bump)
    parseVersion(nextVersion)

    const publishedVersions = await fetchPublishedVersions(packageJson.name)
    const latestPublishedVersion = publishedVersions
      .filter(Boolean)
      .sort(compareVersions)
      .at(-1)

    if (latestPublishedVersion && compareVersions(nextVersion, latestPublishedVersion) <= 0) {
      throw new Error(
        `Version ${nextVersion} must be greater than the latest published npm version ${latestPublishedVersion}`,
      )
    }

    const existingLocalTag = await captureCommand('git', ['tag', '--list', `v${nextVersion}`])
    if (existingLocalTag) {
      throw new Error(`Tag v${nextVersion} already exists locally`)
    }

    packageJson.version = nextVersion
    await fs.writeFile(PACKAGE_JSON_PATH, `${JSON.stringify(packageJson, null, 2)}\n`, 'utf8')

    if (!options.skipChecks) {
      await runCommand(process.execPath, [path.join('scripts', 'publish-check.mjs')])
    }

    await runCommand('git', ['add', 'package.json'])
    await runCommand('git', ['commit', '-m', `chore: release v${nextVersion}`])
    await runCommand('git', ['tag', '-a', `v${nextVersion}`, '-m', `v${nextVersion}`])

    if (options.push) {
      await runCommand('git', ['push', 'origin', 'main'])
      await runCommand('git', ['push', 'origin', `v${nextVersion}`])
    }

    console.log(`Prepared release v${nextVersion}`)
    console.log(
      options.push
        ? 'main and tags have been pushed. The npm publish workflow should run from the tag push once Trusted Publishing is configured.'
        : 'Next step: git push origin main --follow-tags',
    )
  } catch (error) {
    if (originalPackageJson !== null) {
      await fs.writeFile(PACKAGE_JSON_PATH, originalPackageJson, 'utf8')
    }

    console.error(`Release preparation failed: ${error instanceof Error ? error.message : String(error)}`)
    console.error(usage)
    process.exitCode = 1
  }
}

await main()
