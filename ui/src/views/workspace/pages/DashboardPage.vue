<script setup lang="ts">
import { RefreshCw } from 'lucide-vue-next'
import { onMounted } from 'vue'
import { t } from '@/i18n'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import GlobalLoading from '@/components/ui/GlobalLoading.vue'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import PageHeader from '@/components/layout/PageHeader.vue'
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
  <PageHeader :title="t('dashboard.title')" :description="t('dashboard.description')">
    <template #actions>
      <Button variant="outline" size="sm" :disabled="loading" @click="load">
        <RefreshCw class="mr-2 h-4 w-4" :class="{ 'animate-spin': loading }" />
        {{ t('common.refresh') }}
      </Button>
    </template>
  </PageHeader>

  <Alert v-if="errorMessage" variant="destructive" class="mb-4">
    <AlertTitle>{{ t('dashboard.title') }}</AlertTitle>
    <AlertDescription>{{ errorMessage }}</AlertDescription>
  </Alert>

  <template v-if="loading">
    <GlobalLoading :description="t('widget.loading')" />
  </template>

  <template v-else>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card v-for="item in stats" :key="item.key" class="border-border/70 bg-card/80">
        <CardHeader class="pb-2">
          <CardDescription>{{ item.label }}</CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-3xl font-semibold">{{ item.value }}</p>
          <p v-if="item.helper" class="mt-1 text-xs text-muted-foreground">
            {{ item.helper }}
          </p>
        </CardContent>
      </Card>
    </div>

    <div class="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
      <Card class="border-border/70">
        <CardHeader>
          <CardTitle>{{ t('dashboard.features.title') }}</CardTitle>
          <CardDescription>{{ t('dashboard.features.description') }}</CardDescription>
        </CardHeader>
        <CardContent>
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
                <TableCell>{{ item.area }}</TableCell>
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

      <Card class="border-border/70">
        <CardHeader>
          <CardTitle>{{ t('dashboard.checklist.title') }}</CardTitle>
          <CardDescription>{{ t('dashboard.checklist.description') }}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{{ t('dashboard.checklist.task') }}</TableHead>
                <TableHead>{{ t('dashboard.checklist.audience') }}</TableHead>
                <TableHead class="text-right">{{ t('dashboard.checklist.status') }}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="item in checklist" :key="item.key">
                <TableCell class="font-medium">{{ item.title }}</TableCell>
                <TableCell>{{ item.audience }}</TableCell>
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
    </div>

    <Card class="mt-4 border-border/70">
      <CardHeader>
        <CardTitle>{{ t('dashboard.context.title') }}</CardTitle>
        <CardDescription>{{ t('dashboard.context.description') }}</CardDescription>
      </CardHeader>
      <CardContent>
        <dl class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt class="text-muted-foreground">{{ t('dashboard.context.settingName') }}</dt>
            <dd class="mt-1 font-medium">{{ overview?.settingName || '—' }}</dd>
          </div>
          <div>
            <dt class="text-muted-foreground">{{ t('dashboard.context.configMapName') }}</dt>
            <dd class="mt-1 font-medium">{{ overview?.configMapName || '—' }}</dd>
          </div>
          <div>
            <dt class="text-muted-foreground">{{ t('dashboard.context.outputPath') }}</dt>
            <dd class="mt-1 font-medium">{{ overview?.generatedClientPath || '—' }}</dd>
          </div>
          <div>
            <dt class="text-muted-foreground">{{ t('dashboard.context.routePrefix') }}</dt>
            <dd class="mt-1 font-medium">{{ overview?.consolePath || '/halo-plugin-template' }}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  </template>
</template>
