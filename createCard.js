const fetch = require('node-fetch')
const dotenv = require('dotenv')
dotenv.config()

function transformParamsToQuery(params) {
  const urlParams = Object.keys(params)
    .map(function (k) {
      return '&' + encodeURIComponent(k) + '=' + encodeURIComponent(params[k])
    })
    .join('&')
  return urlParams
}

const getDayAfter = (date) => {
  const nextDate = new Date(date.getTime())
  nextDate.setDate(date.getDate() + 1)
  return nextDate
}

const getSpecificDay = (differenceInDays, hours, minutes, month) => {
  const specificDate = new Date()
  specificDate.setDate(specificDate.getDate() + parseInt(differenceInDays))
  if (hours) specificDate.setHours(hours)
  if (minutes) specificDate.setMinutes(minutes)
  if (month) specificDate.setMonth(month)

  specificDate.setSeconds(0)
  specificDate.setMilliseconds(0)

  return specificDate
}

const creationDate = process.argv[3] != null ? getSpecificDay(process.argv[3],0,0,0) : new Date()

let followDate = creationDate
const authParams = '?&key=' + process.env.apiKey + '&token=' + process.env.apiToken
const creationCount = process.argv[4] || 1
for (let index = 0; index < creationCount; index++) {
  const urlParams = transformParamsToQuery({
    name: process.argv[2] || 'name string missing',
    desc: '',
    idList: process.env.todayListId,
    due: followDate
  })

  const url = 'https://api.trello.com/1/cards' + authParams + urlParams
  fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    }
  })

  followDate = getDayAfter(followDate)
}
