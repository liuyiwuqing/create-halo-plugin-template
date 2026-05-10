<script setup lang="ts">
import { useRouter } from 'vue-router'
import { t } from '@/i18n'
import EmptyState from '@/components/ui/EmptyState.vue'

const router = useRouter()

const backToDashboard = () => {
  if (router.hasRoute('PluginTemplateConsoleDashboard')) {
    router.push({ name: 'PluginTemplateConsoleDashboard' })
    return
  }
  if (router.hasRoute('PluginTemplateUcDashboard')) {
    router.push({ name: 'PluginTemplateUcDashboard' })
  }
}
</script>

<template>
  <EmptyState
    :title="t('notFound.title')"
    :description="t('notFound.description')"
    :action-text="t('notFound.action')"
    @action="backToDashboard"
  />
</template>
