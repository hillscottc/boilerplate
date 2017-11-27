
export default class UserModel {
  contactId;
  login;
  customerType;
  roles;
  region;
  dpwUser;

  constructor (contactId, login, customerType = 'Internal', roles = [], region = '', dpwUser = true) {
    this.contactId = contactId
    this.login = login
    this.customerType = customerType
    this.roles = roles
    this.region = region
    this.dpwUser = dpwUser

    for (const role of roles) {
      if (!ROLES.includes(role)) {
        throw new Error('Invalid role: ' + role)
      }
    }

    if (!CustomerTypes.includes(customerType)) {
      throw new Error('Invalid customerType: ' + customerType)
    }

    if (!Regions.includes(region)) {
      throw new Error('Invalid region: ' + region)
    }
  }

  static fromJS (object) {
    return new UserModel(
      object['contactId'],
      object['login'],
      object['customerType'],
      object['roles'],
      object['region'],
      object['dpwUser']
    )
  }

  hasRole (role) {
    return this.roles.includes(role)
  }
}

const CustomerTypes = ['Licensee', 'Internal']

const Regions = ['United States/Canada', 'Latin America', 'Japan',
  'Europe/Middle East & Africa', 'Asia Pacific', '']

// Got from the db with 'select distinct role from vwcontactrole'
const ROLES = [
  'Title Analyst',
  'Support',
  'Special Royalty',
  'Site Developer',
  'Samples',
  'Publishing Digital Library',
  'PO Approver - GCM',
  'PO Approver - Family Fun',
  'PO Approver',
  'Partworks',
  'OPA Project Manager',
  'Maintain Users',
  'Maintain Trivia',
  'Maintain Retail Books',
  'Maintain Purchase Orders',
  'Maintain Pub Planning',
  'Maintain Promotions',
  'Maintain OPA Marketing Material',
  'Maintain OPA',
  'Maintain Learning - PO',
  'Maintain Language',
  'Maintain Interactive',
  'Maintain GTL - DCS Restricted',
  'Maintain GTL - DCS Label',
  'Maintain GTL - DCS',
  'Maintain Fine Art Prints',
  'Maintain Family Fun',
  'Maintain Continuity - PO',
  'Maintain Contacts/Locations',
  'Maintain Comics/Magazines',
  'Language Head',
  'GOPS - GCM',
  'GOPS',
  'Global Licensing',
  'Editor',
  'DMC-Pub Content Access - Marvel',
  'DMC-Pub Content Access - Lucas',
  'DMC-Pub Content Access - Hyperion',
  'DMC-Pub Content Access - Digital',
  'DisneyBooks',
  'Disney Express Account',
  'Credit',
  'Administration - Site',
  'Administration - Purchase Orders',
  'Administration - Magazines',
  'Administration - Family Fun',
  'Administration - Events',
  'Accounting - GCM',
  'Accounting'
]
