import { API_ROOT } from '../utils'
import axios from 'axios'
import moment from 'moment'

export class BookModel {
  titleId;
  title;
  dpwOnly;
  rightsRestricted;
  disRefNum;
  country;
  publisherId;
  publisherName;
  propertyId;
  propertyName;
  propertyShortName;
  propertyCategory;
  propCatId;
  franchise;
  formatId;
  formatName;
  titleCode;
  isbn;
  seriesCode;
  seriesId;
  seriesName;
  artworkPages;
  ebookTypeId;
  ebookFormat;
  dmcpFilename;
  source;
  mamExists;
  mamExistsArchive;
  hiResPdf;
  dcs;
  dcsHold;
  releaseDate;
  pdlAssetId;

  constructor (
    titleId,
    title,
    dpwOnly,
    rightsRestricted,
    disRefNum,
    country,
    publisherId,
    publisherName,
    propertyId,
    propertyName,
    propertyShortName,
    propertyCategory,
    propCatId,
    franchise,
    formatId,
    formatName,
    titleCode,
    isbn,
    seriesCode,
    seriesId,
    seriesName,
    artworkPages,
    ebookTypeId,
    ebookFormat,
    dmcpFilename,
    source,
    mamExists,
    mamExistsArchive,
    hiResPdf,
    dcs,
    dcsHold,
    releaseDate,
    pdlAssetId
  ) {
    this.titleId = titleId
    this.title = title
    this.dpwOnly = (dpwOnly === 'True')
    this.rightsRestricted = rightsRestricted
    this.disRefNum = disRefNum
    this.country = country
    this.publisherId = publisherId
    this.publisherName = publisherName
    this.propertyId = propertyId
    this.propertyName = propertyName
    this.propertyShortName = propertyShortName
    this.propertyCategory = propertyCategory
    this.propCatId = propCatId
    this.franchise = franchise
    this.formatId = formatId
    this.formatName = formatName
    this.titleCode = titleCode
    this.isbn = isbn
    this.seriesCode = seriesCode
    this.seriesId = seriesId
    this.seriesName = seriesName
    this.artworkPages = artworkPages
    this.ebookTypeId = ebookTypeId
    this.ebookFormat = ebookFormat
    this.dmcpFilename = dmcpFilename
    this.source = source
    this.mamExists = mamExists
    this.mamExistsArchive = mamExistsArchive
    this.hiResPdf = hiResPdf
    this.dcs = (dcs === 'True')
    this.dcsHold = (dcsHold === 'True')
    this.releaseDate = moment(releaseDate, 'MM/DD/YYYY')
    this.pdlAssetId = pdlAssetId
  }

  static fromJS (object) {
    return new BookModel(
      object['TitleID'],
      object['Title'],
      object['DPWOnly'],
      object['RightsRestricted'],
      object['DisneyRefNumber'],
      object['Country'],
      object['PublisherID'],
      object['PublisherName'],
      object['PropertyID'],
      object['PropertyName'],
      object['ShortName'],
      object['Category'],
      object['PropCatID'],
      object['Franchise'],
      object['FormatID'],
      object['FormatName'],
      object['TitleCode'],
      object['ISBN'],
      object['InsightSeriesCode'],
      object['SeriesID'],
      object['SeriesName'],
      object['ArtworkPages'],
      object['EbookTypeID'],
      object['EBookFormatType'],
      object['DCSFileName'],
      object['ContentSource'],
      object['MAMExists'],
      object['MAMExistsArchive'],
      object['HRPDF'],
      object['DCS'],
      object['DCSHold'],
      object['ReleaseDate'],
      object['ReleaseDate'],
      object['PDLAssetID']
    )
  }
}

export const searchBook = async (qs) => {
  const url = `${API_ROOT}/search-book.asp?${qs}`
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

  return {
    page: response.data.page,
    books: response.data.data.map(item => BookModel.fromJS(item))
  }
}
