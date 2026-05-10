<script setup lang="ts">
defineProps<{
  label: string
  error?: string
}>()
</script>

<template>
  <div class="grid gap-2">
    <label class="text-sm font-medium leading-none">{{ label }}</label>
    <slot />
    <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
  </div>
</template>
