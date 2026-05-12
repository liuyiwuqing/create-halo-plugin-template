<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { templateConsoleApi } from '@/api'
import type { PluginTemplateOverview } from '@/types'
import UiStatusPill from './ui/UiStatusPill.vue'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

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
  <Card class="halo-plugin-template-admin-shell">
    <CardContent class="halo-plugin-template-admin-widget p-5">
      <template v-if="loading">
        <Skeleton class="h-20 w-full" />
        <div class="grid grid-cols-2 gap-3">
          <Skeleton v-for="index in 4" :key="index" class="h-24" />
        </div>
      </template>

      <template v-else>
        <header class="halo-plugin-template-admin-widget-header">
          <div>
            <h3 class="halo-plugin-template-admin-widget-title">模板工作台</h3>
            <p class="halo-plugin-template-admin-widget-description">
              Console、UC、扩展点与 OpenAPI 状态。
            </p>
          </div>
          <UiStatusPill label="Live" tone="success" />
        </header>

        <section v-if="primaryStat" class="rounded-lg bg-muted p-4">
          <p class="m-0 text-sm text-muted-foreground">{{ primaryStat.label }}</p>
          <p class="mt-2 mb-0 text-3xl font-semibold tracking-[-0.04em] text-foreground">
            {{ primaryStat.value }}
          </p>
          <p class="mt-2 mb-0 text-sm leading-6 text-muted-foreground">
            {{ primaryStat.helper }}
          </p>
        </section>

        <div class="halo-plugin-template-admin-widget-stats">
          <article
            v-for="item in features"
            :key="item.key"
            class="halo-plugin-template-admin-widget-stat"
          >
            <h4 class="m-0 text-sm font-semibold text-foreground">{{ item.title }}</h4>
            <p class="mt-2 mb-0 line-clamp-3 text-xs leading-5 text-muted-foreground">
              {{ item.description }}
            </p>
          </article>
        </div>
      </template>
    </CardContent>
  </Card>
</template>
