import { getDayAfter, getDaysBetween, getSpecificDay, isBefore, isSameDay } from './date.helper'

import { Card } from './types/card'
import { CreateCardJob } from './types/create.card.job'
import { labelMap } from './maps/label.map'
import { logger } from './logger'
import { trello } from './trello'

class JobProcessor {
  public async createCards(createCardJobs: CreateCardJob[]) {
    if (!createCardJobs || !createCardJobs[0]) {
      logger.info('No Jobs to create.')
      return
    }
    if (await this.isJobCreationNeeded(createCardJobs[0])) {
      createCardJobs.forEach((createCardJob) => {
        const jobcardDueDate: Date = getSpecificDay(createCardJob.due, createCardJob.hour, createCardJob.minute, createCardJob.month)
        const jobLabels: string[] = createCardJob.idLabels.map((nameLabel) => labelMap.get(nameLabel))

        trello.createCard({
          name: createCardJob.name,
          desc: createCardJob.desc || '',
          idList: process.env.waitingListId,
          due: jobcardDueDate,
          idLabels: jobLabels
        })
      })
    } else {
      logger.info('No job creation needed.')
    }
  }

  public async relocateCards() {
    this.relocateCardsInList(process.env.todayListId)
    this.relocateCardsInList(process.env.tomorrowListId)
    this.relocateCardsInList(process.env.thisWeekListId)
    this.relocateCardsInList(process.env.waitingListId)
  }

  public async orderLists() {
    this.orderCardsInList(process.env.todayListId)
    this.orderCardsInList(process.env.tomorrowListId)
    this.orderCardsInList(process.env.thisWeekListId)
    this.orderCardsInList(process.env.waitingListId)
  }

  private async relocateCardsInList(listId: string) {
    const cards = await trello.getCardsOfList(listId)
    cards.forEach((card) => this.relocateCard(card))
  }

  private relocateCard(card: Card): void {
    if (!card.due) return

    const today = new Date()
    const tomorrow = getDayAfter(new Date())
    const cardDate = new Date(card.due)
    if (isBefore(cardDate, today) || isSameDay(cardDate, today)) {
      trello.moveCard(card.id, process.env.todayListId)
    } else if (isSameDay(cardDate, tomorrow)) {
      trello.moveCard(card.id, process.env.tomorrowListId)
    } else if (getDaysBetween(today, cardDate) < 7) {
      trello.moveCard(card.id, process.env.thisWeekListId)
    } else {
      trello.moveCard(card.id, process.env.waitingListId)
    }
  }

  private async orderCardsInList(listId: string) {
    const cards = await trello.getCardsOfList(listId)
    // cards.forEach(card => {
    //   console.log(card.name, card.id, card.due)
    // });

    cards.sort(this.sortCards)

    // cards.forEach(card => {
    //   console.log(card.name, card.id, card.due)
    // });

    cards.forEach((card, index) => trello.setCardPosition(card.id, index))
  }

  private sortCards(cardA: Card, cardB: Card) {
    if (!cardA.due) return -1
    if (!cardB.due) return 1

    const cardADate = new Date(cardA.due)
    const cardBDate = new Date(cardB.due)

    return cardADate < cardBDate ? -1 : 1
  }

  private async isJobCreationNeeded(createCardJob: CreateCardJob): Promise<boolean> {
    if (!createCardJob) return false

    var creationNeeded = true

    const searchResult = await trello.searchCard(createCardJob.name)

    if (searchResult.cards && searchResult.cards.length > 0) {
      const createCardDate = getSpecificDay(createCardJob.due, createCardJob.hour, createCardJob.minute, createCardJob.month)
      searchResult.cards.forEach((searchResultCard: any) => {
        try {
          const searchCardDate = new Date(searchResultCard.due)
          if (!searchResultCard.closed && isSameDay(createCardDate, searchCardDate)) {
            creationNeeded = false
          }
        } catch (error) {
          logger.error('Could not parse searchresult card')
          logger.error(error)
        }
      })
    }

    logger.info('Jobreation needed: ' + creationNeeded)
    return creationNeeded
  }
}

export const jobProcessor = new JobProcessor()
