import { API_ROOT } from '../utils'
import axios from 'axios'

class PublisherModel {
  publisherId;
  publisherName;

  constructor (publisherId, publisherName) {
    this.publisherId = publisherId
    this.publisherName = publisherName
  }

  static fromJS (object) {
    return new PublisherModel(
      object['PublisherID'],
      object['PublisherName'])
  }
}

export const getPublisherOpts = async () => {
  const response = await axios.get(`${API_ROOT}/publishers.asp`)
  const items = response.data.data.map(item => PublisherModel.fromJS(item))
  return items.map((item) => {
    return {value: item.publisherId, label: item.publisherName}
  })
}
