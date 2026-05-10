<script setup lang="ts">
import { Lock, User } from 'lucide-vue-next'
import { reactive, ref } from 'vue'
import { toast } from 'vue-sonner'
import { t } from '@/i18n'
import PageHeader from '@/components/layout/PageHeader.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const submitting = ref(false)
const form = reactive({
  account: '',
  password: '',
  remember: true,
})

const submit = async () => {
  submitting.value = true
  try {
    await new Promise((resolve) => {
      setTimeout(resolve, 350)
    })
    toast.success(t('loginDemo.success'))
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <PageHeader :title="t('loginDemo.title')" :description="t('loginDemo.description')" />

  <div class="grid grid-cols-1 gap-4 xl:grid-cols-2">
    <Card class="border-border/70">
      <CardHeader>
        <CardTitle>{{ t('loginDemo.welcome') }}</CardTitle>
        <CardDescription>{{ t('loginDemo.description') }}</CardDescription>
      </CardHeader>
      <CardContent>
        <form class="space-y-4" @submit.prevent="submit">
          <div class="grid gap-2">
            <Label>{{ t('loginDemo.account') }}</Label>
            <div class="relative">
              <User class="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input v-model="form.account" class="pl-8" :placeholder="t('loginDemo.accountPlaceholder')" />
            </div>
          </div>
          <div class="grid gap-2">
            <Label>{{ t('loginDemo.password') }}</Label>
            <div class="relative">
              <Lock class="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                v-model="form.password"
                class="pl-8"
                type="password"
                :placeholder="t('loginDemo.passwordPlaceholder')"
              />
            </div>
          </div>
          <div class="flex items-center justify-between text-sm">
            <label class="inline-flex items-center gap-2">
              <input v-model="form.remember" type="checkbox" class="h-4 w-4 rounded border-input" />
              <span>{{ t('loginDemo.remember') }}</span>
            </label>
            <button type="button" class="text-muted-foreground hover:text-foreground">
              {{ t('loginDemo.forgot') }}
            </button>
          </div>
          <Button class="w-full" :disabled="submitting" type="submit">{{ t('loginDemo.submit') }}</Button>
        </form>
      </CardContent>
    </Card>

    <Card class="border-border/70 bg-muted/35">
      <CardHeader>
        <CardTitle>{{ t('shell.title') }}</CardTitle>
        <CardDescription>{{ t('shell.subtitle') }}</CardDescription>
      </CardHeader>
      <CardContent class="space-y-3 text-sm text-muted-foreground">
        <p>• {{ t('loginDemo.capabilityTheme') }}: {{ t('theme.light') }} / {{ t('theme.dark') }} / {{ t('theme.businessBlue') }}</p>
        <p>• {{ t('loginDemo.capabilityLocale') }}: {{ t('locale.zhCN') }} / {{ t('locale.enUS') }}</p>
        <p>• {{ t('loginDemo.capabilityBreakpoints') }}: sm / md / lg / xl</p>
      </CardContent>
    </Card>
  </div>
</template>
