<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { t } from '@/i18n'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
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
const widgetEnabled = ref(true)

onMounted(load)
</script>

<template>
  <div class="flex h-full flex-col gap-4 rounded-xl border border-border/70 bg-card/80 p-4">
    <template v-if="loading">
      <Skeleton class="h-24 rounded-lg" />
      <div class="grid grid-cols-2 gap-3">
        <Skeleton class="h-20 rounded-lg" />
        <Skeleton class="h-20 rounded-lg" />
      </div>
    </template>

    <template v-else>
      <div v-if="primaryStat" class="flex items-start justify-between rounded-lg bg-muted/70 p-5">
        <div>
          <p class="text-3xl font-bold tracking-tight">{{ primaryStat.value }}</p>
          <p class="mt-1 text-sm text-muted-foreground">{{ t('widget.title') }} · {{ primaryStat.label }}</p>
        </div>
        <Switch v-model="widgetEnabled" />
      </div>

      <Separator />

      <div class="grid grid-cols-2 gap-3">
        <div
          v-for="(item, index) in features"
          :key="item.key"
          :class="[
            'rounded-lg border border-border/70 p-3 transition-colors hover:bg-muted/50',
            index === 0 ? 'bg-primary/5' : '',
          ]"
        >
          <p class="text-sm font-medium">{{ item.title }}</p>
          <p class="mt-1 text-xs text-muted-foreground line-clamp-2">{{ item.description }}</p>
        </div>
      </div>
    </template>
  </div>
</template>
