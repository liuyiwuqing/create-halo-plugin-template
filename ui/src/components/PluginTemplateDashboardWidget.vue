<script setup lang="ts">
import { ElButton, ElSkeleton } from 'element-plus'
import { computed, onMounted, ref } from 'vue'
import { templateConsoleApi } from '@/api'
import type { PluginTemplateOverview } from '@/types'

const loading = ref(true)
const overview = ref<PluginTemplateOverview | null>(null)

const load = async () => {
  loading.value = true
  try {
    overview.value = await templateConsoleApi.getOverview()
  } finally {
    loading.value = false
  }
}

const stats = computed(() => overview.value?.stats?.slice(0, 2) ?? [])

const openConsole = () => {
  window.location.assign(`/console${overview.value?.consolePath || '/halo-plugin-template'}`)
}

onMounted(load)
</script>

<template>
  <div class="halo-plugin-template-admin-widget">
    <div class="halo-plugin-template-admin-widget-header">
      <div>
        <h3 class="halo-plugin-template-admin-widget-title">模板工作台</h3>
        <p class="halo-plugin-template-admin-widget-description">
          直接复用模板默认 API、路由和扩展点，作为新插件的第一块控制台仪表盘。
        </p>
      </div>
      <ElButton type="primary" plain @click="openConsole">
        打开页面
      </ElButton>
    </div>

    <ElSkeleton :loading="loading" animated :rows="3">
      <template #default>
        <div class="halo-plugin-template-admin-widget-stats">
          <div
            v-for="item in stats"
            :key="item.key"
            class="halo-plugin-template-admin-widget-stat"
          >
            <p class="halo-plugin-template-admin-stat-label">{{ item.label }}</p>
            <p class="halo-plugin-template-admin-card-title" style="margin-top: 6px">
              {{ item.value }}
            </p>
            <p class="halo-plugin-template-admin-card-description" style="margin-top: 8px">
              {{ item.helper }}
            </p>
          </div>
        </div>
      </template>
    </ElSkeleton>
  </div>
</template>
