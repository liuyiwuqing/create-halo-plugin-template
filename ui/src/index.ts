import { IconPlug } from '@halo-dev/components'
import { definePlugin, type AttachmentSelectProvider } from '@halo-dev/ui-shared'
import { markRaw } from 'vue'
import PluginTemplateAttachmentTab from './components/PluginTemplateAttachmentTab.vue'
import PluginTemplateDashboardWidget from './components/PluginTemplateDashboardWidget.vue'

import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './assets/index.css'
import './assets/element.scss'

export default definePlugin({
  components: {},
  routes: [
    {
      parentName: 'Root',
      route: {
        path: '/halo-plugin-template',
        name: 'PluginTemplateConsoleRoot',
        component: () =>
          import(/* webpackChunkName: "PluginTemplateConsoleDashboard" */ './views/console/ConsoleDashboardView.vue'),
        meta: {
          title: '模板工作台',
          searchable: true,
          permissions: ['plugin:halo-plugin-template:view'],
          menu: {
            name: '模板工作台',
            group: '插件模板',
            icon: markRaw(IconPlug),
            priority: 0,
          },
        },
      },
    },
  ],
  ucRoutes: [
    {
      parentName: 'Root',
      route: {
        path: '/halo-plugin-template',
        name: 'PluginTemplateUcRoot',
        component: () =>
          import(/* webpackChunkName: "PluginTemplateUcDashboard" */ './views/uc/UcDashboardView.vue'),
        meta: {
          title: '模板中心',
          searchable: true,
          permissions: ['plugin:halo-plugin-template:uc'],
        },
      },
    },
  ],
  extensionPoints: {
    'console:dashboard:widgets:create': () => [
      {
        id: 'halo-plugin-template-overview-widget',
        component: markRaw(PluginTemplateDashboardWidget),
        group: 'halo-plugin-template',
        defaultSize: {
          w: 6,
          h: 8,
          minW: 4,
          minH: 5,
          maxW: 12,
          maxH: 12,
        },
        permissions: ['plugin:halo-plugin-template:view'],
      },
    ],
    'console:dashboard:widgets:internal:quick-action:item:create': () => [
      {
        id: 'halo-plugin-template-open-console',
        icon: markRaw(IconPlug),
        title: '打开模板页',
        action: () => {
          window.location.assign('/console/halo-plugin-template')
        },
        permissions: ['plugin:halo-plugin-template:manage'],
      },
    ],
    'attachment:selector:create': (): AttachmentSelectProvider[] => [
      {
        id: 'halo-plugin-template-assets',
        label: '模板资源',
        component: markRaw(PluginTemplateAttachmentTab),
      },
    ],
  },
})
