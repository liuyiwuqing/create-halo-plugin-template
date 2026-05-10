<script setup lang="ts">
defineProps<{
  label: string
  error?: string
  helper?: string
}>()
</script>

<template>
  <div class="space-y-2">
    <label class="text-sm font-medium leading-none" :class="{ 'text-destructive': error }">{{ label }}</label>
    <slot />
    <p v-if="helper && !error" class="text-[0.8rem] text-muted-foreground">{{ helper }}</p>
    <p v-if="error" class="text-[0.8rem] font-medium text-destructive">{{ error }}</p>
  </div>
</template>
