const dotenv = require("dotenv")
const fs = require("fs")

dotenv.config();


var Trello = function (key, token) {
  this.uri = "https://api.trello.com";
  this.key = process.env.trelloApiKey;
  this.token = process.env.token;




};


const fetch = require('node-fetch');

// fetch('https://api.trello.com/1/cards?key=' + process.env.trelloApiKey + '&token=' + process.env.trelloApiToken + '&name=testcard&idList=LISTID&desc=descriptiontext', {
//     method: 'POST',
//     headers: {
//         'Accept': 'application/json'
//     }
// })
//     .then(response => {
//         console.log(
//             `Response: ${response.status} ${response.statusText}`
//         );
//         return response.text();
//     })
//     .then(text => console.log(text))
//     .catch(err => console.error(err));

fetch('https://api.trello.com/1/cards/CARD_ID/due?key=' + process.env.trelloApiKey + '&token=' + process.env.trelloApiToken + '&value=' + new Date() + '', {
  method: 'PUT',
  headers: {
    'Accept': 'application/json'
  }
})
  .then(response => {
    console.log(
      `Response: ${response.status} ${response.statusText}`
    );
    return response.text();
  })
  .then(text => console.log(text))
  .catch(err => console.error(err));


    // array sort
