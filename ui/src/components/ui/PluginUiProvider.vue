<script setup lang="ts">
import { computed } from 'vue'
import { Toaster } from 'vue-sonner'
import { i18n } from '@/i18n'
import type { ThemeMode } from '@/types'

withDefaults(
  defineProps<{
    audience?: 'console' | 'uc'
    themeMode?: ThemeMode
    isDark?: boolean
  }>(),
  {
    audience: 'console',
    themeMode: 'light',
    isDark: false,
  },
)

const locale = computed(() => i18n.global.locale.value)
</script>

<template>
  <div
    :class="['halo-plugin-template-theme halo-plugin-template-admin-shell min-h-full text-foreground antialiased', { dark: isDark }]"
    :data-locale="locale"
    :data-theme="themeMode"
  >
    <Toaster rich-colors close-button position="top-right" />
    <slot />
  </div>
</template>
