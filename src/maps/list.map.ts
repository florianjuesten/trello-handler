const dotenv = require("dotenv")
dotenv.config();

export const listMap = new Map()
listMap.set("today", process.env.todayListId)
listMap.set("tomorrow", process.env.tomorrowListId)
listMap.set("thisWeek", process.env.thisWeekListId)
listMap.set("waiting", process.env.waitingListId)
