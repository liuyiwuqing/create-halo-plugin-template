export const resolveElementSize = (density?: string) => {
  if (density === 'compact') {
    return 'small'
  }
  if (density === 'relaxed') {
    return 'large'
  }
  return 'default'
}

export const buildShellStyles = (accentColor?: string) => {
  if (!accentColor) {
    return undefined
  }

  return {
    '--halo-plugin-template-color-primary': accentColor,
  }
}
