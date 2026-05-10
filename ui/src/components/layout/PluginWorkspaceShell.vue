<script setup lang="ts">
import { ChevronRight, Menu } from 'lucide-vue-next'
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { t } from '@/i18n'
import type { BreadcrumbItem, ShellNavItem } from '@/types'
import LocaleSelect from '@/components/layout/LocaleSelect.vue'
import ThemeSelect from '@/components/layout/ThemeSelect.vue'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

const props = withDefaults(
  defineProps<{
    navItems: ShellNavItem[]
    breadcrumbs: BreadcrumbItem[]
    currentPath: string
    title?: string
    subtitle?: string
  }>(),
  {
    title: '',
    subtitle: '',
  },
)

const menuOpen = ref(false)

const isActive = (item: ShellNavItem) =>
  props.currentPath === item.to || props.currentPath.startsWith(`${item.to}/`)
</script>

<template>
  <div class="flex min-h-[calc(100dvh-8px)] rounded-2xl border border-border/60 bg-background/85 shadow-sm backdrop-blur-sm">
    <aside class="hidden w-64 border-r border-border/70 bg-card/70 p-4 lg:flex lg:flex-col">
      <div>
        <p class="text-sm font-semibold">{{ title || t('shell.title') }}</p>
        <p class="mt-1 text-xs text-muted-foreground">{{ subtitle || t('shell.subtitle') }}</p>
      </div>
      <nav class="mt-5 grid gap-1.5">
        <RouterLink
          v-for="item in navItems"
          :key="item.key"
          :to="item.to"
          class="rounded-lg px-3 py-2 text-sm transition-colors"
          :class="
            isActive(item)
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          "
        >
          {{ item.label }}
        </RouterLink>
      </nav>
      <p class="mt-auto pt-4 text-xs text-muted-foreground">{{ t('shell.footer') }}</p>
    </aside>

    <div class="flex min-w-0 flex-1 flex-col">
      <header class="sticky top-0 z-20 border-b border-border/70 bg-background/95 px-4 py-3 backdrop-blur-md sm:px-6">
        <div class="flex items-center justify-between gap-3">
          <div class="flex min-w-0 items-center gap-3">
            <Sheet v-model:open="menuOpen">
              <SheetTrigger as-child class="lg:hidden">
                <Button variant="outline" size="icon-sm">
                  <Menu class="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" class="w-[280px] p-4">
                <div>
                  <p class="text-sm font-semibold">{{ title || t('shell.title') }}</p>
                  <p class="mt-1 text-xs text-muted-foreground">{{ subtitle || t('shell.subtitle') }}</p>
                </div>
                <nav class="mt-5 grid gap-2">
                  <RouterLink
                    v-for="item in navItems"
                    :key="item.key"
                    :to="item.to"
                    class="rounded-lg px-3 py-2 text-sm transition-colors"
                    :class="
                      isActive(item)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    "
                    @click="menuOpen = false"
                  >
                    {{ item.label }}
                  </RouterLink>
                </nav>
              </SheetContent>
            </Sheet>

            <nav class="flex items-center gap-1 overflow-x-auto text-xs text-muted-foreground">
              <template v-for="(item, index) in breadcrumbs" :key="item.key">
                <RouterLink
                  v-if="item.to"
                  :to="item.to"
                  class="whitespace-nowrap transition-colors hover:text-foreground"
                >
                  {{ item.label }}
                </RouterLink>
                <span v-else class="whitespace-nowrap text-foreground">{{ item.label }}</span>
                <ChevronRight v-if="index < breadcrumbs.length - 1" class="h-3.5 w-3.5 shrink-0" />
              </template>
            </nav>
          </div>

          <div class="flex shrink-0 items-center gap-2">
            <LocaleSelect />
            <ThemeSelect />
          </div>
        </div>
      </header>

      <main class="min-w-0 flex-1 p-4 sm:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
