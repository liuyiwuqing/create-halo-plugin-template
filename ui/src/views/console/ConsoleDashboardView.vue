<script setup lang="ts">
import PluginTemplateConsoleWorkbench from '@/components/PluginTemplateConsoleWorkbench.vue'
import { useTemplateOverview } from '@/composables/useTemplateOverview'

const { overview, loading, errorMessage, load } = useTemplateOverview('console')

void load()
</script>

<template>
  <div class="halo-plugin-template-page">
    <PluginTemplateConsoleWorkbench
      :overview="overview"
      :overview-loading="loading"
      :overview-error-message="errorMessage"
    />
  </div>
</template>
