import { onBeforeUnmount, onMounted, ref } from 'vue'

export const useDocumentTheme = () => {
  const isDark = ref(false)
  let observer: MutationObserver | undefined

  const sync = () => {
    if (typeof document === 'undefined') {
      isDark.value = false
      return
    }
    isDark.value = document.documentElement.classList.contains('dark')
  }

  onMounted(() => {
    sync()
    observer = new MutationObserver(sync)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
  })

  return {
    isDark,
  }
}
