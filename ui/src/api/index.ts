import { axiosInstance } from '@halo-dev/api-client'
import {
  Configuration,
  PluginTemplateConsoleApi,
  PluginTemplateUcApi,
} from '@/api/generated'
import { normalizeOverview } from '@/api/normalizers'
import {
  buildRecordListRequest,
  buildRecordPayload,
  normalizeRecord,
  normalizeRecordList,
} from '@/lib/template-records'
import type {
  PluginTemplateOverview,
  PluginTemplateRecord,
  PluginTemplateRecordFilters,
  PluginTemplateRecordForm,
  PluginTemplateRecordList,
  TemplateRecordSort,
} from '@/types'

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
  listRecords: async (params: {
    page: number
    size: number
    filters: PluginTemplateRecordFilters
    sort?: TemplateRecordSort
  }): Promise<PluginTemplateRecordList> => {
    const response = await consoleApi.pluginTemplateRecordListForConsole(
      buildRecordListRequest(params),
    )
    return normalizeRecordList(response.data)
  },
  createRecord: async (form: PluginTemplateRecordForm): Promise<PluginTemplateRecord> => {
    const response = await consoleApi.pluginTemplateRecordCreateForConsole({
      pluginTemplateRecord: buildRecordPayload(form),
    })
    return normalizeRecord(response.data)
  },
  updateRecord: async (
    id: string,
    form: PluginTemplateRecordForm,
  ): Promise<PluginTemplateRecord> => {
    const response = await consoleApi.pluginTemplateRecordUpdateForConsole({
      id,
      pluginTemplateRecord: buildRecordPayload({ ...form, id }),
    })
    return normalizeRecord(response.data)
  },
  deleteRecord: async (id: string): Promise<PluginTemplateRecord> => {
    const response = await consoleApi.pluginTemplateRecordDeleteForConsole({ id })
    return normalizeRecord(response.data)
  },
}

export const templateUcApi = {
  getOverview: async (): Promise<PluginTemplateOverview> => {
    const response = await ucApi.pluginTemplateOverviewForUc()
    return normalizeOverview(response.data)
  },
}

export type { PluginTemplateOverview, PluginTemplateRecord, PluginTemplateRecordList }
