<script setup lang="ts">
import logoUrl from '@/assets/logo.svg'
import { Button } from '@/components/ui/button'
import UiStatusPill from './ui/UiStatusPill.vue'

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
    title: '模板 Logo',
    description: '用作后台菜单图标、空状态或品牌占位。',
    value: logoUrl,
  },
  {
    id: 'docs',
    title: '开发文档',
    description: '示例外链资源，也可以替换成素材库或 CDN 地址。',
    value: 'https://docs.halo.run/developer-guide/plugin/introduction',
  },
]

const selectAsset = (value: string) => {
  emit('update:selected', [value])
}

const isSelected = (value: string) => props.selected.some((item) => item === value)
</script>

<template>
  <div class="halo-plugin-template-admin-shell halo-plugin-template-admin-attachment-list">
    <article
      v-for="asset in assets"
      :key="asset.id"
      class="halo-plugin-template-admin-attachment-item"
    >
      <div class="halo-plugin-template-admin-attachment-preview">
        <img v-if="asset.id === 'logo'" :src="asset.value" alt="Template asset" />
        <span v-else>DOC</span>
      </div>
      <div>
        <h3 class="m-0 text-sm font-semibold text-foreground">
          {{ asset.title }}
        </h3>
        <p class="mt-1 mb-0 text-sm leading-6 text-muted-foreground">
          {{ asset.description }}
        </p>
      </div>
      <div>
        <UiStatusPill v-if="isSelected(asset.value)" label="已选择" tone="success" />
        <Button v-else size="sm" @click="selectAsset(asset.value)">
          {{ isSelected(asset.value) ? '已选择' : '选择资源' }}
        </Button>
      </div>
    </article>
  </div>
</template>
