<script setup lang="ts">
import UiStatusPill from './UiStatusPill.vue'

defineProps<{
  label: string
  value: string
  helper: string
  tone?: string
}>()
</script>

<template>
  <article class="halo-plugin-template-admin-stat">
    <p class="halo-plugin-template-admin-stat-label">{{ label }}</p>
    <p class="halo-plugin-template-admin-stat-value">{{ value }}</p>
    <p class="halo-plugin-template-admin-stat-helper">{{ helper }}</p>
    <div style="margin-top: 14px">
      <UiStatusPill :label="label" :tone="tone" />
    </div>
  </article>
</template>
