import { API_ROOT } from '../utils';
import axios from 'axios';


class PropCat {
  propCatId;
  propCatValue;

  constructor(propCatId, propCatValue) {
    this.propCatId = propCatId;
    this.propCatValue = propCatValue;
  }

  static fromJS(object) {
    return new PropCat(
      object["id"],
      object["ListItem"]);
  }
}

export const getPropCatOpts = async () => {
  const response = await axios.get(`${API_ROOT}/propCats.asp`);
  const items = response.data.data.map(item => PropCat.fromJS(item));
  return items.map((item) => {
    return {value: item.propCatId, label: item.propCatValue}
  });
};