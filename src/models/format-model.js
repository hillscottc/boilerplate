import { API_ROOT } from '../utils'
import axios from 'axios'

class FormatModel {
  id;
  name;

  constructor (id, name) {
    this.id = id
    this.name = name
  }

  static fromJS (object) {
    return new FormatModel(
      object['FormatID'],
      object['FormatName'])
  }
}

export const getFormatOpts = async () => {
  const response = await axios.get(`${API_ROOT}/format.asp`)
  const items = response.data.data.map(item => FormatModel.fromJS(item))
  return items.map((item) => {
    return {value: item.id, label: item.name}
  })
}
