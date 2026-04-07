<script setup lang="ts">
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { ElConfigProvider } from 'element-plus'
import { computed } from 'vue'
import { buildShellStyles, resolveElementSize } from '@/lib/plugin-ui'
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

const elementSize = computed(() => resolveElementSize(props.density))

const classes = computed(() => [
  'halo-plugin-template-admin-shell',
  `halo-plugin-template-admin-shell--${props.audience}`,
  { dark: isDark.value },
])

const styles = computed(() => buildShellStyles(props.accentColor))
</script>

<template>
  <ElConfigProvider :locale="zhCn" :size="elementSize" :z-index="2100">
    <div :class="classes" :style="styles">
      <slot />
    </div>
  </ElConfigProvider>
</template>
