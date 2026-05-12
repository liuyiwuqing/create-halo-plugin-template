import { axiosInstance } from '@halo-dev/api-client'
import { Configuration, PluginTemplateConsoleApi, PluginTemplateUcApi } from '@/api/generated'
import {
  normalizeOverview,
  normalizeTemplateRecord,
  normalizeTemplateRecordList,
  toTemplateRecordCreateRequest,
  toTemplateRecordListRequest,
  toTemplateRecordUpdateRequest,
} from '@/api/normalizers'
import type {
  PluginTemplateOverview,
  PluginTemplateRecordFormPayload,
  PluginTemplateRecordListQuery,
  PluginTemplateRecordListView,
  PluginTemplateRecordView,
} from '@/types'

// Keep this file as the only API import surface for UI code.
// Generated clients stay behind this wrapper so views and components never import them directly.

const generatedClientConfiguration = new Configuration({
  basePath: '',
})

const consoleApi = new PluginTemplateConsoleApi(generatedClientConfiguration, '', axiosInstance)
const ucApi = new PluginTemplateUcApi(generatedClientConfiguration, '', axiosInstance)

export const templateConsoleApi = {
  getOverview: async (): Promise<PluginTemplateOverview> => {
    const response = await consoleApi.pluginTemplateOverviewForConsole()
    return normalizeOverview(response.data)
  },
}

export const templateRecordConsoleApi = {
  list: async (
    query: PluginTemplateRecordListQuery = {},
  ): Promise<PluginTemplateRecordListView> => {
    const response = await consoleApi.listTemplateRecordsForConsole(
      toTemplateRecordListRequest(query),
    )
    return normalizeTemplateRecordList(response.data)
  },
  get: async (recordId: string): Promise<PluginTemplateRecordView> => {
    const response = await consoleApi.templateRecordForConsole({ recordId })
    return normalizeTemplateRecord(response.data)
  },
  create: async (payload: PluginTemplateRecordFormPayload): Promise<PluginTemplateRecordView> => {
    const response = await consoleApi.createTemplateRecordForConsole({
      pluginTemplateRecordCreateRequest: toTemplateRecordCreateRequest(payload),
    })
    return normalizeTemplateRecord(response.data)
  },
  update: async (
    recordId: string,
    payload: PluginTemplateRecordFormPayload,
  ): Promise<PluginTemplateRecordView> => {
    const response = await consoleApi.updateTemplateRecordForConsole({
      recordId,
      pluginTemplateRecordUpdateRequest: toTemplateRecordUpdateRequest(payload),
    })
    return normalizeTemplateRecord(response.data)
  },
  delete: async (recordId: string): Promise<void> => {
    await consoleApi.deleteTemplateRecordForConsole({ recordId })
  },
}

export const templateUcApi = {
  getOverview: async (): Promise<PluginTemplateOverview> => {
    const response = await ucApi.pluginTemplateOverviewForUc()
    return normalizeOverview(response.data)
  },
}

export type {
  PluginTemplateOverview,
  PluginTemplateRecordFormPayload,
  PluginTemplateRecordListQuery,
  PluginTemplateRecordListView,
  PluginTemplateRecordView,
}
