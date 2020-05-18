import { getDayAfter, getDaysBetween, getSpecificDayOfMonth, isBefore, isSameDay } from "./date.helper";

import { Card } from "./types/card";
import { CreateCardJob } from "./types/create.card.job";
import { labelMap } from "./maps/label.map";
import { trello } from "./trello";

class JobProcessor {




  public createCards(createCardJobs: CreateCardJob[]) {
    createCardJobs.forEach((createCardJob) => {
      const jobcardDueDate: Date = getSpecificDayOfMonth(createCardJob.dueInDays, createCardJob.hour, createCardJob.minute)
      const jobLabels: string[] = createCardJob.idLabels.map(nameLabel => labelMap.get(nameLabel))

      trello.createCard(
        {
          name: createCardJob.name,
          desc: createCardJob.desc,
          idList: process.env.waitingListId,
          due: jobcardDueDate,
          idLabels: jobLabels
        }
      )
    });
  }

  public async  relocateCards() {
    this.relocateCardsInList(process.env.todayListId)
    this.relocateCardsInList(process.env.tomorrowListId)
    this.relocateCardsInList(process.env.thisWeekListId)
    this.relocateCardsInList(process.env.waitingListId)
  }

  public async  orderLists() {
    this.orderCardsInList(process.env.todayListId)
    this.orderCardsInList(process.env.tomorrowListId)
    this.orderCardsInList(process.env.thisWeekListId)
    this.orderCardsInList(process.env.waitingListId)
  }



  private async  relocateCardsInList(listId: string) {
    const cards = await trello.getCardsOfList(listId)
    cards.forEach(card => this.relocateCard(card))
  }

  private relocateCard(card: Card): void {
    if (!card.due) return

    const today = new Date()
    const tomorrow = getDayAfter(new Date())
    const cardDate = new Date(card.due)
    if (isBefore(cardDate, today) || isSameDay(cardDate, today)) {
      trello.moveCard(card.id, process.env.todayListId)
    }
    else if (isSameDay(cardDate, tomorrow)) {
      trello.moveCard(card.id, process.env.tomorrowListId)
    }
    else if (getDaysBetween(today, cardDate) < 7) {
      trello.moveCard(card.id, process.env.thisWeekListId)
    }
    else {
      trello.moveCard(card.id, process.env.waitingListId)
    }
  }

  private async  orderCardsInList(listId: string) {
    const cards = await trello.getCardsOfList(listId)
    cards.sort(this.sortCards)

    cards.forEach((card, index) => trello.setCardPosition(card.id, index))
  }

  private sortCards(cardA: Card, cardB: Card) {
    if (!cardA.due) return -1
    if (!cardB.due) return 1

    const cardADate = new Date(cardA.due)
    const cardBDate = new Date(cardB.due)

    return cardADate < cardBDate ? -1 : 1
  }
}

export const jobProcessor = new JobProcessor()
