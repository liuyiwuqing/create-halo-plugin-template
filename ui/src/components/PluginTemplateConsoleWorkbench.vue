<script setup lang="ts">
import { ref } from 'vue'
import {
  IconExternalLinkLine,
  IconPlug,
  VButton,
  VCard,
  VPageHeader,
  VTabbar,
} from '@halo-dev/components'
import type { PluginTemplateOverview } from '@/types'
import PluginTemplateOverviewPage from './PluginTemplateOverviewPage.vue'
import RecordManagerView from '@/views/console/RecordManagerView.vue'

defineProps<{
  overview?: PluginTemplateOverview | null
  overviewLoading?: boolean
  overviewErrorMessage?: string
}>()

const tabs = [
  { id: 'overview', label: '模板概览' },
  { id: 'record-manager', label: '示例数据管理' },
]

const activeTab = ref(tabs[0].id)
const openPluginGuide = () => {
  window.open('https://docs.halo.run/developer-guide/plugin/introduction', '_blank')
}
</script>

<template>
  <VPageHeader :title="overview?.displayName || 'Halo Plugin Template'">
    <template #icon>
      <IconPlug />
    </template>
    <template #actions>
      <VButton class="w-full sm:w-auto" type="secondary" @click="openPluginGuide">
        <template #icon>
          <IconExternalLinkLine />
        </template>
        Halo 插件文档
      </VButton>
    </template>
  </VPageHeader>

  <div class="m-0 grid gap-4 md:m-4">
    <VCard :body-class="['!p-0', '!overflow-visible']">
      <template #header>
        <VTabbar
          v-model:active-id="activeTab"
          :items="tabs"
          class="w-full overflow-x-auto !rounded-none"
          type="outline"
        />
      </template>

      <div v-if="activeTab === 'overview'" class="rounded-b-base bg-white p-3 sm:p-4">
        <PluginTemplateOverviewPage
          audience="console"
          embedded
          :overview="overview"
          :loading="overviewLoading"
          :error-message="overviewErrorMessage"
        />
      </div>
    </VCard>

    <RecordManagerView v-if="activeTab === 'record-manager'" embedded />
  </div>
</template>
