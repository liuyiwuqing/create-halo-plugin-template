import { fileURLToPath, URL } from 'url'

import { viteConfig } from '@halo-dev/ui-plugin-bundler-kit'
import tailwindcss from '@tailwindcss/vite'
import Icons from 'unplugin-icons/vite'
import type { Plugin } from 'vite'
import { configDefaults } from 'vitest/config'

const PLUGIN_UI_SCOPE = [
  '.halo-plugin-template-admin-shell',
  '.halo-plugin-template-floating-surface',
  '.halo-plugin-template-dialog-overlay',
].join(',')

const SCOPED_TAILWIND_PROPERTY_SELECTOR = [
  `:is(${PLUGIN_UI_SCOPE})`,
  `:is(${PLUGIN_UI_SCOPE}) *`,
  `:is(${PLUGIN_UI_SCOPE})::before`,
  `:is(${PLUGIN_UI_SCOPE}) *::before`,
  `:is(${PLUGIN_UI_SCOPE})::after`,
  `:is(${PLUGIN_UI_SCOPE}) *::after`,
  '.halo-plugin-template-dialog-overlay::backdrop',
].join(',')

const TAILWIND_SCOPE_SELECTOR = `:is(${PLUGIN_UI_SCOPE})`
const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const scopedUtilitySelectorPattern = new RegExp(
  `${escapeRegExp(TAILWIND_SCOPE_SELECTOR)} (\\.[^{,]+)`,
  'g',
)

const scopeTailwindRuntimeCss = (css: string) =>
  css
    .replace(/@property\s+--tw-[^{]+\{[^{}]*\}/g, '')
    .replace(/\*,\s*::?before,\s*::?after,\s*::backdrop/g, SCOPED_TAILWIND_PROPERTY_SELECTOR)
    .replace(scopedUtilitySelectorPattern, (match, utilitySelector: string, offset: number, source: string) => {
      const sameElementSelector = `${TAILWIND_SCOPE_SELECTOR}${utilitySelector}`
      const precedingSelector = source.slice(
        Math.max(0, offset - sameElementSelector.length - 1),
        offset,
      )

      if (precedingSelector.includes(sameElementSelector)) {
        return match
      }

      return `${sameElementSelector},${match}`
    })

const scopeTailwindRuntimePlugin = (): Plugin => ({
  name: 'halo-plugin-template-scope-tailwind-runtime-css',
  enforce: 'post',
  transform(code, id) {
    if (!id.includes('.css')) {
      return null
    }

    const scoped = scopeTailwindRuntimeCss(code)
    return scoped === code ? null : { code: scoped, map: null }
  },
  generateBundle(_, bundle) {
    for (const asset of Object.values(bundle)) {
      if (asset.type !== 'asset' || !asset.fileName.endsWith('.css')) {
        continue
      }

      if (typeof asset.source === 'string') {
        asset.source = scopeTailwindRuntimeCss(asset.source)
      }
    }
  },
})

// For more info,
// please see https://github.com/halo-dev/halo/tree/main/ui/packages/ui-plugin-bundler-kit
export default viteConfig({
  vite: {
    plugins: [tailwindcss(), scopeTailwindRuntimePlugin(), Icons({ compiler: 'vue3' })],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },

    // If you don't use Vitest, you can remove the following configuration
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
    },
  },
})
