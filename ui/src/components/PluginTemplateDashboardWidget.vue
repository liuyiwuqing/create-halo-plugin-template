<script setup lang="ts">
import { ElSkeleton, ElSwitch } from 'element-plus'
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

const primaryStat = computed(() => overview.value?.stats?.[0] ?? null)
const features = computed(() => overview.value?.features?.slice(0, 4) ?? [])

const accentCycle = ['#f97316', '#22c55e']

onMounted(load)
</script>

<template>
  <div class="dw">
    <!-- Metric hero -->
    <ElSkeleton :loading="loading" animated :rows="3">
      <template #default>
        <div v-if="primaryStat" class="dw__hero">
          <div class="dw__hero-top">
            <div class="dw__hero-copy">
              <span class="dw__hero-value">{{ primaryStat.value }}</span>
              <span class="dw__hero-label">{{ primaryStat.label }}</span>
            </div>
            <ElSwitch size="small" />
          </div>
        </div>

        <!-- Feature grid -->
        <div class="dw__grid">
          <div
            v-for="(item, index) in features"
            :key="item.key"
            class="dw__card"
            :style="{ '--dw-accent': accentCycle[index % accentCycle.length] }"
          >
            <h4 class="dw__card-title">{{ item.title }}</h4>
            <p class="dw__card-desc">{{ item.description }}</p>
          </div>
        </div>
      </template>
    </ElSkeleton>
  </div>
</template>

<style scoped>
.dw {
  background: #fff;
  border-radius: 14px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── Hero metric ── */
.dw__hero {
  background: #f5f7ff;
  border-radius: 12px;
  padding: 24px 28px 20px;
}

.dw__hero-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.dw__hero-copy {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dw__hero-value {
  font-size: 42px;
  font-weight: 800;
  color: #111827;
  line-height: 1;
  letter-spacing: -0.02em;
}

.dw__hero-label {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
}

/* ── Feature grid ── */
.dw__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.dw__card {
  position: relative;
  padding: 16px 18px 16px 22px;
  background: #fff;
  border-radius: 10px;
  border: 1px solid #f0f0f0;
}

.dw__card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 12px;
  bottom: 12px;
  width: 3px;
  border-radius: 0 2px 2px 0;
  background: var(--dw-accent, #f97316);
}

.dw__card-title {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px;
  line-height: 1.3;
}

.dw__card-desc {
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
  line-height: 1.5;
}
</style>
