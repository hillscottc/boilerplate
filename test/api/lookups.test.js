import axios from 'axios';

const API_ROOT = "http://disneypubworlddev.cp.disney.com/global_titles_library/search/api";

describe('Lookup API Tests', () => {

  it('should be able to run tests', () => {
    expect(1 + 2).toEqual(3);
  });

  it('should get a country list with "United States" in it', async () => {
    const response = await axios.get(`${API_ROOT}/countries.asp`);
    expect(response.data.data).toBeDefined();
    const data = response.data.data;

    const el = data.find(x => x.Country === "United States");
    expect(el).toBeDefined();
  });

  it('should get an ebook list with "android" in it', async () => {
    const response = await axios.get(`${API_ROOT}/ebook.asp`);
    expect(response.data.data).toBeDefined();

    const data = response.data.data;
    const el = data.find(x => x.EBookFormatType === "android");
    expect(el).toBeDefined();
  });

  it('should get an Category/Format list with "Audio" in it', async () => {
    const response = await axios.get(`${API_ROOT}/format.asp`);
    expect(response.data.data).toBeDefined();

    const data = response.data.data;
    const el = data.find(x => x.FormatName === "Audio");
    expect(el).toBeDefined();
  });

  it('should get a franchise list with "ABC Family" in it', async () => {
    const response = await axios.get(`${API_ROOT}/franchise.asp`);
    expect(response.data.data).toBeDefined();

    const data = response.data.data;
    const el = data.find(x => x.Franchise === "ABC Family");
    expect(el).toBeDefined();
  });

  it('should get a Property Category list with "ABC Media" in it', async () => {
    const response = await axios.get(`${API_ROOT}/propCats.asp`);
    expect(response.data.data).toBeDefined();

    const data = response.data.data;
    // console.log(data);
    const el = data.find(x => x.ListItem === "ABC Media");
    expect(el).toBeDefined();
  });

  it('should get a Properties list with "Aladdin" in it', async () => {
    const response = await axios.get(`${API_ROOT}/properties.asp`);
    expect(response.data.data).toBeDefined();

    const data = response.data.data;
    // console.log(data);
    const el = data.find(x => x.PropertyName === "Aladdin");
    expect(el).toBeDefined();
  });

  it('should get a Publishers list with "Abrams Books" in it', async () => {
    const response = await axios.get(`${API_ROOT}/publishers.asp`);
    expect(response.data.data).toBeDefined();

    const data = response.data.data;
    // console.log(data);
    const el = data.find(x => x.PublisherName === "Abrams Books");
    expect(el).toBeDefined();
  });

  it('should get a Series list with "100 First Words" in it', async () => {
    const response = await axios.get(`${API_ROOT}/series.asp`);
    expect(response.data.data).toBeDefined();

    const data = response.data.data;
    // console.log(data);
    const el = data.find(x => x.SeriesName === "100 First Words");
    expect(el).toBeDefined();
  });

});
