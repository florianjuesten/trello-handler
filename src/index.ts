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

  // console.log('timeofExecution.getDay())', timeofExecution.getDay()))
  switch (timeofExecution.getDay()) {
    case 0:
      jobProcessor.createCards(jobs.createSunday)
      await sleep(2000)

      jobProcessor.createCards(jobs.createWeekly)
      await sleep(2000)

      if (getWeekNumber(timeofExecution)[1] % 2 === 1) {
        jobProcessor.createCards(jobs.createWeeklyEven)
        await sleep(2000)
      } else if (getWeekNumber(timeofExecution)[1] % 2 === 0) {
        jobProcessor.createCards(jobs.createWeeklyOdd)
        await sleep(2000)
      }
      break
    case 1:
      jobProcessor.createCards(jobs.createMonday)
      await sleep(2000)
      break
    case 2:
      jobProcessor.createCards(jobs.createTuesday)
      await sleep(2000)
      break
    case 3:
      jobProcessor.createCards(jobs.createWednesDay)
      await sleep(2000)
      break
    case 4:
      jobProcessor.createCards(jobs.createThursday)
      await sleep(2000)
      break
    case 5:
      jobProcessor.createCards(jobs.createFriday)
      await sleep(2000)
      break
    case 6:
      jobProcessor.createCards(jobs.createSaturday)
      await sleep(2000)
      break
    default:
      break
  }

  if (timeofExecution.getDate() === 1) {
    if ((timeofExecution.getMonth() + 1) % 3 === 0) {
      jobProcessor.createCards(jobs.createQuarterly)
    }
    if ((timeofExecution.getMonth() + 1) % 2 === 0) {
      jobProcessor.createCards(jobs.createMonthlyEven)
    } else {
      jobProcessor.createCards(jobs.createMonthlyOdd)
    }

    jobProcessor.createCards(jobs.createMonthly)
    await sleep(2000)
  }

  if (timeofExecution.getMonth() === 0 && timeofExecution.getDate() === 1) {
    jobProcessor.createCards(jobs.createYearly)
    await sleep(2000)
  }

  if (jobs.relocateCards) await jobProcessor.relocateCards()
  if (jobs.orderLists) await jobProcessor.orderLists()
}

try {
  logger.info('Starting to process jobs')
  processJobs()
  logger.info('Finished trello jobs.')
} catch (error) {
  logger.error('An error occured processing the trello jobs.')
  logger.error(error)
}
