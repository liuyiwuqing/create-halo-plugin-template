<script setup lang="ts">
import { LoaderCircle } from 'lucide-vue-next'
import { t } from '@/i18n'

withDefaults(
  defineProps<{
    title?: string
    description?: string
  }>(),
  {
    title: '',
    description: '',
  },
)
</script>

<template>
  <div class="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-border/60 bg-card/70 p-8 text-center">
    <LoaderCircle class="h-8 w-8 animate-spin text-primary" />
    <p class="mt-3 text-sm font-medium">{{ title || t('common.loading') }}</p>
    <p v-if="description" class="mt-1 text-xs text-muted-foreground">{{ description }}</p>
  </div>
</template>
