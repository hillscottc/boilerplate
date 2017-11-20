import { API_ROOT } from '../utils';
import axios from 'axios';

class PropertyModel {
  propertyId;
  propertyName;

  constructor(
    propertyId,
    propertyName
  ) {
    this.propertyId = propertyId;
    this.propertyName = propertyName;
  }

  static fromJS(object) {
    return new PropertyModel(
      object["PropertyID"],
      object["PropertyName"]);
  }
}

export const getPropertyOpts = async () => {
  const response = await axios.get(`${API_ROOT}/properties.asp`);
  const items = response.data.data.map(item => PropertyModel.fromJS(item));
  return items.map((item) => {
    return {value: item.propertyId, label: item.propertyName}
  });
};