<script setup lang="ts">
import { Languages } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { t } from '@/i18n'
import { useLocale } from '@/lib/locale'
import { isLocaleCode } from '@/lib/preferences'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'

const { locale, setLocale } = useLocale()

const onChange = (value: string | number | boolean) => {
  if (!isLocaleCode(value)) return
  setLocale(value)
  toast.success(t('toast.switchedLocale', { locale: t(value === 'zh-CN' ? 'locale.zhCN' : 'locale.enUS') }))
}
</script>

<template>
  <div class="flex items-center gap-2">
    <Label class="hidden items-center gap-1 text-xs text-muted-foreground md:inline-flex">
      <Languages class="h-3.5 w-3.5" />
      {{ t('locale.label') }}
    </Label>
    <Select :model-value="locale" class="w-[130px] text-xs" @update:model-value="onChange">
      <option value="zh-CN">{{ t('locale.zhCN') }}</option>
      <option value="en-US">{{ t('locale.enUS') }}</option>
    </Select>
  </div>
</template>
