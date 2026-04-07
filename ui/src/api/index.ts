import { axiosInstance } from '@halo-dev/api-client'
import {
  Configuration,
  PluginTemplateConsoleApi,
  PluginTemplateUcApi,
} from '@/api/generated'
import { normalizeOverview } from '@/api/normalizers'
import type { PluginTemplateOverview } from '@/types'

// Keep this file as the only API import surface for UI code.
// Generated clients stay behind this wrapper so views and components never import them directly.

const generatedClientConfiguration = new Configuration({
  basePath: '',
})

const consoleApi = new PluginTemplateConsoleApi(
  generatedClientConfiguration,
  '',
  axiosInstance,
)
const ucApi = new PluginTemplateUcApi(
  generatedClientConfiguration,
  '',
  axiosInstance,
)

export const templateConsoleApi = {
  getOverview: async (): Promise<PluginTemplateOverview> => {
    const response = await consoleApi.pluginTemplateOverviewForConsole()
    return normalizeOverview(response.data)
  },
}

export const templateUcApi = {
  getOverview: async (): Promise<PluginTemplateOverview> => {
    const response = await ucApi.pluginTemplateOverviewForUc()
    return normalizeOverview(response.data)
  },
}

export type { PluginTemplateOverview }
