import { API_ROOT } from '../utils'
import axios from 'axios'

class EBookModel {
  id;
  name;

  constructor (id, name) {
    this.id = id
    this.name = name
  }

  static fromJS (object) {
    return new EBookModel(
      object['id'],
      object['EBookFormatType'])
  }
}

export const getEBookOpts = async () => {
  const response = await axios.get(`${API_ROOT}/ebook.asp`)
  const items = response.data.data.map(item => EBookModel.fromJS(item))
  return items.map((item) => {
    return {value: item.id, label: item.name}
  })
}
