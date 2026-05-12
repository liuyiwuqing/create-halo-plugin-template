<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({ name: 'UiButton', inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive'
    size?: 'default' | 'sm' | 'lg' | 'icon'
    type?: 'button' | 'submit' | 'reset'
    asChild?: boolean
    disabled?: boolean
    class?: string
  }>(),
  {
    variant: 'default',
    size: 'default',
    type: 'button',
    asChild: false,
    disabled: false,
    class: '',
  },
)

const attrs = useAttrs()

const classes = computed(() =>
  cn(
    'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold outline-none transition-[background-color,border-color,color,box-shadow,transform] duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    {
      'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90':
        props.variant === 'default',
      'bg-secondary text-secondary-foreground hover:bg-secondary/80':
        props.variant === 'secondary',
      'border border-input bg-background hover:bg-accent hover:text-accent-foreground':
        props.variant === 'outline',
      'hover:bg-accent hover:text-accent-foreground': props.variant === 'ghost',
      'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90':
        props.variant === 'destructive',
      'h-10 px-4 py-2': props.size === 'default',
      'h-9 rounded-md px-3': props.size === 'sm',
      'h-11 rounded-md px-6': props.size === 'lg',
      'size-10': props.size === 'icon',
    },
    props.class,
  ),
)
</script>

<template>
  <component
    :is="asChild ? 'span' : 'button'"
    v-bind="attrs"
    :type="asChild ? undefined : type"
    :disabled="disabled"
    :class="classes"
  >
    <slot />
  </component>
</template>
