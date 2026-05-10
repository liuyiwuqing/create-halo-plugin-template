<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { computed, watch } from 'vue'
import { t } from '@/i18n'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { FormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  createDefaultRecordForm,
  createRecordFormFromRecord,
  TEMPLATE_RECORD_STATUSES,
} from '@/lib/template-records'
import type { PluginTemplateRecord, PluginTemplateRecordForm } from '@/types'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    record?: PluginTemplateRecord | null
    saving?: boolean
  }>(),
  {
    record: null,
    saving: false,
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'save', value: PluginTemplateRecordForm): void
}>()

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

const visible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

const dialogTitle = computed(() =>
  props.record ? t('records.edit') : t('records.create'),
)

const refreshForm = () => {
  resetForm({
    values: props.record ? createRecordFormFromRecord(props.record) : createDefaultRecordForm(),
  })
}

const submit = handleSubmit((form) => {
  emit('save', {
    ...form,
    id: props.record?.id,
  })
})

watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      refreshForm()
    }
  },
)
</script>

<template>
  <Dialog
    v-model:open="visible"
    :title="dialogTitle"
    description="标题、状态和启用状态会直接影响列表展示；优先级越高越靠前。"
    width-class="sm:max-w-lg"
  >
    <form class="space-y-4" @submit.prevent="submit">
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
            <option value="" disabled>{{ t('records.form.statusPlaceholder') }}</option>
            <option
              v-for="item in TEMPLATE_RECORD_STATUSES"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </option>
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
        <Input
          v-model="publishTimeInput"
          type="datetime-local"
        />
      </FormField>

      <FormField :label="t('records.form.description')" :error="errors.description">
        <Textarea
          v-model="descriptionField"
          maxlength="200"
          :placeholder="t('records.form.descriptionPlaceholder')"
          rows="3"
        />
        <span class="text-xs text-muted-foreground">
          {{ values.description?.length || 0 }}/200
        </span>
      </FormField>

      <div class="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" @click="visible = false">
          {{ t('common.cancel') }}
        </Button>
        <Button type="submit" :loading="saving">
          {{ t('common.save') }}
        </Button>
      </div>
    </form>
  </Dialog>
</template>
