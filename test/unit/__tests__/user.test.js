import UserModel from 'src/models/user-model'

describe('User Model', () => {
  it('should create a User from js data and check its roles ', async () => {
    const testVal = {
      contactId: '1234',
      login: 'smith123',
      customerType: 'Internal',
      roles: ['Site Developer', 'Title Analyst'],
      region: 'United States/Canada',
      dpwUser: true
    }

    const user = UserModel.fromJS(testVal)
    expect(user.contactId).toEqual(testVal.contactId)
    expect(user.login).toEqual(testVal.login)
    expect(user.hasRole('Site Developer')).toBe(true)
    expect(user.hasRole('role XYX')).toBe(false)
  })
})
