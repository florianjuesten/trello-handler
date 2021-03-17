export interface CreateCardJob {
  name: string
  desc?: string
  idList: string
  due: number
  hour: number
  minute: number
  month?: number
  idLabels?: string[],
  checklist?: string[]
}
