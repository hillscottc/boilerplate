import { API_ROOT } from '../utils'
import axios from 'axios'

// No way to provide an ID for Franchise because it's defined as "SELECT DISTINCT Franchise FROM Properties....". Yuck.
// Luckily, none of them have special chars right now.

class FranchiseModel {
  franchiseName;

  constructor (franchiseName) {
    this.franchiseName = franchiseName
  }

  static fromJS (object) {
    return new FranchiseModel(
      object['Franchise'])
  }
}

export const getFranchiseOpts = async () => {
  const response = await axios.get(`${API_ROOT}/franchise.asp`)
  const items = response.data.data.map(item => FranchiseModel.fromJS(item))
  return items.map((item) => {
    return {value: item.franchiseName, label: item.franchiseName}
  })
}
