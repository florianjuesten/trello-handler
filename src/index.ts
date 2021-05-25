import * as fs from 'fs'

import { Jobs } from './types/jobs'
import { getWeekNumber } from './date.helper'
import { jobProcessor } from './job.processor'
import { logger } from './logger'

function sleep(milliseconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds)
  })
}

async function processJobs() {
  let jobs: Jobs = JSON.parse(fs.readFileSync('trello-jobs.json', 'utf8'))

  // if (process.env.NODE_ENV === 'development') {
  //   jobs = JSON.parse(fs.readFileSync('debug-jobs.json', 'utf8'))
  // }

  const timeofExecution = new Date()

  switch (timeofExecution.getDay()) {
    case 0:
      logger.info('Creating sunday cards.')
      await jobProcessor.createCards(jobs.createSunday)
      await sleep(2000)

      logger.info('Creating weekly cards.')
      await jobProcessor.createCards(jobs.createWeekly)
      await sleep(2000)

      if (getWeekNumber(timeofExecution)[1] % 2 === 1) {
        logger.info('Creating weekly even cards.')
        await jobProcessor.createCards(jobs.createWeeklyEven)
        await sleep(2000)
      } else if (getWeekNumber(timeofExecution)[1] % 2 === 0) {
        logger.info('Creating weekly odd cards.')
        await jobProcessor.createCards(jobs.createWeeklyOdd)
        await sleep(2000)
      }
      break
    case 1:
      logger.info('Creating monday cards.')
      await jobProcessor.createCards(jobs.createMonday)
      await sleep(2000)
      break
    case 2:
      logger.info('Creating tuesday cards.')
      await jobProcessor.createCards(jobs.createTuesday)
      await sleep(2000)
      break
    case 3:
      logger.info('Creating wednesday cards.')
      await jobProcessor.createCards(jobs.createWednesday)
      await sleep(2000)
      break
    case 4:
      logger.info('Creating thursday cards.')
      await jobProcessor.createCards(jobs.createThursday)
      await sleep(2000)
      break
    case 5:
      logger.info('Creating friday cards.')
      await jobProcessor.createCards(jobs.createFriday)
      await sleep(2000)
      break
    case 6:
      logger.info('Creating saturday cards.')
      await jobProcessor.createCards(jobs.createSaturday)
      await sleep(2000)
      break
    default:
      break
  }

  if (timeofExecution.getDate() === 1) {
    if ((timeofExecution.getMonth() + 1) % 3 === 0) {
      logger.info('Creating quarterly cards.')
      await jobProcessor.createCards(jobs.createQuarterly)
    }
    if ((timeofExecution.getMonth() + 1) % 2 === 0) {
      logger.info('Creating monthly even cards.')
      await jobProcessor.createCards(jobs.createMonthlyEven)
    } else {
      logger.info('Creating monthly odd cards.')
      await jobProcessor.createCards(jobs.createMonthlyOdd)
    }

    logger.info('Creating monthly cards.')
    await jobProcessor.createCards(jobs.createMonthly)
    await sleep(2000)
  }

  if (timeofExecution.getMonth() === 0 && timeofExecution.getDate() === 1) {
    logger.info('Creating yearly cards.')
    await jobProcessor.createCards(jobs.createYearly)
    await sleep(2000)
  }

  for (let index = 0; index < 5; index++) {
    logger.info('Relocating cards')
    if (jobs.relocateCards) await jobProcessor.relocateCards()
    await sleep(5000)
    logger.info('Ordering lists')
    if (jobs.orderLists) await jobProcessor.orderLists()
    await sleep(5000)
  }
}

async function runAutomator() {
  try {
    logger.info('Starting to process jobs')
    await processJobs()
    logger.info('Finished trello jobs.')
  } catch (error) {
    logger.error('An error occured processing the trello jobs.')
    logger.error(error)
  }
}

runAutomator()
