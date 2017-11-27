import axios from 'axios';
import { BookModel }from '../../src/models/book-model';


const API_ROOT = "http://disneypubworlddev.cp.disney.com/global_titles_library/search/api";
const api_url = `${API_ROOT}/search-book.asp`;

jest.setTimeout(30000); // 30 second timeout

describe('Search API Tests', () => {

  it('should find a Book by titleId with a single quote in name.', async () => {
    const testId = "12329";
    const url = `${api_url}?titleId=${testId}`;

    // console.log("Getting " + url);
    const response = await axios.get(url);
    expect(response.data.data).toBeDefined();

    const data = response.data.data;
    expect(data.length).toEqual(1);

    // console.log(data);
    const el = data.find(x => x.TitleID === testId);
    expect(el).toBeDefined();
  });


  it('should find a Book by disrefnum with a carriage return in the data .', async () => {
    const testVal = "100913111";
    const url = `${api_url}?refNum=${testVal}`;

    // console.log("Getting " + url);
    const response = await axios.get(url);
    expect(response.data.data).toBeDefined();

    const data = response.data.data;
    expect(data.length).toEqual(1);

    // console.log(data);
    const el = data.find(x => x.DisneyRefNumber === testVal);
    expect(el).toBeDefined();
  });

  it('should find a Book by titleId with a double quote in name.', async () => {
    const testId = "31645";
    const url = `${api_url}?titleId=${testId}`;

    // console.log("Getting " + url);
    const response = await axios.get(url);
    expect(response.data.data).toBeDefined();

    const data = response.data.data;
    expect(data.length).toEqual(1);

    const el = data.find(x => x.TitleID === testId);
    expect(el).toBeDefined();
  });


  it('should find Books by title "pooh"', async () => {
    const testVal = "pooh";
    const url = `${api_url}?title=${testVal}`;

    // console.log("Getting " + url);
    const response = await axios.get(url);
    expect(response.data.data).toBeDefined();

    const data = response.data.data;
    expect(data.length).toBeGreaterThan(9)
  });


  it('should find Books by title "winnie"', async () => {
    const testVal = "winnie";
    const url = `${api_url}?title=${testVal}`;

    // console.log("Getting " + url);
    const response = await axios.get(url);
    expect(response.data.data).toBeDefined();

    const data = response.data.data;
    expect(data.length).toBeGreaterThan(9)
  });


  it('should find Books by dmcpName "Bambi"', async () => {
    const testVal = "Bambi";
    const url = `${api_url}?dmcpName=${testVal}`;

    // console.log("Getting " + url);
    const response = await axios.get(url);
    expect(response.data.data).toBeDefined();

    const el = response.data.data[0];
    expect(el.DCSFileName).toEqual(expect.stringContaining(testVal));

    const book = BookModel.fromJS(el);
    expect(book.dmcpFilename).toEqual(expect.stringContaining(testVal));
  });


  it('should find Books from source "Adaptation"', async () => {
    const testVal = "Adaptation";
    const url = `${api_url}?sources=${testVal}`;

    // console.log("Getting " + url);
    const response = await axios.get(url);
    expect(response.data.data).toBeDefined();

    const el = response.data.data[0];
    expect(el.ContentSource).toEqual(expect.stringMatching(testVal));

    const book = BookModel.fromJS(el);
    expect(book.source).toEqual(expect.stringContaining(testVal));
  });


});
