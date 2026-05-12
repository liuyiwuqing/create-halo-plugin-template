<script setup lang="ts">
import PluginUiProvider from '@/components/ui/PluginUiProvider.vue'
import PluginTemplateOverviewPage from '@/components/PluginTemplateOverviewPage.vue'
import { useTemplateOverview } from '@/composables/useTemplateOverview'

const { overview, loading, errorMessage, load } = useTemplateOverview('uc')

void load()
</script>

<template>
  <PluginUiProvider
    audience="uc"
    :density="overview?.density"
    :accent-color="overview?.accentColor"
  >
    <PluginTemplateOverviewPage
      audience="uc"
      :overview="overview"
      :loading="loading"
      :error-message="errorMessage"
    />
  </PluginUiProvider>
</template>
