<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

defineOptions({
  name: 'UiDialog',
})

const props = withDefaults(
  defineProps<{
    open: boolean
    title: string
    description?: string
    widthClass?: string
  }>(),
  {
    description: '',
    widthClass: 'max-w-xl',
  },
)

const emit = defineEmits<{
  (event: 'update:open', value: boolean): void
}>()

const close = () => emit('update:open', false)
</script>

<template>
  <Teleport to="body">
    <div v-if="props.open" class="fixed inset-0 z-[2100]">
      <button
        type="button"
        class="absolute inset-0 bg-background/80 backdrop-blur-sm"
        aria-label="关闭弹窗"
        @click="close"
      />
      <section
        :class="[
          'fixed left-1/2 top-1/2 w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-card p-6 text-card-foreground shadow-lg',
          widthClass,
        ]"
        role="dialog"
        aria-modal="true"
      >
        <div class="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 class="text-lg font-semibold leading-none">{{ title }}</h2>
            <p v-if="description" class="mt-2 text-sm text-muted-foreground">
              {{ description }}
            </p>
          </div>
          <Button variant="ghost" size="icon" aria-label="关闭弹窗" @click="close">
            <X class="h-4 w-4" />
          </Button>
        </div>
        <slot />
      </section>
    </div>
  </Teleport>
</template>
