<script setup lang="ts">
import { LayoutDashboard, List, LogIn } from 'lucide-vue-next'
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { t } from '@/i18n'
import type { BreadcrumbItem, ShellNavItem } from '@/types'
import { useTheme } from '@/lib/theme'
import PluginWorkspaceShell from '@/components/layout/PluginWorkspaceShell.vue'
import PluginUiProvider from '@/components/ui/PluginUiProvider.vue'
import { useLocaleStore } from '@/stores/locale'
import { useThemeStore } from '@/stores/theme'

const props = defineProps<{
  audience: 'console' | 'uc'
}>()

const route = useRoute()
const themeStore = useThemeStore()
const localeStore = useLocaleStore()

themeStore.hydrate()
localeStore.hydrate()

const { mode, isDark } = useTheme()

const basePath = computed(() => {
  const segments = route.path.split('/').filter(Boolean)
  const pluginSegmentIndex = segments.findIndex((segment) => segment === 'halo-plugin-template')
  if (pluginSegmentIndex === -1) return '/halo-plugin-template'
  return `/${segments.slice(0, pluginSegmentIndex + 1).join('/')}`
})

const navItems = computed<ShellNavItem[]>(() => {
  const items: ShellNavItem[] = [
    { key: 'dashboard', label: t('nav.dashboard'), to: `${basePath.value}/dashboard`, icon: LayoutDashboard },
    { key: 'list', label: t('nav.list'), to: `${basePath.value}/list`, icon: List },
    { key: 'loginDemo', label: t('nav.loginDemo'), to: `${basePath.value}/login-demo`, icon: LogIn },
  ]

  return items
})

const currentBreadcrumbLabel = computed(() => {
  const key = route.meta.breadcrumbKey
  if (typeof key === 'string') {
    return t(key)
  }
  const matchedNav = navItems.value.find((item) =>
    route.path === item.to || route.path.startsWith(`${item.to}/`),
  )
  return matchedNav?.label || t('nav.notFound')
})

const breadcrumbs = computed<BreadcrumbItem[]>(() => [
  {
    key: 'workspace',
    label: t('shell.breadcrumbHome'),
    to: `${basePath.value}/dashboard`,
  },
  {
    key: 'current',
    label: currentBreadcrumbLabel.value,
  },
])
</script>

<template>
  <PluginUiProvider :audience="audience" :theme-mode="mode" :is-dark="isDark">
    <PluginWorkspaceShell
      :current-path="route.path"
      :nav-items="navItems"
      :breadcrumbs="breadcrumbs"
    >
      <RouterView />
    </PluginWorkspaceShell>
  </PluginUiProvider>
</template>
