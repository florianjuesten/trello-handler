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

const today = new Date()

const authParams = '?&key=' + process.env.apiKey + '&token=' + process.env.apiToken
const urlParams = transformParamsToQuery({
  name: process.argv[2] || 'name string missing',
  desc: '',
  idList: process.env.todayListId,
  due:today
})

const url = 'https://api.trello.com/1/cards' + authParams + urlParams
fetch(url, {
  method: 'POST',
  headers: {
    Accept: 'application/json'
  }
})
