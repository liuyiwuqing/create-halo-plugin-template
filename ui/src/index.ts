import { IconPlug } from '@halo-dev/components'
import { definePlugin, type AttachmentSelectProvider } from '@halo-dev/ui-shared'
import { markRaw } from 'vue'
import PluginTemplateAttachmentTab from './components/PluginTemplateAttachmentTab.vue'
import PluginTemplateDashboardWidget from './components/PluginTemplateDashboardWidget.vue'

import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './assets/index.css'
import './assets/element.scss'
import ConsoleDashboardView from "@/views/console/ConsoleDashboardView.vue";
import UcDashboardView from "@/views/uc/UcDashboardView.vue";

export default definePlugin({
  components: {},
  routes: [
    {
      parentName: "Root",
      route: {
        path: '/halo-plugin-template',
        name: "PluginTemplateConsoleRoot",
        component: ConsoleDashboardView,
        meta: {
          title: "模板工作台",
          searchable: true,
          permissions: ['plugin:halo-plugin-template:view'],
          menu: {
            name: "模板工作台",
            group: "插件模板",
            icon: markRaw(IconPlug),
            priority: 40,
          },
        }
      },
    },
  ],
  ucRoutes: [
    {
      parentName: "Root",
      route: {
        path: '/halo-plugin-template',
        name: "PluginTemplateUcRoot",
        component: UcDashboardView,
        meta: {
          permissions: ['plugin:halo-plugin-template:uc'],
          menu: {
            name: "模板中心",
            group: "插件模板",
            icon: markRaw(IconPlug),
            priority: 40
          },
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
