<script setup lang="ts">
import { ElTag } from 'element-plus'
import { computed } from 'vue'
import { toTagType } from '@/lib/template'

const props = defineProps<{
  label: string
  tone?: string
}>()

const tagType = computed(() => toTagType(props.tone))
</script>

<template>
  <ElTag :type="tagType" round effect="light">
    {{ label }}
  </ElTag>
</template>
