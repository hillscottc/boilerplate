import { API_ROOT } from '../utils'
import axios from 'axios'
import querystring from 'querystring'

class SubscriptionModel {
  contactId;
  titleId;
  subscriptionType;

  constructor (
    contactId,
    titleId,
    subscriptionType
  ) {
    this.contactId = contactId
    this.titleId = titleId
    this.subscriptionType = subscriptionType
  }

  static fromJS (object) {
    return new SubscriptionModel(
      object['ContactID'],
      object['TitleID'],
      object['SubscriptionType'])
  }
}

export const getSubscriptions = async (contactId) => {
  const qs = querystring.stringify({ContactID: contactId})
  const url = `${API_ROOT}/subscriptions.asp?${qs}`
  const response = await axios.get(url)
  return response.data.data.map(item => SubscriptionModel.fromJS(item))
}

export const remSubscription = async (contactId, titleId, subscriptionType) => {
  const qs = querystring.stringify({
    titleId,
    contactId,
    subType: subscriptionType
  })
  const url = `${API_ROOT}/subscriptions-rem.asp?${qs}`
  const response = await axios.get(url)
  return response.data
}

export const addSubscription = async (contactId, titleId, subscriptionType) => {
  const qs = querystring.stringify({
    titleId,
    contactId,
    subType: subscriptionType
  })
  const response = await axios.get(`${API_ROOT}/subscriptions-post.asp?${qs}`)
  return response.data
}
