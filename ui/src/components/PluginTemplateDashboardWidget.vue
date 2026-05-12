<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { templateConsoleApi } from '@/api'
import type { PluginTemplateOverview } from '@/types'
import { toTagTheme } from '@/lib/template'
import { VCard, VLoading, VTag } from '@halo-dev/components'

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

onMounted(load)
</script>

<template>
  <VCard class="halo-plugin-template-widget">
    <div class="grid gap-4">
      <VLoading v-if="loading" />

      <template v-else>
        <header
          class="flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-start min-[420px]:justify-between"
        >
          <div class="min-w-0">
            <h3 class="m-0 text-sm font-semibold text-gray-950">模板工作台</h3>
            <p class="m-0 mt-1 text-xs leading-5 text-gray-500">
              Console、UC、扩展点与 OpenAPI 状态。
            </p>
          </div>
          <VTag class="w-fit shrink-0" theme="primary" rounded>Live</VTag>
        </header>

        <section
          v-if="primaryStat"
          class="grid gap-2 rounded border border-gray-200 bg-gray-50 p-4"
        >
          <p class="m-0 text-sm leading-6 text-gray-500">{{ primaryStat.label }}</p>
          <strong class="text-3xl leading-none text-gray-950">{{ primaryStat.value }}</strong>
          <span class="text-sm leading-6 text-gray-500">{{ primaryStat.helper }}</span>
        </section>

        <div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))] gap-3">
          <article
            v-for="item in features"
            :key="item.key"
            class="grid gap-2 rounded border border-gray-200 bg-gray-50 p-3"
          >
            <div class="flex items-start justify-between gap-2">
              <h4 class="m-0 text-sm font-semibold text-gray-950">{{ item.title }}</h4>
              <VTag :theme="toTagTheme(item.enabled ? 'success' : 'info')" rounded>
                {{ item.enabled ? '已启用' : '按需接入' }}
              </VTag>
            </div>
            <p class="m-0 text-xs leading-5 text-gray-500">{{ item.description }}</p>
          </article>
        </div>
      </template>
    </div>
  </VCard>
</template>
