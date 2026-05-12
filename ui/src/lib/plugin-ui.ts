export const resolveDensityClass = (density?: string) => {
  if (density === 'compact') {
    return 'halo-plugin-template-admin-shell--compact'
  }
  if (density === 'relaxed') {
    return 'halo-plugin-template-admin-shell--relaxed'
  }
  return 'halo-plugin-template-admin-shell--balanced'
}

export const buildShellStyles = (accentColor?: string) => {
  if (!accentColor) {
    return undefined
  }

  return {
    '--halo-plugin-template-color-primary': accentColor,
  }
}
