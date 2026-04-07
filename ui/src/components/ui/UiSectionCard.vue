<script setup lang="ts">
import { ElCard } from 'element-plus'

defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <ElCard class="halo-plugin-template-admin-surface" shadow="never">
    <div class="halo-plugin-template-admin-card-header">
      <div>
        <h2 class="halo-plugin-template-admin-card-title">{{ title }}</h2>
        <p v-if="description" class="halo-plugin-template-admin-card-description">
          {{ description }}
        </p>
      </div>
      <slot name="actions" />
    </div>
    <div style="margin-top: 20px">
      <slot />
    </div>
  </ElCard>
</template>
