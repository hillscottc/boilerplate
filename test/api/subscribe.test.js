/* eslint no-undef: 0 */
import axios from 'axios'
import querystring from 'querystring'

const API_ROOT = 'http://disneypubworlddev.cp.disney.com/global_titles_library/search/api'
const testTitleId = '25090'
const testContactId = '12900'

describe('Subscription API Tests', () => {
  it('should remove a Title subscription', async () => {
    const qs = querystring.stringify({
      titleId: testTitleId,
      contactId: testContactId,
      subType: 'Title'
    })
    const response = await axios.get(`${API_ROOT}/subscriptions-rem.asp?${qs}`)
    expect(response.data).toBeDefined()
    expect(response.data).toEqual({results: 'OK'})
  })

  it('should post a Title subscription', async () => {
    const qs = querystring.stringify({
      titleId: testTitleId,
      contactId: testContactId,
      subType: 'Title'
    })
    const response = await axios.get(`${API_ROOT}/subscriptions-post.asp?${qs}`)
    expect(response.data).toBeDefined()
    expect(response.data).toEqual({results: 'OK'})
  })
})
