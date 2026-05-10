<script setup lang="ts">
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'

defineProps<{
  title: string
  description?: string
  sticky?: boolean
}>()
</script>

<template>
  <div class="mx-auto max-w-screen-xl px-4 py-6 sm:px-6 lg:px-8">
    <header
      :class="
        cn(
          'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
          sticky && 'sticky top-0 z-40 -mx-4 bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8',
        )
      "
    >
      <div>
        <h1 class="text-2xl font-bold tracking-tight">{{ title }}</h1>
        <p v-if="description" class="mt-1 text-sm text-muted-foreground">
          {{ description }}
        </p>
      </div>
      <div class="flex shrink-0 flex-wrap items-center gap-2">
        <slot name="actions" />
      </div>
    </header>

    <Separator class="my-6" />

    <div class="space-y-6">
      <slot />
    </div>
  </div>
</template>
