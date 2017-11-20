import { API_ROOT } from '../utils';
import axios from 'axios';

export class CountryModel {
  id;
  country;

  constructor(id, country) {
    this.id = id;
    this.country = country;
  }

  static fromJS(object) {
    return new CountryModel(
      object["id"],
      object["Country"]);
  }
}

export const getCountryOpts = async () => {
  const response = await axios.get(`${API_ROOT}/countries.asp`);
  const items = response.data.data.map(item => CountryModel.fromJS(item));
  return items.map((item) => {
    return {value: item.id, label: item.country}
  });
};


