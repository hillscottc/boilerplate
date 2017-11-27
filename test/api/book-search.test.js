/* eslint no-undef: 0 */
import axios from 'axios'
import { BookModel } from '../../src/models/book-model'

const API_ROOT = 'http://disneypubworlddev.cp.disney.com/global_titles_library/search/api'
const API_URL = `${API_ROOT}/search-book.asp`

jest.setTimeout(30000) // 30 second timeout

describe('Search API Tests', () => {
  it('should find a Book by titleId with a single quote in name.', async () => {
    const testId = '12329'
    const url = `${API_URL}?titleId=${testId}`

    // console.log('Getting ' + url)
    const response = await axios.get(url)
    expect(response.data.data).toBeDefined()

    const data = response.data.data
    expect(data.length).toEqual(1)

    // console.log(data)
    const el = data.find(x => x.TitleID === testId)
    expect(el).toBeDefined()
  })

  it('should find a Book by disrefnum with a carriage return in the data .', async () => {
    const testVal = '100913111'
    const url = `${API_URL}?refNum=${testVal}`

    // console.log('Getting ' + url)
    const response = await axios.get(url)
    expect(response.data.data).toBeDefined()

    const data = response.data.data
    expect(data.length).toEqual(1)

    // console.log(data)
    const el = data.find(x => x.DisneyRefNumber === testVal)
    expect(el).toBeDefined()
  })

  it('should find a Book by titleId with a double quote in name.', async () => {
    const testId = '31645'
    const url = `${API_URL}?titleId=${testId}`

    // console.log('Getting ' + url)
    const response = await axios.get(url)
    expect(response.data.data).toBeDefined()

    const data = response.data.data
    expect(data.length).toEqual(1)

    const el = data.find(x => x.TitleID === testId)
    expect(el).toBeDefined()
  })

  it('should find Books by title "pooh"', async () => {
    const testVal = 'pooh'
    const url = `${API_URL}?title=${testVal}`

    // console.log('Getting ' + url)
    const response = await axios.get(url)
    expect(response.data.data).toBeDefined()

    const data = response.data.data
    expect(data.length).toBeGreaterThan(9)
  })

  it('should find Books by title "winnie"', async () => {
    const testVal = 'winnie'
    const url = `${API_URL}?title=${testVal}`

    // console.log('Getting ' + url)
    const response = await axios.get(url)
    expect(response.data.data).toBeDefined()

    const data = response.data.data
    expect(data.length).toBeGreaterThan(9)
  })

  it('should find Books by dmcpName "Bambi"', async () => {
    const testVal = 'Bambi'
    const url = `${API_URL}?dmcpName=${testVal}`

    // console.log('Getting ' + url)
    const response = await axios.get(url)
    expect(response.data.data).toBeDefined()

    const el = response.data.data[0]
    expect(el.DCSFileName).toEqual(expect.stringContaining(testVal))

    const book = BookModel.fromJS(el)
    expect(book.dmcpFilename).toEqual(expect.stringContaining(testVal))
  })

  it('should find Books from source "Adaptation"', async () => {
    const testVal = 'Adaptation'
    const url = `${API_URL}?sources=${testVal}`

    // console.log('Getting ' + url)
    const response = await axios.get(url)
    expect(response.data.data).toBeDefined()

    const el = response.data.data[0]
    expect(el.ContentSource).toEqual(expect.stringMatching(testVal))

    const book = BookModel.fromJS(el)
    expect(book.source).toEqual(expect.stringContaining(testVal))
  })
})
