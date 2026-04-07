#!/usr/bin/env node

import path from 'node:path'
import process from 'node:process'
import { spawn } from 'node:child_process'

const ROOT = process.cwd()

const usage = `
Usage:
  node scripts/publish-check.mjs
  node scripts/publish-check.mjs --pack-only
  node scripts/publish-check.mjs --skip-build
`.trim()

const parseArgs = (argv) => {
  const options = {
    packOnly: false,
    skipBuild: false,
    help: false,
  }

  for (const token of argv) {
    if (token === '--help' || token === '-h') {
      options.help = true
      continue
    }
    if (token === '--pack-only') {
      options.packOnly = true
      continue
    }
    if (token === '--skip-build') {
      options.skipBuild = true
      continue
    }
    throw new Error(`Unknown argument: ${token}`)
  }

  return options
}

const runCommand = async (command, args, cwd = ROOT, env = process.env) => {
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      env,
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

const main = async () => {
  try {
    const options = parseArgs(process.argv.slice(2))

    if (options.help) {
      console.log(usage)
      return
    }

    const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'
    const pnpmCommand = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'
    const gradleCommand = process.platform === 'win32' ? 'gradlew.bat' : './gradlew'
    const npmEnv = {
      ...process.env,
      npm_config_cache: path.join(ROOT, '.npm-cache'),
    }

    if (!options.packOnly) {
      await runCommand(process.execPath, [path.join('scripts', 'verify-template.mjs')])
      await runCommand(pnpmCommand, ['install', '--dir', 'ui', '--frozen-lockfile'])
      await runCommand(pnpmCommand, ['verify'], path.join(ROOT, 'ui'))

      if (!options.skipBuild) {
        await runCommand(gradleCommand, ['build'])
      }
    }

    await runCommand(npmCommand, ['pack', '--dry-run'], ROOT, npmEnv)
  } catch (error) {
    console.error(`Publish check failed: ${error instanceof Error ? error.message : String(error)}`)
    console.error(usage)
    process.exitCode = 1
  }
}

await main()
