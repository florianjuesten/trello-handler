import * as fs from "fs"

import { getDaysBetween, isBefore, isSameDate, nextDay, specificDay } from "./date.helper";

import { CardInfo } from "./types/cardinfo";
import { Jobs } from "./types/jobs";
import { labelMap } from "./maps/label.map";
import { trello } from "./trello.handler";

function createCards(cards: CardInfo[]) {
  for (let index = 0; index < cards.length; index++) {
    const createJob = cards[index];

    const jobDueDate: Date = specificDay(createJob.due as number)
    const jobLabels: string[] = createJob.idLabels.map(nameLabel => labelMap.get(nameLabel))

    trello.createCard(
      {
        name: createJob.name,
        desc: createJob.desc, idList: process.env.waitingListId, due: jobDueDate, idLabels: jobLabels
      }
    )
  }
}

function relocateCard(card: CardInfo): void {
  if (!card.due) return

  const today = new Date()
  const tomorrow = nextDay(new Date())
  const cardDate = new Date(card.due)
  if (isBefore(cardDate, today) || isSameDate(cardDate, today)) {
    trello.moveCard(card.id, process.env.todayListId)
  }
  else if (isSameDate(cardDate, tomorrow)) {
    trello.moveCard(card.id, process.env.tomorrowListId)
  }
  else if (getDaysBetween(today, cardDate) < 7) {
    trello.moveCard(card.id, process.env.thisWeekListId)
  }
  else {
    trello.moveCard(card.id, process.env.waitingListId)
  }
}

async function relocateCardsInList(listId: string) {
  const cards = await trello.getCardsOfList(listId)
  cards.forEach(card => relocateCard(card))
}

async function relocateCards() {
  relocateCardsInList(process.env.todayListId)
  relocateCardsInList(process.env.tomorrowListId)
  relocateCardsInList(process.env.thisWeekListId)
  relocateCardsInList(process.env.waitingListId)
}

async function orderCardsInList(listId: string) {
  const cards = await trello.getCardsOfList(listId)
  cards.sort((cardA: CardInfo, cardB: CardInfo) => {
    if (!cardA.due) return -1
    if (!cardB.due) return 1

    const cardADate = new Date(cardA.due)
    const cardBDate = new Date(cardB.due)

    return cardADate < cardBDate ? -1 : 1
  })

  for (let index = 0; index < cards.length; index++) {
    const card = cards[index];
    trello.setCardPosition(card.id, index)
  }
}

async function orderLists() {
  orderCardsInList(process.env.todayListId)
  orderCardsInList(process.env.tomorrowListId)
  orderCardsInList(process.env.thisWeekListId)
  orderCardsInList(process.env.waitingListId)
}



function checkCreatingJobs() {
  const jobs: Jobs = JSON.parse(fs.readFileSync("trello-jobs.json", "utf8"))
  if (new Date().getDate() === 1) {
    createCards(jobs.createMonthly)
  }
  if (new Date().getDay() === 1) {
    createCards(jobs.createWeekly)
  }
}
checkCreatingJobs()
relocateCards()
orderLists()
