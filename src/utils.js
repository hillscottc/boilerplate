import querystring from 'querystring'
import { Labels } from './components/search-controls/labels'

// Server path for api
export const API_ROOT = process.env.API_ROOT || '/global_titles_library/search/api'

export function checkHttpResp (response) {
  // Catch redirects, like for auth
  if (response.redirected) {
    const error = new Error(`Response redirected to: ${response.url}`)
    error.status = response.statusText
    error.response = response
    console.dir(response) // eslint-disable-line no-console
    throw error
  }

  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    const error = new Error(`HTTP Error ${response.statusText}`)
    error.status = response.statusText
    error.response = response
    console.log(error) // eslint-disable-line no-console
    throw error
  }
}

// As seen in inc_Security.asp
export function getEnviron (url) {
  console.log('Get environ for ' + url)

  return 'Development'

  // if (url.contains("disneypubworld.com")) {
  //   return "Production";
  // } else if (url.contains("disneypubworldqa.cp.disney.com")) {
  //   return "QA";
  // } else {
  //   return "Development";
  // }
}

// A comparator function for sorting array by object props. From https://www.sitepoint.com/sort-an-array-of-objects-in-javascript/
export function compareValues (key, order = 'asc') {
  return function (a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0
    }

    const varA = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key]
    const varB = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key]

    let comparison = 0
    if (varA > varB) {
      comparison = 1
    } else if (varA < varB) {
      comparison = -1
    }
    return (
      (order === 'desc') ? (comparison * -1) : comparison
    )
  }
}

export function sortByLabel (items, sortVal, order) {
  let sortProp

  switch (sortVal) {
    case Labels.art:
      sortProp = 'artworkPages'
      break
    case Labels.catProps:
      sortProp = 'propertyCategory'
      break
    case Labels.country:
      sortProp = 'country'
      break
    case Labels.dcs:
      sortProp = 'dcs'
      break
    case Labels.dmcp:
      sortProp = 'mamExists'
      break
    case Labels.disRefNum:
      sortProp = 'disRefNum'
      break
    case Labels.dmcpFilename:
      sortProp = 'dmcpFilename'
      break
    case Labels.dpwOnly:
      sortProp = 'dpwOnly'
      break
    case Labels.ebook:
      sortProp = 'ebookFormat'
      break
    case Labels.franchise:
      sortProp = 'franchise'
      break
    case Labels.isbn:
      sortProp = 'isbn'
      break
    case Labels.magazineName:
      sortProp = 'magazineName'
      break
    case Labels.magazineType:
      sortProp = 'type'
      break
    case Labels.property:
      sortProp = 'propertyName'
      break
    case Labels.publisher:
      sortProp = 'publisherName'
      break
    case Labels.onShelf:
      sortProp = 'releaseDate'
      break
    case Labels.rr:
      sortProp = 'rightsRestricted'
      break
    case Labels.series:
      sortProp = 'seriesName'
      break
    case Labels.seriesCode:
      sortProp = 'seriesCode'
      break
    case Labels.source:
      sortProp = 'source'
      break
    case Labels.title:
      sortProp = 'title'
      break
    case Labels.titleCode:
      sortProp = 'titleCode'
      break
    default:
      console.warn(`Unhandled search prop: ${sortVal}`)
      sortProp = null
  }

  console.log(`Sorting ${items.length} items by ${sortVal}, ${order}, using prop ${sortProp}`)

  if (sortProp) {
    return items.sort(compareValues(sortProp, order))
  }
}

export function getMultiSelected (arr) {
  let selected = arr.filter(item => item.selected)
  return selected.map((item) => item.value)
}

export function resetMultiSelect (arr) {
  return arr.map((item) => {
    item.selected = false
    return item
  })
}

// Build querystring from state data and contactId
export function getQueryString (
  { countries, title, refNum, optDpwSelected, optRRSelected,
    publishers, properties, catProps, franchises, formats,
    titleCode, isbn, seriesCode, series, ebookFormats,
    optSubsSelected, dmcpName, sources, dmcp, hrpdf, dcs,
    contactId, shelfStartDate, shelfEndDate, limit, offset,
    optMagName, type
  }) {
  const payload = {}

  if (title) payload.title = title
  if (refNum) payload.refNum = refNum
  if (refNum) payload.refNum = refNum
  if (optDpwSelected !== '--') payload.dpwOnly = optDpwSelected
  if (optRRSelected !== '--') payload.rr = optRRSelected
  if (titleCode) payload.titleCode = titleCode
  if (isbn) payload.isbn = isbn
  if (seriesCode) payload.seriesCode = seriesCode
  if (optSubsSelected !== '--') payload.subscribedBy = optSubsSelected
  if (dmcpName) payload.dmcpName = dmcpName
  if (dmcp) payload.dmcp = dmcp
  if (hrpdf) payload.hrpdf = hrpdf
  if (dcs) payload.dcs = dcs
  if (optMagName) payload.magazineName = optMagName
  if (type !== '--') payload.type = type

  // We are handling moment.js objects here.
  if (shelfStartDate) payload.shelfStartDate = shelfStartDate.format('YYYYMMDD')
  if (shelfEndDate) payload.shelfEndDate = shelfEndDate.format('YYYYMMDD')

  let selected

  if (countries) {
    selected = getMultiSelected(countries)
    if (selected.length > 0) {
      payload.countries = selected
    }
  }

  if (publishers) {
    selected = getMultiSelected(publishers)
    if (selected.length > 0) {
      payload.publishers = selected
    }
  }

  if (properties) {
    selected = getMultiSelected(properties)
    if (selected.length > 0) {
      payload.properties = selected
    }
  }

  if (catProps) {
    selected = getMultiSelected(catProps)
    if (selected.length > 0) {
      payload.catProps = selected
    }
  }

  if (franchises) {
    selected = getMultiSelected(franchises)
    if (selected.length > 0) {
      payload.franchises = selected
    }
  }

  if (formats) {
    selected = getMultiSelected(formats)
    if (selected.length > 0) {
      payload.formats = selected
    }
  }

  if (series) {
    selected = getMultiSelected(series)
    if (selected.length > 0) {
      payload.series = selected
    }
  }

  if (ebookFormats) {
    selected = getMultiSelected(ebookFormats)
    if (selected.length > 0) {
      payload.ebookFormats = selected
    }
  }

  if (sources) {
    selected = getMultiSelected(sources)
    if (selected.length > 0) {
      payload.sources = selected
    }
  }

  // Add the contactId when needed
  if (optSubsSelected === '1' || optSubsSelected === '0') {
    payload.contactId = contactId
  }

  if (offset) payload.offset = offset
  if (limit) payload.limit = limit

  // In our db API, offset is a PAGE number,
  // but our paging control sends offset as a TOTAL-RECORD number.
  // Change the offset to a PAGE value.
  if (offset && limit && limit > 0) {
    payload.offset = (offset / limit) + 1
  }

  return querystring.stringify(payload)
}
