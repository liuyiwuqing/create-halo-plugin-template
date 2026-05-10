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
  <div class="flex flex-col items-center justify-center py-16 text-center">
    <div class="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
      <Inbox class="h-8 w-8 text-muted-foreground" />
    </div>
    <h3 class="mt-4 text-lg font-semibold">{{ title || t('common.noData') }}</h3>
    <p v-if="description" class="mt-2 max-w-sm text-sm text-muted-foreground">{{ description }}</p>
    <Button v-if="actionText" class="mt-6" @click="emit('action')">
      {{ actionText }}
    </Button>
  </div>
</template>
