import { CreateCardJob } from "./create.card.job";

export interface Jobs {
  createMonthly: CreateCardJob[]
  createWeekly: CreateCardJob[]
  createYearly: CreateCardJob[]
  orderLists: boolean
  relocateCards: boolean
}
