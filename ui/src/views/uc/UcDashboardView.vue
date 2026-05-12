<script setup lang="ts">
import PluginTemplateOverviewPage from '@/components/PluginTemplateOverviewPage.vue'
import { useTemplateOverview } from '@/composables/useTemplateOverview'

const { overview, loading, errorMessage, load } = useTemplateOverview('uc')

void load()
</script>

<template>
  <div class="halo-plugin-template-page">
    <PluginTemplateOverviewPage
      audience="uc"
      :overview="overview"
      :loading="loading"
      :error-message="errorMessage"
    />
  </div>
</template>
