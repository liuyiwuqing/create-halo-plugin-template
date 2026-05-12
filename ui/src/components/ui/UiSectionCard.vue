<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <Card>
    <CardHeader class="flex flex-row items-start justify-between gap-4 p-5">
      <div>
        <CardTitle>{{ title }}</CardTitle>
        <CardDescription v-if="description" class="mt-2 leading-6">
          {{ description }}
        </CardDescription>
      </div>
      <slot name="actions" />
    </CardHeader>
    <CardContent class="px-5 pb-5">
      <slot />
    </CardContent>
  </Card>
</template>
