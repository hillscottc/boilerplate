import axios from 'axios';
import { ComicModel }from '../../src/models/comic-model';

const API_ROOT = "http://disneypubworlddev.cp.disney.com/global_titles_library/search/api";
const api_url = `${API_ROOT}/search-comic.asp?`;

jest.setTimeout(30000); // 30 second timeout

describe('Pagination Tests', () => {

  it('should get default (length 10) paged comic list.', async () => {
    const response = await axios.get(api_url);
    const comics = response.data.data.map(x => ComicModel.fromJS(x));

    // print the titleIds
    // console.log(comics.map((x) => x.titleId));

    expect(comics.length).toEqual(10);
  });


  it('should get limit=5', async () => {
    const response = await axios.get(api_url + "limit=5");
    const comics = response.data.data.map(x => ComicModel.fromJS(x));
    expect(comics.length).toEqual(5);
  });


  it('should get limit=5&offset=1', async () => {
    const response = await axios.get(api_url + "limit=5&offset=1");
    const comics = response.data.data.map(x => ComicModel.fromJS(x));
    expect(comics.length).toEqual(5);
  });


  it('offset 0 and 1 are equivalent', async () => {
    let response = await axios.get(api_url + "limit=5&offset=0");
    const data1 = response.data.data;

    response = await axios.get(api_url + "limit=5&offset=1");
    const data2 = response.data.data;

    expect(data1).toEqual(data2);
  });


  it('should get limit=5&offset=2', async () => {
    const response = await axios.get(api_url + "limit=5&offset=2");
    const comics = response.data.data.map(x => ComicModel.fromJS(x));
    expect(comics.length).toEqual(5);
  });


  it('1st item in 2nd page of 5-list matches 6th item in a 10-list', async () => {

    let resp = await axios.get(api_url + "limit=15&offset=0");
    const comicsBig = resp.data.data.map(x => ComicModel.fromJS(x));

    // print the titleIds
    // console.log(comicsBig.map((x) => x.titleId));

    resp = await axios.get(api_url + "limit=5&offset=2");
    let comicsSmall = resp.data.data.map(x => ComicModel.fromJS(x));
    expect(comicsSmall[0].titleId).toEqual(comicsBig[5].titleId);




  });


  it('1st item in 3rd page of 3-list matches 10th item in a 15-list', async () => {

    let resp = await axios.get(api_url + "limit=15&offset=0");
    const comicsBig = resp.data.data.map(x => ComicModel.fromJS(x));

    // print the titleIds
    // console.log(comicsBig.map((x) => x.titleId));


    resp = await axios.get(api_url + "limit=5&offset=3");
    const comicsSmall = resp.data.data.map(x => ComicModel.fromJS(x));
    expect(comicsSmall[0].titleId).toEqual(comicsBig[10].titleId);


  });




});
