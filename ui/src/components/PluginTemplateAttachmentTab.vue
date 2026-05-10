<script setup lang="ts">
import { t } from '@/i18n'
import { Button } from '@/components/ui/button'
import logoUrl from '@/assets/logo.svg'

const props = withDefaults(
  defineProps<{
    selected?: unknown[]
  }>(),
  {
    selected: () => [],
  },
)

const emit = defineEmits<{
  (event: 'update:selected', attachments: unknown[]): void
}>()

const assets = [
  {
    id: 'logo',
    titleKey: 'attachment.logoTitle',
    descriptionKey: 'attachment.logoDescription',
    value: logoUrl,
  },
  {
    id: 'docs',
    titleKey: 'attachment.docsTitle',
    descriptionKey: 'attachment.docsDescription',
    value: 'https://docs.halo.run/developer-guide/plugin/introduction',
  },
]

const selectAsset = (value: string) => {
  emit('update:selected', [value])
}

const isSelected = (value: string) => props.selected.some((item) => item === value)
</script>

<template>
  <div class="grid gap-3 p-4">
    <div class="mb-1">
      <p class="text-sm font-semibold">{{ t('attachment.title') }}</p>
      <p class="text-xs text-muted-foreground">{{ t('attachment.description') }}</p>
    </div>
    <div
      v-for="asset in assets"
      :key="asset.id"
      class="flex items-center gap-4 rounded-lg border border-border/70 bg-card/80 p-4"
    >
      <div class="grid h-12 w-16 shrink-0 place-items-center rounded-md bg-muted">
        <img v-if="asset.id === 'logo'" :src="asset.value" alt="Template asset" class="h-8 w-8" />
        <span v-else class="text-xs font-bold text-muted-foreground">DOC</span>
      </div>
      <div class="min-w-0 flex-1">
        <p class="font-medium">{{ t(asset.titleKey) }}</p>
        <p class="text-sm text-muted-foreground">{{ t(asset.descriptionKey) }}</p>
      </div>
      <Button
        :variant="isSelected(asset.value) ? 'secondary' : 'outline'"
        size="sm"
        @click="selectAsset(asset.value)"
      >
        {{ isSelected(asset.value) ? t('attachment.selected') : t('attachment.select') }}
      </Button>
    </div>
  </div>
</template>
