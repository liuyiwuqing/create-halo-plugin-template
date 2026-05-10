<script setup lang="ts">
import { Inbox } from 'lucide-vue-next'
import { t } from '@/i18n'
import { Button } from '@/components/ui/button'

withDefaults(
  defineProps<{
    title?: string
    description?: string
    actionText?: string
  }>(),
  {
    title: '',
    description: '',
    actionText: '',
  },
)

const emit = defineEmits<{
  (event: 'action'): void
}>()
</script>

<template>
  <div class="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-8 text-center">
    <div class="grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
      <Inbox class="h-5 w-5" />
    </div>
    <p class="mt-4 text-sm font-semibold">{{ title || t('common.noData') }}</p>
    <p v-if="description" class="mt-2 max-w-md text-xs text-muted-foreground">{{ description }}</p>
    <Button v-if="actionText" class="mt-4" variant="outline" size="sm" @click="emit('action')">
      {{ actionText }}
    </Button>
  </div>
</template>
