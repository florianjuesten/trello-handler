export interface CreateCardJob {
  name: string
  desc?: string
  idList: string
  dueInDays: number
  hour: number
  minute: number
  idLabels?: string[]
}
