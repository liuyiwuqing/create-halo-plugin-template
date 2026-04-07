<script setup lang="ts">
import { stores, utils } from '@halo-dev/ui-shared'
import { ElAlert, ElButton, ElLink, ElSkeleton } from 'element-plus'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'
import { buildAudienceLabel, checklistColumns, featureColumns } from '@/lib/template'
import { useTemplateOverview } from '@/composables/useTemplateOverview'
import PluginTemplateCommonTable from './PluginTemplateCommonTable.vue'
import PluginUiProvider from './ui/PluginUiProvider.vue'
import UiMetricCard from './ui/UiMetricCard.vue'
import UiSectionCard from './ui/UiSectionCard.vue'
import UiStatusPill from './ui/UiStatusPill.vue'

const props = defineProps<{
  audience: 'console' | 'uc'
}>()

const { overview, loading, errorMessage, stats, features, checklist, load } =
  useTemplateOverview(props.audience)

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
  props.audience === 'console' ? overview.value?.consolePath || '/halo-plugin-template' : overview.value?.ucPath || '/halo-plugin-template',
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

onMounted(load)
</script>

<template>
  <PluginUiProvider
    :audience="audience"
    :density="overview?.density"
    :accent-color="overview?.accentColor"
  >
    <section class="halo-plugin-template-admin-page">
      <header class="halo-plugin-template-admin-hero">
        <div>
          <p class="halo-plugin-template-admin-eyebrow">{{ siteTitle }} · {{ audienceLabel }}</p>
          <h1 class="halo-plugin-template-admin-title">
            {{ overview?.displayName || 'Halo Plugin Template' }}
          </h1>
          <p class="halo-plugin-template-admin-description">
            这不是单纯的欢迎页，而是一份可重复初始化的 Halo 插件 starter：
            默认接好 Console / UC / Element Plus / 扩展点 / OpenAPI。
          </p>
          <div class="halo-plugin-template-admin-meta">
            <span class="halo-plugin-template-admin-meta-item">
              当前查看者：{{ viewerName }}
            </span>
            <span class="halo-plugin-template-admin-meta-item">
              构建时间：{{ buildTime }}
            </span>
            <span class="halo-plugin-template-admin-meta-item">
              路由前缀：{{ currentPath }}
            </span>
          </div>
        </div>

        <div class="halo-plugin-template-admin-hero-actions">
          <ElButton type="primary" @click="openExternal(supportLink)">
            Halo 插件文档
          </ElButton>
          <ElButton plain @click="openExternal(rsbuildGuideLink)">
            UI 构建说明
          </ElButton>
        </div>
      </header>

      <ElAlert
        v-if="errorMessage"
        title="模板概览接口加载失败"
        :description="errorMessage"
        type="warning"
        show-icon
        :closable="false"
      />

      <ElSkeleton :loading="loading" animated :rows="6">
        <template #default>
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
              description="把模板里的默认值替换干净，再继续堆业务代码。"
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
                  <UiStatusPill :label="item.status" :tone="item.status" />
                </article>
              </div>
            </UiSectionCard>

            <UiSectionCard
              title="当前上下文"
              description="这些值可以直接帮助你确认模板是否已经被成功初始化。"
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
                    <p class="halo-plugin-template-admin-checklist-description">
                      {{ densityLabel }}
                    </p>
                  </div>
                  <UiStatusPill :label="densityTone" tone="info" />
                </div>
                <div class="halo-plugin-template-admin-checklist-item">
                  <div class="halo-plugin-template-admin-checklist-copy">
                    <h3 class="halo-plugin-template-admin-checklist-title">主色</h3>
                    <p class="halo-plugin-template-admin-checklist-description">
                      {{ overview?.accentColor || '#2457F5' }}
                    </p>
                  </div>
                  <UiStatusPill :label="attachmentState" :tone="attachmentTone" />
                </div>
              </div>
            </UiSectionCard>
          </section>

          <UiSectionCard
            title="功能矩阵"
            description="这张表列出模板默认预置的前后端能力，你可以在初始化后按需删减。"
          >
            <PluginTemplateCommonTable
              :rows="features"
              :columns="featureColumns"
              empty-description="暂无功能矩阵"
            >
              <template #cell-enabled="{ value }">
                <UiStatusPill :label="value ? '已启用' : '按需接入'" :tone="value ? 'success' : 'info'" />
              </template>
            </PluginTemplateCommonTable>
          </UiSectionCard>

          <UiSectionCard
            title="初始化清单"
            description="前端和后端都通过统一的检查清单推进，避免漏掉 settings、角色模板和 API 包装层。"
          >
            <PluginTemplateCommonTable
              :rows="checklist"
              :columns="checklistColumns"
              empty-description="暂无初始化清单"
            >
              <template #cell-status="{ value }">
                <UiStatusPill :label="String(value)" :tone="String(value)" />
              </template>
            </PluginTemplateCommonTable>
          </UiSectionCard>

          <UiSectionCard
            title="下一步"
            description="模板的真实价值在于后续多个插件项目都沿用同一套工程边界。"
          >
            <ul style="margin: 0; padding-left: 18px; color: var(--halo-plugin-template-text-secondary); line-height: 1.8">
              <li>先运行初始化脚本，再修改 `plugin.yaml`、`settings.yaml`、角色模板和 Java 包名。</li>
              <li>初始化后执行 `node scripts/verify-template.mjs`，确认插件名、包名、权限前缀和文档入口已经全部收敛。</li>
              <li>新接口补好 Springdoc 后，执行 `./gradlew generateApiClient`，再在 `ui/src/api/index.ts` 暴露新增能力。</li>
              <li>按插件实际范围裁剪 UC、附件扩展和工作台部件，避免模板示例残留到正式项目。</li>
              <li>
                如需切换到 Rsbuild，可参考
                <ElLink :href="rsbuildGuideLink" target="_blank">Halo 官方 UI 构建说明</ElLink>
                和仓库内的 `docs/rsbuild-switch.md`。
              </li>
            </ul>
          </UiSectionCard>
        </template>
      </ElSkeleton>
    </section>
  </PluginUiProvider>
</template>
