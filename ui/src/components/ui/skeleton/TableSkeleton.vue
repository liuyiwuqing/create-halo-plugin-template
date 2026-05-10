<script setup lang="ts">
import Skeleton from './Skeleton.vue'

defineOptions({
  name: 'UiTableSkeleton',
})

withDefaults(
  defineProps<{
    rows?: number
    columns?: number
  }>(),
  {
    rows: 5,
    columns: 6,
  },
)
</script>

<template>
  <div class="w-full">
    <div class="flex items-center gap-4 border-b px-2 py-3">
      <Skeleton v-for="col in columns" :key="`head-${col}`" class="h-3" :class="col === 1 ? 'w-4' : 'flex-1'" />
    </div>
    <div v-for="row in rows" :key="`row-${row}`" class="flex items-center gap-4 border-b px-2 py-3.5">
      <Skeleton v-for="col in columns" :key="`cell-${row}-${col}`" class="h-3" :class="col === 1 ? 'w-4' : 'flex-1'" />
    </div>
  </div>
</template>
