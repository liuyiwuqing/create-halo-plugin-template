<script setup lang="ts">
import { stores, utils } from '@halo-dev/ui-shared'
import { ExternalLink } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'
import {
  buildAudienceLabel,
  checklistColumns,
  featureColumns,
  formatChecklistStatus,
} from '@/lib/template'
import { useTemplateOverview } from '@/composables/useTemplateOverview'
import type { PluginTemplateOverview } from '@/types'
import DataTableView from './ui/DataTableView.vue'
import UiMetricCard from './ui/UiMetricCard.vue'
import UiSectionCard from './ui/UiSectionCard.vue'
import UiStatusPill from './ui/UiStatusPill.vue'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const props = defineProps<{
  audience: 'console' | 'uc'
  overview?: PluginTemplateOverview | null
  loading?: boolean
  errorMessage?: string
}>()

const shouldLoadSelf = computed(() => props.overview === undefined)
const localOverview = shouldLoadSelf.value ? useTemplateOverview(props.audience) : undefined
const overview = computed(() => props.overview ?? localOverview?.overview.value ?? null)
const loading = computed(() => props.loading ?? localOverview?.loading.value ?? false)
const errorMessage = computed(() => props.errorMessage ?? localOverview?.errorMessage.value ?? '')
const stats = computed(() => overview.value?.stats ?? [])
const features = computed(() => overview.value?.features ?? [])
const checklist = computed(() => overview.value?.checklist ?? [])

const { currentUser } = storeToRefs(stores.currentUser())
const { globalInfo } = storeToRefs(stores.globalInfo())

const viewerName = computed(
  () =>
    currentUser.value?.user?.spec?.displayName ||
    currentUser.value?.user?.metadata?.name ||
    'Halo Developer',
)

const siteTitle = computed(() => globalInfo.value?.siteTitle || 'Halo')
const buildTime = computed(() => utils.date.format(new Date(), 'YYYY-MM-DD HH:mm'))
const audienceLabel = computed(() => buildAudienceLabel(props.audience))
const rsbuildGuideLink = 'https://docs.halo.run/developer-guide/plugin/basics/ui/build'
const currentPath = computed(() =>
  props.audience === 'console'
    ? overview.value?.consolePath || '/halo-plugin-template'
    : overview.value?.ucPath || '/halo-plugin-template',
)
const supportLink = computed(
  () => overview.value?.supportLink || 'https://docs.halo.run/developer-guide/plugin/introduction',
)
const densityLabel = computed(() => {
  if (overview.value?.density === 'compact') {
    return '紧凑'
  }
  if (overview.value?.density === 'relaxed') {
    return '宽松'
  }
  return '平衡'
})

const openExternal = (url: string) => {
  window.open(url, '_blank')
}

const densityTone = computed(() => overview.value?.density || 'balanced')
const attachmentState = computed(() =>
  overview.value?.enableAttachmentProvider ? '附件已启用' : '附件已关闭',
)
const attachmentTone = computed(() =>
  overview.value?.enableAttachmentProvider ? 'success' : 'warning',
)

onMounted(() => {
  if (shouldLoadSelf.value) {
    void localOverview?.load()
  }
})
</script>

<template>
  <section class="halo-plugin-template-admin-page">
    <header class="halo-plugin-template-page-header">
      <div class="halo-plugin-template-page-header__copy">
        <p class="halo-plugin-template-page-header__eyebrow">{{ siteTitle }} · {{ audienceLabel }}</p>
        <h1 class="halo-plugin-template-page-header__title">
          {{ overview?.displayName || 'Halo Plugin Template' }}
        </h1>
        <p class="halo-plugin-template-page-header__description">
          一份可重复初始化的 Halo 插件 starter，默认接好 Console、UC、扩展点、OpenAPI
          和数据管理示例。
        </p>
        <div class="halo-plugin-template-meta-row">
          <span class="halo-plugin-template-meta-pill">当前查看者：{{ viewerName }}</span>
          <span class="halo-plugin-template-meta-pill">构建时间：{{ buildTime }}</span>
          <span class="halo-plugin-template-meta-pill">路由前缀：{{ currentPath }}</span>
        </div>
      </div>

      <div class="halo-plugin-template-page-header__actions">
        <Button @click="openExternal(supportLink)">
          Halo 插件文档
          <ExternalLink />
        </Button>
        <Button variant="outline" @click="openExternal(rsbuildGuideLink)">
          UI 构建说明
        </Button>
      </div>
    </header>

    <Alert v-if="errorMessage" variant="warning">
      <AlertTitle>模板概览接口加载失败</AlertTitle>
      <AlertDescription>{{ errorMessage }}</AlertDescription>
    </Alert>

    <div v-if="loading" class="grid gap-4">
      <div class="halo-plugin-template-admin-stats">
        <Skeleton v-for="index in 3" :key="index" class="h-32" />
      </div>
      <Skeleton class="h-64" />
      <Skeleton class="h-64" />
    </div>

    <template v-else>
      <div class="halo-plugin-template-admin-stats">
        <UiMetricCard
          v-for="item in stats"
          :key="item.key"
          :label="item.label"
          :value="item.value"
          :helper="item.helper"
          :tone="item.tone"
        />
      </div>

      <section class="halo-plugin-template-admin-grid">
        <UiSectionCard
          title="初始化建议"
          description="把模板默认值替换干净，再继续堆业务代码。"
        >
          <div class="halo-plugin-template-admin-checklist">
            <article
              v-for="item in checklist.slice(0, 3)"
              :key="item.key"
              class="halo-plugin-template-admin-checklist-item"
            >
              <div class="halo-plugin-template-admin-checklist-copy">
                <h3 class="halo-plugin-template-admin-checklist-title">{{ item.title }}</h3>
                <p class="halo-plugin-template-admin-checklist-description">
                  {{ item.description }}
                </p>
              </div>
              <UiStatusPill :label="formatChecklistStatus(item.status)" :tone="item.status" />
            </article>
          </div>
        </UiSectionCard>

        <UiSectionCard
          title="当前上下文"
          description="这些值用于确认模板是否已被成功初始化。"
        >
          <div class="halo-plugin-template-admin-kpis">
            <div class="halo-plugin-template-admin-checklist-item">
              <div class="halo-plugin-template-admin-checklist-copy">
                <h3 class="halo-plugin-template-admin-checklist-title">Setting 资源</h3>
                <p class="halo-plugin-template-admin-checklist-description">
                  {{ overview?.settingName }}
                </p>
              </div>
              <UiStatusPill label="已接线" tone="success" />
            </div>
            <div class="halo-plugin-template-admin-checklist-item">
              <div class="halo-plugin-template-admin-checklist-copy">
                <h3 class="halo-plugin-template-admin-checklist-title">ConfigMap 资源</h3>
                <p class="halo-plugin-template-admin-checklist-description">
                  {{ overview?.configMapName }}
                </p>
              </div>
              <UiStatusPill label="已接线" tone="success" />
            </div>
            <div class="halo-plugin-template-admin-checklist-item">
              <div class="halo-plugin-template-admin-checklist-copy">
                <h3 class="halo-plugin-template-admin-checklist-title">API 输出目录</h3>
                <p class="halo-plugin-template-admin-checklist-description">
                  {{ overview?.generatedClientPath }}
                </p>
              </div>
              <UiStatusPill label="已接线" tone="success" />
            </div>
            <div class="halo-plugin-template-admin-checklist-item">
              <div class="halo-plugin-template-admin-checklist-copy">
                <h3 class="halo-plugin-template-admin-checklist-title">页面密度</h3>
                <p class="halo-plugin-template-admin-checklist-description">{{ densityLabel }}</p>
              </div>
              <UiStatusPill :label="densityTone" tone="info" />
            </div>
            <div class="halo-plugin-template-admin-checklist-item">
              <div class="halo-plugin-template-admin-checklist-copy">
                <h3 class="halo-plugin-template-admin-checklist-title">主色</h3>
                <p class="halo-plugin-template-admin-checklist-description">
                  {{ overview?.accentColor || '#111111' }}
                </p>
              </div>
              <UiStatusPill :label="attachmentState" :tone="attachmentTone" />
            </div>
          </div>
        </UiSectionCard>
      </section>

      <UiSectionCard
        title="功能矩阵"
        description="列出模板默认预置的前后端能力，初始化后可以按需删减。"
      >
        <DataTableView
          :rows="features"
          :columns="featureColumns"
          empty-description="暂无功能矩阵"
          mobile-title-key="title"
          mobile-description-key="description"
        >
          <template #cell-enabled="{ value }">
            <UiStatusPill
              :label="value ? '已启用' : '按需接入'"
              :tone="value ? 'success' : 'info'"
            />
          </template>
        </DataTableView>
      </UiSectionCard>

      <UiSectionCard
        title="初始化清单"
        description="前端和后端都通过统一清单推进，避免漏掉 settings、角色模板和 API 包装层。"
      >
        <DataTableView
          :rows="checklist"
          :columns="checklistColumns"
          empty-description="暂无初始化清单"
          mobile-title-key="title"
          mobile-description-key="description"
        >
          <template #cell-status="{ value }">
            <UiStatusPill :label="formatChecklistStatus(String(value))" :tone="String(value)" />
          </template>
        </DataTableView>
      </UiSectionCard>

      <UiSectionCard
        title="下一步"
        description="模板的真实价值在于后续多个插件项目都沿用同一套工程边界。"
      >
        <ul class="m-0 grid gap-3 pl-5 text-sm leading-7 text-muted-foreground">
          <li>
            通过 `npm create halo-plugin-template` 或 `create-project.mjs` 创建项目时，初始化和一致性校验已经自动完成。
          </li>
          <li>只有手工复制模板源码仓库时，才需要额外运行初始化脚本和校验脚本。</li>
          <li>
            新接口补好 Springdoc 后，执行 `./gradlew generateApiClient`，再在
            `ui/src/api/index.ts` 暴露新增能力。
          </li>
          <li>按插件实际范围裁剪 UC、附件扩展和工作台部件，避免模板示例残留到正式项目。</li>
          <li>
            如需切换到 Rsbuild，可参考
            <button
              class="font-medium text-foreground underline underline-offset-4"
              type="button"
              @click="openExternal(rsbuildGuideLink)"
            >
              Halo 官方 UI 构建说明
            </button>
            。
          </li>
        </ul>
      </UiSectionCard>
    </template>
  </section>
</template>
