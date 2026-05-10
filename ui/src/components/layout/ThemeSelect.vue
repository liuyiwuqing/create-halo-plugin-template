<script setup lang="ts">
import { Palette } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { t } from '@/i18n'
import { isThemeMode } from '@/lib/preferences'
import { THEME_LABEL_KEY, useTheme } from '@/lib/theme'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'

const { mode, setTheme } = useTheme()

const onChange = (value: string | number | boolean) => {
  if (!isThemeMode(value)) return
  setTheme(value)
  toast.success(t('toast.switchedTheme', { theme: t(THEME_LABEL_KEY[value]) }))
}
</script>

<template>
  <div class="flex items-center gap-2">
    <Label class="hidden items-center gap-1 text-xs text-muted-foreground md:inline-flex">
      <Palette class="h-3.5 w-3.5" />
      {{ t('theme.label') }}
    </Label>
    <Select :model-value="mode" class="w-[130px] text-xs" @update:model-value="onChange">
      <option value="light">{{ t('theme.light') }}</option>
      <option value="dark">{{ t('theme.dark') }}</option>
      <option value="business-blue">{{ t('theme.businessBlue') }}</option>
    </Select>
  </div>
</template>
