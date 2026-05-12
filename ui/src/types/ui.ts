export type DataTableAlign = 'left' | 'center' | 'right'

export interface DataTableColumn<T = object> {
  key: keyof T | string
  label: string
  minWidth?: number
  width?: number
  align?: DataTableAlign
  mobileVisible?: boolean
  formatter?: (value: unknown, row: T, column: DataTableColumn<T>) => string
}

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface DataPagination {
  page: number
  size: number
  total: number
  sizeOptions?: number[]
}
