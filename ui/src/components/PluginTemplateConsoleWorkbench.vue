<script setup lang="ts">
import type { PluginTemplateOverview } from '@/types'
import PluginTemplateOverviewPage from './PluginTemplateOverviewPage.vue'
import RecordManagerView from '@/views/console/RecordManagerView.vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

defineProps<{
  overview?: PluginTemplateOverview | null
  overviewLoading?: boolean
  overviewErrorMessage?: string
}>()

const tabs = [
  { id: 'overview', label: '模板概览' },
  { id: 'record-manager', label: '示例数据管理' },
]

const defaultTab = tabs[0].id
</script>

<template>
  <section class="template-workbench">
    <Tabs :default-value="defaultTab" class="template-workbench__tabs">
      <TabsList class="template-workbench__tabs-list">
        <TabsTrigger v-for="tab in tabs" :key="tab.id" :value="tab.id">
          {{ tab.label }}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" class="template-workbench__body">
      <PluginTemplateOverviewPage
        audience="console"
        :overview="overview"
        :loading="overviewLoading"
        :error-message="overviewErrorMessage"
      />
      </TabsContent>
      <TabsContent value="record-manager" class="template-workbench__body">
        <RecordManagerView />
      </TabsContent>
    </Tabs>
  </section>
</template>

<style scoped>
.template-workbench {
  min-height: calc(100vh - 72px);
  padding: 18px;
  background: var(--halo-plugin-template-page-bg);
}

.template-workbench__tabs {
  display: grid;
  gap: 16px;
}

.template-workbench__tabs-list {
  width: max-content;
  max-width: 100%;
  overflow-x: auto;
  border: 1px solid var(--border);
  background: var(--muted);
}

.template-workbench__body {
  margin: 0;
}

@media (max-width: 768px) {
  .template-workbench {
    min-height: calc(100vh - 56px);
    padding: 10px;
  }

  .template-workbench__tabs-list {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
