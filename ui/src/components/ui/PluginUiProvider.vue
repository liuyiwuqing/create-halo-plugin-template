<script setup lang="ts">
import { computed } from 'vue'
import { buildShellStyles, resolveDensityClass } from '@/lib/plugin-ui'
import { useDocumentTheme } from '@/lib/theme'

const props = withDefaults(
  defineProps<{
    audience?: 'console' | 'uc'
    density?: string
    accentColor?: string
  }>(),
  {
    audience: 'console',
    density: 'balanced',
    accentColor: '',
  },
)

const { isDark } = useDocumentTheme()

const classes = computed(() => [
  'halo-plugin-template-admin-shell',
  `halo-plugin-template-admin-shell--${props.audience}`,
  resolveDensityClass(props.density),
  { dark: isDark.value },
])

const styles = computed(() => buildShellStyles(props.accentColor))
</script>

<template>
  <div :class="classes" :style="styles">
    <slot />
  </div>
</template>
