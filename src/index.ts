import { trello } from "./trello.handler";

const dotenv = require("dotenv")
const fs = require("fs")

dotenv.config();




trello.createCard({ name: "Class test card", desc: "test desc", idList: process.env.privateTodayListId })



// fetch('https://api.trello.com/1/cards/CARD_ID/due?key=' + process.env.trelloApiKey + '&token=' + process.env.trelloApiToken + '&value=' + new Date() + '', {
//   method: 'PUT',
//   headers: {
//     'Accept': 'application/json'
//   }
// })
//   .then(response => {
//     console.log(
//       `Response: ${response.status} ${response.statusText}`
//     );
//     return response.text();
//   })
//   .then(text => console.log(text))
//   .catch(err => console.error(err));


//     // array sort

