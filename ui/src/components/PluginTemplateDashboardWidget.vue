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

const stats = computed(() => overview.value?.stats?.slice(0, 4) ?? [])

const statColors = ['#fefce8', '#f5f3ff', '#f0fdf4', '#fff1f2']

const openConsole = () => {
  window.location.assign(`/console${overview.value?.consolePath || '/halo-plugin-template'}`)
}

onMounted(load)
</script>

<template>
  <div class="widget">
    <div class="widget-header">
      <div>
        <h3 class="widget-title">模板工作台</h3>
        <p class="widget-desc">直接复用模板默认 API、路由和扩展点，作为新插件的第一块控制台仪表盘。</p>
      </div>
      <ElButton type="primary" plain size="small" @click="openConsole">打开页面</ElButton>
    </div>

    <ElSkeleton :loading="loading" animated :rows="3">
      <template #default>
        <div class="widget-stats">
          <div
            v-for="(item, index) in stats"
            :key="item.key"
            class="stat-card"
            :style="{ background: statColors[index % statColors.length] }"
          >
            <p class="stat-value">{{ item.value }}</p>
            <p class="stat-label">{{ item.label }}</p>
          </div>
        </div>
      </template>
    </ElSkeleton>
  </div>
</template>

<style scoped>
.widget {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
}

.widget-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
}

.widget-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px;
}

.widget-desc {
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
  line-height: 1.5;
}

.widget-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.stat-card {
  border-radius: 10px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 6px;
  line-height: 1;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
}
</style>
