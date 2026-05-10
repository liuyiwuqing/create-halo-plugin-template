<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { z } from 'zod'
import { templateConsoleApi } from '@/api'
import { t } from '@/i18n'
import { createDefaultRecordForm } from '@/lib/template-records'
import type { PluginTemplateRecordForm } from '@/types'
import PageHeader from '@/components/layout/PageHeader.vue'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FormField } from '@/components/ui/form'
import GlobalLoading from '@/components/ui/GlobalLoading.vue'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

const props = defineProps<{
  mode: 'create' | 'edit'
}>()

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const errorMessage = ref('')
const recordId = computed(() => String(route.params.id || ''))

const schema = toTypedSchema(
  z.object({
    id: z.string().optional(),
    title: z.string().trim().min(2, t('validation.titleLength')).max(60, t('validation.titleLength')),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED'], {
      required_error: t('validation.statusRequired'),
    }),
    enabled: z.boolean(),
    priority: z.coerce.number().min(0, t('validation.priorityMin')).max(999, t('validation.priorityMax')),
    publishTime: z.string().optional().default(''),
    description: z.string().max(200, t('validation.descriptionMax')).optional().default(''),
  }),
)

const { values, errors, defineField, handleSubmit, resetForm } = useForm<PluginTemplateRecordForm>({
  validationSchema: schema,
  initialValues: createDefaultRecordForm(),
})

const [titleField] = defineField('title')
const [statusField] = defineField('status')
const [enabledField] = defineField('enabled')
const [priorityField] = defineField('priority')
const [publishTimeField] = defineField('publishTime')
const [descriptionField] = defineField('description')

const publishTimeInput = computed({
  get: () => (publishTimeField.value || '').slice(0, 16),
  set: (value: string) => {
    publishTimeField.value = value
  },
})

const pageTitle = computed(() =>
  props.mode === 'create' ? t('formPage.createTitle') : t('formPage.editTitle'),
)

const loadRecord = async () => {
  if (props.mode !== 'edit') return
  if (!recordId.value) {
    errorMessage.value = t('detailPage.notFound')
    return
  }
  loading.value = true
  errorMessage.value = ''
  try {
    const record = await templateConsoleApi.getRecordById(recordId.value)
    resetForm({
      values: {
        id: record.id,
        title: record.title,
        status: record.status,
        enabled: record.enabled ?? true,
        priority: record.priority ?? 0,
        publishTime: record.publishTime ?? '',
        description: record.description ?? '',
      },
    })
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : t('records.loadError')
  } finally {
    loading.value = false
  }
}

const goList = () => {
  router.push({ name: 'PluginTemplateConsoleList' })
}

const submit = handleSubmit(async (form) => {
  loading.value = true
  errorMessage.value = ''
  try {
    if (props.mode === 'create') {
      await templateConsoleApi.createRecord(form)
      toast.success(t('records.createSuccess'))
    } else {
      await templateConsoleApi.updateRecord(recordId.value, { ...form, id: recordId.value })
      toast.success(t('records.updateSuccess'))
    }
    goList()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : t('records.saveError')
  } finally {
    loading.value = false
  }
})

onMounted(loadRecord)
</script>

<template>
  <PageHeader :title="pageTitle" :description="t('formPage.description')">
    <template #actions>
      <Button variant="outline" size="sm" @click="goList">{{ t('common.back') }}</Button>
    </template>
  </PageHeader>

  <Alert v-if="errorMessage" variant="destructive" class="mb-4">
    <AlertTitle>{{ pageTitle }}</AlertTitle>
    <AlertDescription>{{ errorMessage }}</AlertDescription>
  </Alert>

  <GlobalLoading v-if="loading && mode === 'edit'" />

  <Card v-else class="max-w-4xl border-border/70">
    <CardContent class="p-5 sm:p-6">
      <form class="grid gap-4" @submit.prevent="submit">
        <FormField :label="t('records.form.title')" :error="errors.title">
          <Input
            v-model="titleField"
            maxlength="60"
            :placeholder="t('records.form.titlePlaceholder')"
          />
          <span class="text-xs text-muted-foreground">{{ values.title?.length || 0 }}/60</span>
        </FormField>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField :label="t('records.form.status')" :error="errors.status">
            <Select v-model="statusField">
              <option value="DRAFT">{{ t('records.status.DRAFT') }}</option>
              <option value="PUBLISHED">{{ t('records.status.PUBLISHED') }}</option>
              <option value="ARCHIVED">{{ t('records.status.ARCHIVED') }}</option>
            </Select>
          </FormField>
          <FormField :label="t('records.form.priority')" :error="errors.priority">
            <Input
              v-model="priorityField"
              type="number"
              min="0"
              max="999"
              :placeholder="t('records.form.priorityPlaceholder')"
            />
          </FormField>
        </div>

        <FormField :label="t('records.form.enabled')">
          <div class="flex h-9 items-center gap-3">
            <Switch v-model="enabledField" />
            <span class="text-sm text-muted-foreground">
              {{ enabledField ? t('common.enabled') : t('common.disabled') }}
            </span>
          </div>
        </FormField>

        <FormField :label="t('records.form.publishTime')" :error="errors.publishTime">
          <Input v-model="publishTimeInput" type="datetime-local" />
        </FormField>

        <FormField :label="t('records.form.description')" :error="errors.description">
          <Textarea
            v-model="descriptionField"
            maxlength="200"
            :placeholder="t('records.form.descriptionPlaceholder')"
            rows="4"
          />
          <span class="text-xs text-muted-foreground">{{ values.description?.length || 0 }}/200</span>
        </FormField>

        <p class="text-xs text-muted-foreground">{{ t('formPage.helper') }}</p>

        <div class="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" @click="goList">{{ t('common.cancel') }}</Button>
          <Button type="submit" :disabled="loading">
            {{ mode === 'create' ? t('formPage.submitCreate') : t('formPage.submitUpdate') }}
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
</template>
