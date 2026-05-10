<script setup lang="ts">
import { Lock, User } from 'lucide-vue-next'
import { reactive, ref } from 'vue'
import { toast } from 'vue-sonner'
import { t } from '@/i18n'
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
  <!-- Page Header -->
  <div class="mb-6">
    <h1 class="text-2xl font-bold tracking-tight">{{ t('loginDemo.title') }}</h1>
    <p class="mt-1 text-sm text-muted-foreground">{{ t('loginDemo.description') }}</p>
  </div>

  <div class="grid grid-cols-1 gap-4 lg:grid-cols-7">
    <Card class="lg:col-span-3 bg-muted/50">
      <CardHeader class="pb-3">
        <CardTitle class="text-xl">{{ t('loginDemo.welcome') }}</CardTitle>
        <CardDescription>{{ t('loginDemo.intro') }}</CardDescription>
      </CardHeader>
      <CardContent class="space-y-3 text-sm text-muted-foreground">
        <p>{{ t('loginDemo.capabilityTheme') }}: {{ t('theme.light') }} / {{ t('theme.dark') }}</p>
        <p>{{ t('loginDemo.capabilityLocale') }}: {{ t('locale.zhCN') }} / {{ t('locale.enUS') }}</p>
        <p>{{ t('loginDemo.capabilityBreakpoints') }}: sm / md / lg / xl</p>
        <div class="mt-4 rounded-lg border bg-background p-4">
          <p class="text-sm font-medium text-foreground">{{ t('loginDemo.previewTitle') }}</p>
          <p class="mt-1 text-xs">{{ t('loginDemo.previewDescription') }}</p>
        </div>
      </CardContent>
    </Card>

    <Card class="lg:col-span-4">
      <CardHeader class="pb-3">
        <CardTitle>{{ t('loginDemo.submit') }}</CardTitle>
        <CardDescription>{{ t('loginDemo.formDescription') }}</CardDescription>
      </CardHeader>
      <CardContent>
        <form class="space-y-4" @submit.prevent="submit">
          <div class="space-y-2">
            <Label>{{ t('loginDemo.account') }}</Label>
            <div class="relative">
              <User class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                v-model="form.account"
                class="pl-10"
                :placeholder="t('loginDemo.accountPlaceholder')"
              />
            </div>
          </div>
          <div class="space-y-2">
            <Label>{{ t('loginDemo.password') }}</Label>
            <div class="relative">
              <Lock class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                v-model="form.password"
                class="pl-10"
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
          <Button class="w-full" :loading="submitting" type="submit">
            {{ t('loginDemo.submit') }}
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
