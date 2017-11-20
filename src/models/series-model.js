import { API_ROOT } from '../utils';
import axios from 'axios';

class SeriesModel {
  id;
  name;

  constructor(id, name) {
    this.id = id;
    this.name = name;
  }

  static fromJS(object) {
    return new SeriesModel(
      object["SeriesID"],
      object["SeriesName"]);
  }
}

export const getSeriesOpts = async () => {
  const response = await axios.get(`${API_ROOT}/series.asp`);
  const items = response.data.data.map(item => SeriesModel.fromJS(item));
  return items.map((item) => {
    return {value: item.id, label: item.name}
  });
};

