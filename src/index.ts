import * as fs from "fs"

import { Jobs } from "./types/jobs";
import { jobProcessor } from "./job.processor";

function sleep(milliseconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

async function processJobs() {
  const jobs: Jobs = JSON.parse(fs.readFileSync("trello-jobs.json", "utf8"))

  const timeofExecution = new Date()

  if (timeofExecution.getDay() === 0) {
    jobProcessor.createCards(jobs.createWeekly)
    await sleep(2000)
  }

  if (timeofExecution.getDate() === 1) {
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

processJobs()
