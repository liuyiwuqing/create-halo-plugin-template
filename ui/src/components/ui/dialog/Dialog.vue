<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { t } from '@/i18n'
import { ref, watch } from 'vue'

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
    widthClass: 'max-w-lg',
  },
)

const emit = defineEmits<{
  (event: 'update:open', value: boolean): void
}>()

const visible = ref(false)
const closing = ref(false)

watch(
  () => props.open,
  (val) => {
    if (val) {
      visible.value = true
      closing.value = false
    } else {
      closing.value = true
      setTimeout(() => {
        visible.value = false
        closing.value = false
      }, 150)
    }
  },
  { immediate: true },
)

const close = () => emit('update:open', false)
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed inset-0 z-50">
      <button
        type="button"
        :class="[
          'absolute inset-0 bg-black/80',
          closing ? 'animate-out fade-out-0' : 'animate-in fade-in-0',
        ]"
        :aria-label="t('common.close')"
        @click="close"
      />
      <section
        :class="[
          'fixed left-1/2 top-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg',
          closing ? 'animate-out fade-out-0 zoom-out-95' : 'animate-in fade-in-0 zoom-in-95',
          widthClass,
        ]"
        role="dialog"
        aria-modal="true"
      >
        <div class="flex flex-col space-y-1.5 text-center sm:text-left">
          <h2 class="text-lg font-semibold leading-none tracking-tight">{{ title }}</h2>
          <p v-if="description" class="text-sm text-muted-foreground">
            {{ description }}
          </p>
        </div>
        <slot />
        <button
          type="button"
          class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          :aria-label="t('common.close')"
          @click="close"
        >
          <X class="h-4 w-4" />
        </button>
      </section>
    </div>
  </Teleport>
</template>
