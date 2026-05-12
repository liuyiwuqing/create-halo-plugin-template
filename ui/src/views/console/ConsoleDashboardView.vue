<script setup lang="ts">
import PluginUiProvider from '@/components/ui/PluginUiProvider.vue'
import PluginTemplateConsoleWorkbench from '@/components/PluginTemplateConsoleWorkbench.vue'
import { useTemplateOverview } from '@/composables/useTemplateOverview'

const { overview, loading, errorMessage, load } = useTemplateOverview('console')

void load()
</script>

<template>
  <PluginUiProvider
    audience="console"
    :density="overview?.density"
    :accent-color="overview?.accentColor"
  >
    <PluginTemplateConsoleWorkbench
      :overview="overview"
      :overview-loading="loading"
      :overview-error-message="errorMessage"
    />
  </PluginUiProvider>
</template>
