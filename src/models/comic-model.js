import { API_ROOT } from '../utils'
import axios from 'axios'
import moment from 'moment'

export class ComicModel {
  titleId;
  title;
  magazineName;
  dpwOnly;
  disRefNum;
  country;
  publisherId;
  publisherName;
  propertyId;
  propertyName;
  franchise;
  type;
  rightsRestricted;
  format;
  category;
  propCatId;
  dmcpFilename;
  source;
  mamExists;
  mamExistsArchive;
  dcs;
  releaseDate;
  pdlAssetId;

  constructor (
    titleId,
    title,
    magazineName,
    dpwOnly,
    disRefNum,
    country,
    publisherId,
    publisherName,
    propertyId,
    propertyName,
    franchise,
    type,
    rightsRestricted,
    format,
    category,
    propCatId,
    dmcpFilename,
    source,
    mamExists,
    mamExistsArchive,
    dcs,
    releaseDate,
    pdlAssetId
  ) {
    this.titleId = titleId
    this.title = title
    this.magazineName = magazineName
    this.dpwOnly = (dpwOnly === 'True')
    this.disRefNum = disRefNum
    this.country = country
    this.publisherId = publisherId
    this.publisherName = publisherName
    this.propertyId = propertyId
    this.propertyName = propertyName
    this.franchise = franchise
    this.type = type
    this.rightsRestricted = rightsRestricted
    this.format = format
    this.category = category
    this.propCatId = propCatId
    this.dmcpFilename = dmcpFilename
    this.source = source
    this.mamExists = mamExists
    this.mamExistsArchive = mamExistsArchive
    this.dcs = (dcs === 'True')
    this.releaseDate = moment(releaseDate, 'MM/DD/YYYY')
    this.pdlAssetId = pdlAssetId

    // NEEDS A propertyCategory: PropTypes.string.isRequired, !!!!!!!!
  }

  static fromJS (object) {
    return new ComicModel(
      object['TitleID'],
      object['Title'],
      object['MagazineName'],
      object['DPWOnly'],
      object['DisneyRefNumber'],
      object['Country'],
      object['PublisherID'],
      object['PublisherName'],
      object['PropertyID'],
      object['PropertyName'],
      object['Franchise'],
      object['Type'],
      object['RightsRestricted'],
      object['Format'],
      object['Category'],
      object['PropCatID'],
      object['DCSFileName'],
      object['ContentSource'],
      object['MAMExists'],
      object['MAMExistsArchive'],
      object['DCS'],
      object['ReleaseDate'],
      object['PDLAssetID']
    )
  }
}

export const searchComic = async (qs) => {
  const url = `${API_ROOT}/search-comic.asp?${qs}`
  console.log(`Fetching url: ${url}`)

  const response = await axios.get(url)

  if (qs.includes('debug=1')) {
    console.log(`Debug response...`)
    console.log(response.data)
    return
  }

  if (!response.data.data) {
    // It's probably a JSON parse error. Check that. writing any fail error.
    try {
      JSON.parse(response.data)
    } catch (error) {
      console.error('JSON Parse error: ' + error)
    }
    throw new Error('Response.data from server is invalid json.')
  }

  // return response.data.data.map(item => ComicModel.fromJS(item));
  return {
    page: response.data.page,
    comics: response.data.data.map(item => ComicModel.fromJS(item))
  }
}
