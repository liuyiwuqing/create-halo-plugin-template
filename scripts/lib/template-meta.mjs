export const slugify = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const normalizePluginName = (value) => {
  const slug = slugify(value)

  if (!slug) {
    return ''
  }

  if (slug.startsWith('halo-plugin-')) {
    return `plugin-${slug.slice('halo-plugin-'.length)}`
  }

  if (slug.startsWith('plugin-')) {
    return slug
  }

  return `plugin-${slug}`
}

export const normalizeRoutePrefix = (value, pluginName) => {
  const raw = (value?.trim() || `/${pluginName}`).replace(/^\/+/, '')
  if (!raw) {
    return '/'
  }
  return `/${raw.replace(/\/+$/, '')}`
}

export const normalizePermissionPrefix = (value, pluginName) =>
  (value?.trim() || `plugin:${pluginName}`).replace(/:+$/, '')

export const toClassPrefix = (pluginName) => {
  const parts = pluginName.split(/[^a-zA-Z0-9]+/).filter(Boolean)
  if (!parts.length) {
    return 'PluginTemplate'
  }
  return parts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('')
}

export const toKebabToken = (value) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .toLowerCase()

export const reverseBasePackage = (basePackage) =>
  basePackage
    .split('.')
    .map((segment) => segment.trim())
    .filter(Boolean)
    .reverse()
    .join('.')

export const getApiGroupKey = (basePackage) =>
  basePackage
    .split('.')
    .map((segment) => segment.trim())
    .filter(Boolean)
    .at(-1) || 'plugin'
