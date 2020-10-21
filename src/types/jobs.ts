import { CreateCardJob } from './create.card.job'

export interface Jobs {
  createMonday:CreateCardJob[]
  createTuesday:CreateCardJob[]
  createWednesDay:CreateCardJob[]
  createThursday:CreateCardJob[]
  createFriday:CreateCardJob[]
  createSaturday:CreateCardJob[]
  createSunday:CreateCardJob[]
  createMonthly: CreateCardJob[]
  createWeekly: CreateCardJob[]
  createWeeklyEven: CreateCardJob[]
  createWeeklyOdd: CreateCardJob[]
  createYearly: CreateCardJob[]
  orderLists: boolean
  relocateCards: boolean
}
