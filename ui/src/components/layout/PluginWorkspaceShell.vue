<script setup lang="ts">
import { ChevronRight, Menu } from 'lucide-vue-next'
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { t } from '@/i18n'
import type { BreadcrumbItem, ShellNavItem } from '@/types'
import LocaleSelect from '@/components/layout/LocaleSelect.vue'
import ThemeSelect from '@/components/layout/ThemeSelect.vue'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
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
  <div class="tpl-page-shell flex">
    <!-- Sidebar -->
    <aside class="hidden w-[220px] shrink-0 border-r bg-sidebar-background lg:flex lg:flex-col">
      <div class="flex h-16 items-center border-b px-4">
        <div>
          <p class="text-sm font-semibold text-sidebar-foreground">{{ title || t('shell.title') }}</p>
          <p class="text-xs text-muted-foreground">{{ subtitle || t('shell.subtitle') }}</p>
        </div>
      </div>

      <nav class="flex-1 space-y-1 p-2">
        <RouterLink
          v-for="item in navItems"
          :key="item.key"
          :to="item.to"
          class="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors"
          :class="
            isActive(item)
              ? 'bg-sidebar-primary text-sidebar-primary-foreground'
              : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
          "
        >
          <component :is="item.icon" v-if="item.icon" class="h-4 w-4" />
          {{ item.label }}
        </RouterLink>
      </nav>

      <div class="border-t px-4 py-3">
        <p class="text-xs text-muted-foreground">{{ t('shell.footer') }}</p>
      </div>
    </aside>

    <!-- Main Area -->
    <div class="min-w-0 flex-1">
      <!-- Header -->
      <header class="flex h-16 items-center gap-3 border-b bg-background px-4 sm:gap-4 sm:px-6">
        <!-- Mobile Menu -->
        <Sheet v-model:open="menuOpen">
          <SheetTrigger as-child class="lg:hidden">
            <Button variant="outline" size="icon" class="shrink-0">
              <Menu class="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" class="w-[260px] p-0">
            <div class="flex h-16 items-center border-b px-4">
              <div>
                <p class="text-sm font-semibold">{{ title || t('shell.title') }}</p>
                <p class="text-xs text-muted-foreground">{{ subtitle || t('shell.subtitle') }}</p>
              </div>
            </div>
            <nav class="space-y-1 p-2">
              <RouterLink
                v-for="item in navItems"
                :key="item.key"
                :to="item.to"
                class="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors"
                :class="
                  isActive(item)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                "
                @click="menuOpen = false"
              >
                <component :is="item.icon" v-if="item.icon" class="h-4 w-4" />
                {{ item.label }}
              </RouterLink>
            </nav>
          </SheetContent>
        </Sheet>

        <Separator orientation="vertical" class="hidden h-6 lg:block" />

        <!-- Breadcrumbs -->
        <nav class="flex items-center gap-1 overflow-x-auto text-sm text-muted-foreground">
          <template v-for="(item, index) in breadcrumbs" :key="item.key">
            <RouterLink
              v-if="item.to"
              :to="item.to"
              class="whitespace-nowrap transition-colors hover:text-foreground"
            >
              {{ item.label }}
            </RouterLink>
            <span v-else class="whitespace-nowrap font-medium text-foreground">{{ item.label }}</span>
            <ChevronRight v-if="index < breadcrumbs.length - 1" class="h-3.5 w-3.5 shrink-0" />
          </template>
        </nav>

        <!-- Right Actions -->
        <div class="ml-auto flex shrink-0 items-center gap-2">
          <LocaleSelect />
          <ThemeSelect />
        </div>
      </header>

      <!-- Content -->
      <main class="px-4 py-6 sm:px-6">
        <slot />
      </main>
    </div>
  </div>
</template>
