import * as fs from "fs"

import { Jobs } from "./types/jobs";
import { jobProcessor } from "./job.processor";

async function processJobs() {
  const jobs: Jobs = JSON.parse(fs.readFileSync("trello-jobs.json", "utf8"))

  const timeofExecution = new Date()

  if (timeofExecution.getDay() === 0) {
    jobProcessor.createCards(jobs.createWeekly)
  }

  if (timeofExecution.getDate() === 1) {
    jobProcessor.createCards(jobs.createMonthly)
  }

  if (timeofExecution.getMonth() === 0 && timeofExecution.getDate() === 1) {
    jobProcessor.createCards(jobs.createYearly)
  }

  if (jobs.relocateCards) await jobProcessor.relocateCards()
  if (jobs.orderLists) await jobProcessor.orderLists()
}

processJobs()
