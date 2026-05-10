<script setup lang="ts">
import { BarChart3, CheckCircle, Layers, RefreshCw, Settings, ToggleRight } from 'lucide-vue-next'
import { onMounted } from 'vue'
import { t } from '@/i18n'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Skeleton from '@/components/ui/skeleton/Skeleton.vue'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useTemplateOverview } from '@/composables/useTemplateOverview'
import { formatChecklistStatus, toBadgeVariant } from '@/lib/template'

const props = defineProps<{
  audience: 'console' | 'uc'
}>()

const { overview, loading, errorMessage, stats, features, checklist, load } =
  useTemplateOverview(props.audience)

onMounted(load)
</script>

<template>
  <!-- Page Header -->
  <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">{{ t('dashboard.title') }}</h1>
      <p class="mt-1 text-sm text-muted-foreground">{{ t('dashboard.description') }}</p>
    </div>
    <div class="flex items-center gap-2">
      <Button variant="outline" size="sm" :disabled="loading" @click="load">
        <RefreshCw class="mr-2 h-4 w-4" :class="{ 'animate-spin': loading }" />
        {{ t('common.refresh') }}
      </Button>
    </div>
  </div>

  <Alert v-if="errorMessage" variant="destructive" class="mb-4">
    <AlertTitle>{{ t('dashboard.title') }}</AlertTitle>
    <AlertDescription>{{ errorMessage }}</AlertDescription>
  </Alert>

  <!-- Stats Skeleton -->
  <div v-if="loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <Card v-for="i in 4" :key="i">
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton class="h-4 w-20" />
        <Skeleton class="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton class="h-8 w-16" />
        <Skeleton class="mt-2 h-3 w-32" />
      </CardContent>
    </Card>
  </div>

  <template v-else>
    <!-- Stats Cards -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card v-for="(item, index) in stats" :key="item.key">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">{{ item.label }}</CardTitle>
          <component
            :is="[Layers, ToggleRight, CheckCircle, BarChart3][index] || Layers"
            class="h-4 w-4 text-muted-foreground"
          />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ item.value }}</div>
          <p v-if="item.helper" class="text-xs text-muted-foreground">
            {{ item.helper }}
          </p>
        </CardContent>
      </Card>
    </div>

    <!-- Feature & Checklist -->
    <div class="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-7">
      <Card class="lg:col-span-4">
        <CardHeader>
          <CardTitle class="text-base">{{ t('dashboard.features.title') }}</CardTitle>
          <CardDescription>{{ t('dashboard.features.description') }}</CardDescription>
        </CardHeader>
        <CardContent class="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{{ t('dashboard.features.name') }}</TableHead>
                <TableHead>{{ t('dashboard.features.area') }}</TableHead>
                <TableHead class="text-right">{{ t('dashboard.features.status') }}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="item in features" :key="item.key">
                <TableCell class="font-medium">{{ item.title }}</TableCell>
                <TableCell class="text-muted-foreground">{{ item.area }}</TableCell>
                <TableCell class="text-right">
                  <Badge :variant="item.enabled ? 'default' : 'secondary'">
                    {{ item.enabled ? t('common.enabled') : t('common.disabled') }}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div class="lg:col-span-3 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle class="text-base">{{ t('dashboard.checklist.title') }}</CardTitle>
            <CardDescription>{{ t('dashboard.checklist.description') }}</CardDescription>
          </CardHeader>
          <CardContent class="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{{ t('dashboard.checklist.task') }}</TableHead>
                  <TableHead class="text-right">{{ t('dashboard.checklist.status') }}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="item in checklist" :key="item.key">
                  <TableCell class="font-medium">{{ item.title }}</TableCell>
                  <TableCell class="text-right">
                    <Badge :variant="toBadgeVariant(item.status)">
                      {{ formatChecklistStatus(item.status) }}
                    </Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <!-- Runtime Context -->
        <Card>
          <CardHeader class="pb-2">
            <div class="flex items-center gap-2">
              <Settings class="h-4 w-4 text-muted-foreground" />
              <CardTitle class="text-base">{{ t('dashboard.context.title') }}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">{{ t('dashboard.context.settingName') }}</span>
                <span class="font-mono">{{ overview?.settingName || '—' }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">{{ t('dashboard.context.configMapName') }}</span>
                <span class="font-mono">{{ overview?.configMapName || '—' }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">{{ t('dashboard.context.outputPath') }}</span>
                <span class="font-mono">{{ overview?.generatedClientPath || '—' }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">{{ t('dashboard.context.routePrefix') }}</span>
                <span class="font-mono">{{ overview?.consolePath || '/halo-plugin-template' }}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </template>
</template>
