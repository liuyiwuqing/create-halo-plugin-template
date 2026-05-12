<script setup lang="ts">
import { VButton, VTag } from '@halo-dev/components'
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
  <div class="halo-plugin-template-attachment halo-plugin-template-admin-attachment-list">
    <article
      v-for="asset in assets"
      :key="asset.id"
      class="halo-plugin-template-admin-attachment-item"
    >
      <div class="halo-plugin-template-admin-attachment-preview">
        <img v-if="asset.id === 'logo'" :src="asset.value" alt="Template asset" />
        <span v-else>DOC</span>
      </div>
      <div class="halo-plugin-template-admin-attachment-copy">
        <h3>{{ asset.title }}</h3>
        <p>{{ asset.description }}</p>
      </div>
      <div class="grid w-full gap-2 sm:flex sm:w-auto sm:justify-end">
        <VTag v-if="isSelected(asset.value)" class="w-fit" theme="primary" rounded>已选择</VTag>
        <VButton
          v-else
          class="w-full sm:w-auto"
          size="sm"
          type="primary"
          @click="selectAsset(asset.value)"
        >
          选择资源
        </VButton>
      </div>
    </article>
  </div>
</template>
