import { IconPlug } from '@halo-dev/components'
import { definePlugin, type AttachmentSelectProvider } from '@halo-dev/ui-shared'
import { markRaw } from 'vue'
import PluginTemplateAttachmentTab from './components/PluginTemplateAttachmentTab.vue'
import PluginTemplateDashboardWidget from './components/PluginTemplateDashboardWidget.vue'

import './assets/index.css'
import { t } from '@/i18n'
import ConsoleDashboardView from '@/views/console/ConsoleDashboardView.vue'
import DashboardPage from '@/views/workspace/pages/DashboardPage.vue'
import LoginDemoPage from '@/views/workspace/pages/LoginDemoPage.vue'
import NotFoundPage from '@/views/workspace/pages/NotFoundPage.vue'
import RecordListPage from '@/views/workspace/pages/RecordListPage.vue'
import UcDashboardView from '@/views/uc/UcDashboardView.vue'

export default definePlugin({
  components: {},
  routes: [
    {
      parentName: 'Root',
      route: {
        path: '/halo-plugin-template',
        name: 'PluginTemplateConsoleRoot',
        component: ConsoleDashboardView,
        redirect: {
          name: 'PluginTemplateConsoleDashboard',
        },
        children: [
          {
            path: 'dashboard',
            name: 'PluginTemplateConsoleDashboard',
            component: DashboardPage,
            props: { audience: 'console' },
            meta: {
              title: t('dashboard.title'),
              breadcrumbKey: 'nav.dashboard',
              permissions: ['plugin:halo-plugin-template:view'],
            },
          },
          {
            path: 'list',
            name: 'PluginTemplateConsoleList',
            component: RecordListPage,
            meta: {
              title: t('records.title'),
              breadcrumbKey: 'nav.list',
              permissions: ['plugin:halo-plugin-template:view'],
            },
          },
          {
            path: 'login-demo',
            name: 'PluginTemplateConsoleLoginDemo',
            component: LoginDemoPage,
            meta: {
              title: t('loginDemo.title'),
              breadcrumbKey: 'nav.loginDemo',
              permissions: ['plugin:halo-plugin-template:view'],
            },
          },
          {
            path: 'records',
            redirect: {
              name: 'PluginTemplateConsoleList',
            },
          },
          {
            path: ':pathMatch(.*)*',
            name: 'PluginTemplateConsoleNotFound',
            component: NotFoundPage,
            meta: {
              title: t('notFound.title'),
              breadcrumbKey: 'nav.notFound',
              permissions: ['plugin:halo-plugin-template:view'],
            },
          },
        ],
        meta: {
          title: t('dashboard.title'),
          searchable: true,
          permissions: ['plugin:halo-plugin-template:view'],
          menu: {
            name: t('shell.title'),
            group: 'Plugin Template',
            icon: markRaw(IconPlug),
            priority: 40,
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
        component: UcDashboardView,
        redirect: {
          name: 'PluginTemplateUcDashboard',
        },
        children: [
          {
            path: 'dashboard',
            name: 'PluginTemplateUcDashboard',
            component: DashboardPage,
            props: { audience: 'uc' },
            meta: {
              title: t('dashboard.title'),
              breadcrumbKey: 'nav.dashboard',
              permissions: ['plugin:halo-plugin-template:uc'],
            },
          },
          {
            path: 'login-demo',
            name: 'PluginTemplateUcLoginDemo',
            component: LoginDemoPage,
            meta: {
              title: t('loginDemo.title'),
              breadcrumbKey: 'nav.loginDemo',
              permissions: ['plugin:halo-plugin-template:uc'],
            },
          },
          {
            path: ':pathMatch(.*)*',
            name: 'PluginTemplateUcNotFound',
            component: NotFoundPage,
            meta: {
              title: t('notFound.title'),
              breadcrumbKey: 'nav.notFound',
              permissions: ['plugin:halo-plugin-template:uc'],
            },
          },
        ],
        meta: {
          permissions: ['plugin:halo-plugin-template:uc'],
          menu: {
            name: t('shell.title'),
            group: 'Plugin Template',
            icon: markRaw(IconPlug),
            priority: 40,
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
        title: t('shell.title'),
        action: () => {
          window.location.assign('/console/halo-plugin-template/dashboard')
        },
        permissions: ['plugin:halo-plugin-template:manage'],
      },
    ],
    'attachment:selector:create': (): AttachmentSelectProvider[] => [
      {
        id: 'halo-plugin-template-assets',
        label: t('attachment.title'),
        component: markRaw(PluginTemplateAttachmentTab),
      },
    ],
  },
})
