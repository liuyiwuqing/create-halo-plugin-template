<script setup lang="ts">
import {
  IconExternalLinkLine,
  VAlert,
  VButton,
  VCard,
  VDescription,
  VDescriptionItem,
  VEmpty,
  VLoading,
  VPageHeader,
  VTag,
} from '@halo-dev/components'
import { stores, utils } from '@halo-dev/ui-shared'
import { computed, onMounted } from 'vue'
import {
  buildAudienceLabel,
  featureColumns,
  formatCellValue,
  formatChecklistStatus,
  toTagTheme,
} from '@/lib/template'
import { useTemplateOverview } from '@/composables/useTemplateOverview'
import type {
  PluginTemplateChecklistItem,
  PluginTemplateFeatureItem,
  PluginTemplateOverview,
} from '@/types'

const props = defineProps<{
  audience: 'console' | 'uc'
  embedded?: boolean
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

const currentUserStore = stores.currentUser()
const globalInfoStore = stores.globalInfo()

const viewerName = computed(
  () =>
    currentUserStore.currentUser?.user?.spec?.displayName ||
    currentUserStore.currentUser?.user?.metadata?.name ||
    'Halo Developer',
)

const siteTitle = computed(() => globalInfoStore.globalInfo?.siteTitle || 'Halo')
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

const attachmentState = computed(() =>
  overview.value?.enableAttachmentProvider ? '附件已启用' : '附件已关闭',
)
const attachmentTone = computed(() =>
  overview.value?.enableAttachmentProvider ? 'success' : 'warning',
)
const contextItems = computed(() => [
  { label: 'Setting 资源', value: overview.value?.settingName || '—', tone: 'success' },
  { label: 'ConfigMap 资源', value: overview.value?.configMapName || '—', tone: 'success' },
  { label: 'API 输出目录', value: overview.value?.generatedClientPath || '—', tone: 'success' },
  { label: '页面密度', value: densityLabel.value, tone: 'info' },
  {
    label: '附件选择',
    value: attachmentState.value,
    tone: attachmentTone.value,
  },
])

const openExternal = (url: string) => {
  window.open(url, '_blank')
}

const renderFeatureValue = (feature: PluginTemplateFeatureItem, key: string) => {
  if (key === 'enabled') {
    return feature.enabled ? '已启用' : '按需接入'
  }
  return formatCellValue((feature as unknown as Record<string, unknown>)[key])
}

const nextSteps = [
  '通过 npm create halo-plugin-template 或 create-project.mjs 创建项目时，初始化和一致性校验已经自动完成。',
  '只有手工复制模板源码仓库时，才需要额外运行初始化脚本和校验脚本。',
  '新接口补好 Springdoc 后，执行 ./gradlew generateApiClient，再在 ui/src/api/index.ts 暴露新增能力。',
  '按插件实际范围裁剪 UC、附件扩展和工作台部件，避免模板示例残留到正式项目。',
]

onMounted(() => {
  if (shouldLoadSelf.value) {
    void localOverview?.load()
  }
})
</script>

<template>
  <VPageHeader v-if="!embedded" :title="overview?.displayName || 'Halo Plugin Template'">
    <template #actions>
      <VButton class="w-full sm:w-auto" type="secondary" @click="openExternal(rsbuildGuideLink)">
        UI 构建说明
      </VButton>
      <VButton class="w-full sm:w-auto" type="primary" @click="openExternal(supportLink)">
        <template #icon>
          <IconExternalLinkLine />
        </template>
        Halo 插件文档
      </VButton>
    </template>
  </VPageHeader>

  <section :class="embedded ? 'grid gap-3 sm:gap-4' : 'm-0 grid gap-3 sm:gap-4 md:m-4'">
    <VCard>
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div class="grid min-w-0 gap-3">
          <p class="m-0 text-sm font-medium text-gray-500">{{ siteTitle }} · {{ audienceLabel }}</p>
          <p class="m-0 max-w-3xl text-sm leading-7 text-gray-600">
            一份可重复初始化的 Halo 插件 starter，默认接好 Console、UC、扩展点、OpenAPI
            和数据管理示例。
          </p>
          <div class="flex flex-wrap items-center gap-2">
            <VTag class="max-w-full break-all" rounded>当前查看者：{{ viewerName }}</VTag>
            <VTag class="max-w-full break-all" rounded>构建时间：{{ buildTime }}</VTag>
            <VTag class="max-w-full break-all" rounded>路由前缀：{{ currentPath }}</VTag>
          </div>
        </div>
        <div
          v-if="embedded"
          class="grid w-full shrink-0 grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center"
        >
          <VButton
            class="w-full sm:w-auto"
            type="secondary"
            @click="openExternal(rsbuildGuideLink)"
          >
            UI 构建说明
          </VButton>
          <VButton class="w-full sm:w-auto" type="primary" @click="openExternal(supportLink)">
            <template #icon>
              <IconExternalLinkLine />
            </template>
            Halo 插件文档
          </VButton>
        </div>
      </div>
    </VCard>

    <VAlert
      v-if="errorMessage"
      type="warning"
      title="模板概览接口加载失败"
      :description="errorMessage"
    />

    <VCard v-if="loading" class="min-h-44">
      <VLoading />
    </VCard>

    <template v-else-if="overview">
      <section class="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
        <VCard v-for="item in stats" :key="item.key">
          <div class="grid gap-3">
            <div class="flex items-center justify-between gap-3">
              <span class="text-sm font-medium text-gray-600">{{ item.label }}</span>
              <VTag :theme="toTagTheme(item.tone)" rounded>{{ item.tone }}</VTag>
            </div>
            <strong class="text-2xl font-semibold leading-none text-gray-950 sm:text-3xl">{{
              item.value
            }}</strong>
            <p class="m-0 text-sm leading-6 text-gray-500">{{ item.helper }}</p>
          </div>
        </VCard>
      </section>

      <section class="grid grid-cols-1 gap-3 sm:gap-4 xl:grid-cols-2">
        <VCard title="初始化建议">
          <div class="grid gap-3">
            <article
              v-for="item in checklist.slice(0, 3)"
              :key="item.key"
              class="flex flex-col items-start gap-3 rounded border border-gray-200 bg-gray-50 p-3 sm:flex-row sm:justify-between"
            >
              <div class="min-w-0">
                <h3 class="m-0 text-sm font-semibold text-gray-950">{{ item.title }}</h3>
                <p class="m-0 mt-1 text-sm leading-6 text-gray-500">{{ item.description }}</p>
              </div>
              <VTag :theme="toTagTheme(item.status)" rounded>
                {{ formatChecklistStatus(item.status) }}
              </VTag>
            </article>
          </div>
        </VCard>

        <VCard title="当前上下文">
          <VDescription>
            <VDescriptionItem
              v-for="item in contextItems"
              :key="item.label"
              :label="item.label"
              :content="item.value"
            />
          </VDescription>
        </VCard>
      </section>

      <VCard title="功能矩阵" :body-class="['!p-0']">
        <div class="grid gap-3 p-3 md:hidden">
          <article
            v-for="feature in features"
            :key="feature.key"
            class="grid gap-2 rounded border border-gray-200 bg-gray-50 p-3"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <h3 class="m-0 text-sm font-semibold text-gray-950">{{ feature.title }}</h3>
                <p class="m-0 mt-1 text-xs leading-5 text-gray-500">{{ feature.area }}</p>
              </div>
              <VTag :theme="feature.enabled ? 'primary' : 'secondary'" rounded>
                {{ feature.enabled ? '已启用' : '按需接入' }}
              </VTag>
            </div>
            <p class="m-0 text-sm leading-6 text-gray-600">{{ feature.description }}</p>
          </article>
        </div>

        <div class="hidden overflow-x-auto md:block">
          <table class="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr>
                <th
                  v-for="column in featureColumns"
                  :key="String(column.key)"
                  class="border-b border-gray-200 bg-gray-50 px-4 py-3 text-left font-semibold text-gray-600"
                >
                  {{ column.label }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="feature in features" :key="feature.key">
                <td
                  v-for="column in featureColumns"
                  :key="String(column.key)"
                  class="border-b border-gray-100 px-4 py-3 align-top leading-6 text-gray-950"
                >
                  <VTag
                    v-if="column.key === 'enabled'"
                    :theme="feature.enabled ? 'primary' : 'secondary'"
                    rounded
                  >
                    {{ feature.enabled ? '已启用' : '按需接入' }}
                  </VTag>
                  <span v-else>{{ renderFeatureValue(feature, String(column.key)) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </VCard>

      <VCard title="初始化清单">
        <div class="grid gap-3">
          <article
            v-for="item in checklist"
            :key="item.key"
            class="flex flex-col gap-3 rounded border border-gray-200 bg-gray-50 p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div class="min-w-0">
              <h3 class="m-0 text-sm font-semibold text-gray-950">{{ item.title }}</h3>
              <p class="m-0 mt-1 text-sm leading-6 text-gray-500">{{ item.description }}</p>
              <small class="mt-1 inline-block text-xs text-gray-400">{{ item.audience }}</small>
            </div>
            <VTag :theme="toTagTheme(item.status)" rounded>
              {{ formatChecklistStatus(item.status) }}
            </VTag>
          </article>
        </div>
      </VCard>

      <VCard title="下一步">
        <ul class="m-0 grid gap-2 pl-5 text-sm leading-7 text-gray-600">
          <li v-for="step in nextSteps" :key="step">{{ step }}</li>
          <li>
            如需切换到 Rsbuild，可参考
            <button
              type="button"
              class="border-0 bg-transparent p-0 font-semibold text-blue-600 underline underline-offset-4"
              @click="openExternal(rsbuildGuideLink)"
            >
              Halo 官方 UI 构建说明
            </button>
            。
          </li>
        </ul>
      </VCard>
    </template>

    <VEmpty v-else title="暂无模板概览" message="当前接口没有返回可展示的数据。" />
  </section>
</template>
