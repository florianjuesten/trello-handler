import { Card } from './types/card'
import { Endpoint } from './types/endpoints'
import { RequestMethod } from './types/request.method'
import dotenv from 'dotenv'
import fetch from 'node-fetch'

dotenv.config()

class Trello {
  private readonly TRELLO_API_URL: string = 'https://api.trello.com/1'

  constructor(private apiKey: string, private apiToken: string) {}

  public async createCard(cardInfo: Card) {
    await this.makeRequest(Endpoint.Cards, RequestMethod.POST, '', cardInfo)
  }

  public async moveCard(cardId: string, listId: string) {
    await this.makeRequest(Endpoint.Cards, RequestMethod.PUT, '/' + cardId, { idList: listId })
  }

  public async setCardPosition(cardId: string, position: number) {
    // console.log(cardId, position)
    await this.makeRequest(Endpoint.Cards, RequestMethod.PUT, '/' + cardId, { pos: position })
  }

  public async getCardsOfList(listId: string): Promise<Card[]> {
    return await this.makeRequest(Endpoint.Lists, RequestMethod.GET, '/' + listId + '/cards')
  }

  private async makeRequest(endpoint: Endpoint, requestMethod: RequestMethod, path: string, params?: {}) {
    const authParams = '?&key=' + this.apiKey + '&token=' + this.apiToken
    const urlParams = params ? this.transformParamsToQuery(params) : ''

    const response = await fetch(this.TRELLO_API_URL + endpoint + path + '?' + authParams + urlParams, {
      method: requestMethod,
      headers: {
        Accept: 'application/json'
      }
    })

    return await response.json()
  }

  private transformParamsToQuery(params: {}): string {
    const urlParams = Object.keys(params)
      .map(function (k) {
        return '&' + encodeURIComponent(k) + '=' + encodeURIComponent((params as any)[k])
      })
      .join('&')
    return urlParams
  }
}

export const trello = new Trello(process.env.apiKey, process.env.apiToken)
