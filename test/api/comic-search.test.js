/* eslint no-undef: 0 */
import axios from 'axios'
import moment from 'moment'
import { ComicModel } from '../../src/models/comic-model'

const API_ROOT = 'http://disneypubworlddev.cp.disney.com/global_titles_library/search/api'
const API_URL = `${API_ROOT}/search-comic.asp`

jest.setTimeout(30000) // 30 second timeout

describe('Search API Tests', () => {
  it('should find a Comic by titleId.', async () => {
    const testId = '809198'
    const url = `${API_URL}?titleId=${testId}`

    // console.log('Getting ' + url)
    const response = await axios.get(url)
    expect(response.data.data).toBeDefined()

    const data = response.data.data
    expect(data.length).toEqual(1)

    // console.log('Raw:' + JSON.stringify(data))

    const results = ComicModel.fromJS(data[0])

    // console.log(`Obj: ${JSON.stringify(results)}` )

    expect(results).toBeDefined()
    expect(results.titleId).toEqual(testId)
  })

  it('should find a Comic with a TAB char in its data.', async () => {
    const testId = '145661'
    const url = `${API_URL}?titleId=${testId}`

    // console.log('Getting ' + url)
    const response = await axios.get(url)
    expect(response.data.data).toBeDefined()

    const data = response.data.data
    expect(data.length).toEqual(1)

    const results = ComicModel.fromJS(data[0])
    expect(results).toBeDefined()
    expect(results.titleId).toEqual(testId)
  })

  it('should find a Comic by magazineName.', async () => {
    const testVal = 'mickey'
    const url = `${API_URL}?magName=${testVal}`

    // console.log('Getting ' + url)
    const response = await axios.get(url)
    expect(response.data.data).toBeDefined()

    const data = response.data.data
    expect(data.length).toBeGreaterThan(0)

    const results = ComicModel.fromJS(data[0])
    expect(results.magazineName.toLowerCase()).toEqual(expect.stringContaining(testVal))
  })

  it('should find Comics by dmcpName', async () => {
    const testVal = 'CgPtTc_DPWCGPT100'
    const url = `${API_URL}?dmcpName=${testVal}`

    // console.log('Getting ' + url)
    const response = await axios.get(url)
    expect(response.data.data).toBeDefined()

    const el = response.data.data[0]
    expect(el.DCSFileName).toEqual(expect.stringMatching(testVal))

    const comic = ComicModel.fromJS(el)
    expect(comic.dmcpFilename).toEqual(expect.stringMatching(testVal))
  })

  it('should find Comics from source \'Adaptation\' and  \'Original\'', async () => {
    // const testVal = 'Adaptation'
    const url = `${API_URL}?sources=Adaptation&sources=Original`

    // console.log('Getting ' + url)
    const response = await axios.get(url)
    expect(response.data.data).toBeDefined()

    // const el = response.data.data[0]
    // expect(el.ContentSource).toEqual(expect.stringMatching(testVal))
    //
    // const comic = ComicModel.fromJS(el)
    // expect(comic.source).toEqual(expect.stringContaining(testVal))
  })

  it('should find Comics with release date in August 2010', async () => {
    const fmt = 'YYYYMMDD'
    const testStart = moment('20100801', fmt)
    const testEnd = moment('20100831', fmt)

    const url = `${API_URL}?shelfStartDate=${testStart.format(fmt)}&shelfEndDate=${testEnd.format(fmt)}`

    const response = await axios.get(url)
    expect(response.data.data).toBeDefined()

    const data = response.data.data

    const comics = data.map(x => ComicModel.fromJS(x))
    const matched = comics.filter(x => x.releaseDate >= testStart && x.releaseDate <= testEnd)

    expect(comics.length).toEqual(matched.length)
  })
})
