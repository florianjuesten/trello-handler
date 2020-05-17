import { RequestInit, Response } from "node-fetch";

import { CardInfo } from "./types/cardinfo";
import { Endpoint } from "./types/endpoints";
import { RequestMethod } from "./types/request.method";

const dotenv = require("dotenv")
dotenv.config();

const fetch = require('node-fetch');

class TrelloHandler {
  private readonly TRELLO_API_URL: string = "https://api.trello.com/1"

  constructor(private apiKey: string, private apiToken: string) {

  }

  public createCard(cardInfo: CardInfo) {
    this.makeRequest(Endpoint.Cards, RequestMethod.POST, cardInfo)
  }

  public moveCard() {

  }

  public sort() {

  }

  private makeRequest(endpoint: Endpoint, requestMethod: RequestMethod, params: {}) {
    const authParams = '&key=' + this.apiKey + '&token=' + this.apiToken
    const urlParams = this.transformParamsToQuery(params)

    console.log(this.TRELLO_API_URL + endpoint + authParams + urlParams)
    fetch(this.TRELLO_API_URL + endpoint + '?' + authParams + urlParams, {
      method: requestMethod,
      headers: {
        'Accept': 'application/json'
      }

    })
      .then((response: Response) => {
        console.log(
          `Response: ${response.status} ${response.statusText}`
        );
        return response.text();
      })
      .then((text: string) => console.log(text))
      .catch((error: Error) => console.error(error));
  }

  private transformParamsToQuery(params: {}): string {
    const urlParams = Object.keys(params).map(function (k) {
      return "&" + encodeURIComponent(k) + '=' + encodeURIComponent((params as any)[k])
    }).join('&')
    return urlParams
  }
}


export const trello = new TrelloHandler(process.env.apiKey, process.env.apiToken)
