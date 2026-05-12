<script setup lang="ts">
import UiStatusPill from './UiStatusPill.vue'
import { Card, CardContent } from '@/components/ui/card'

defineProps<{
  label: string
  value: string
  helper: string
  tone?: string
}>()
</script>

<template>
  <Card>
    <CardContent class="grid gap-3 p-5">
      <div class="flex items-start justify-between gap-3">
        <p class="m-0 text-sm font-medium text-muted-foreground">{{ label }}</p>
        <UiStatusPill :label="label" :tone="tone" />
      </div>
      <p class="m-0 text-3xl font-semibold leading-none tracking-[-0.04em] text-foreground">
        {{ value }}
      </p>
      <p class="m-0 text-sm leading-6 text-muted-foreground">
        {{ helper }}
      </p>
    </CardContent>
  </Card>
</template>
