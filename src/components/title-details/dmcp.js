import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'
import { ComicModel } from '../../models/comic-model'
import { BookModel } from '../../models/book-model'
import * as imgCheckYes from '../../assets/img_check_yes.gif'
import * as imgCheckRed from '../../assets/img_check_red.gif'

/*
IF THE USER IS A LICENSEE AND THE ITEM HAS RIGHTS RESTRICTIONS, SHOW THE TITLE LINK. RED CHECK.
ELSE, IF THE ITEM DOES NOT EXIST IN TEAMSTitles, BUT IS ARCHIVED, SHOW THE ARCHIVE LINK (https://dmc.disney.com/pdl/…)
ELSE SHOW A GREEN CHECK, NO LINK.
*/
const DmcpDetail = ({ user, item }) => {
  const clickDmcp = (titleID) => {
    let url
    if (item instanceof BookModel) {
      url = '/global_titles_library/retail_books/titleRead.asp?ID=' + titleID
    } else if (item instanceof ComicModel) {
      url = '/global_titles_library/comics_-_magazines/titleRead.asp?ID=' + titleID
    }
    if (url) {
      alert('Files for this title are available, but have not yet been processed into DMC-P. To order, please manually create a PO from the title info page.\n\nYou will now be taken to the title info page.')
      window.open(url)
    }
  }

  const assetUrl = (pdlAssetId) => {

    // OVERRIDE - Use a prod link all the time here, making testing easier. By request from B.
    // const env = getEnviron(String(window.location.href));
    const env = 'Production'

    if (env === 'Production') {
      return 'https://dmc.disney.com/pdl/index.html?action=share&styleGuideID=' + pdlAssetId
    } else if (env === 'QA') {
      return 'https://dmcqa.disney.com/pdl/index.html?action=share&styleGuideID=' + pdlAssetId
    } else {
      return 'https://dmcdev.disney.com/pdl/index.html?action=share&styleGuideID=' + pdlAssetId
    }
  }

  if (user.customerType === 'Licensee' && item.rightsRestricted ) {
    return (
      <a href={assetUrl(item.pdlAssetId)} title={'Click to view this title in DMC-Publishing'}><img src={imgCheckRed} /></a>
    )
  } else if (item.mamExists === '0' && Number.parseInt(item.mamExistsArchive) > 0) {
    return (
      <Button bsStyle='link' onClick={() => clickDmcp(item.titleId)}>
        Click to order manually
      </Button>
    )
  } else {
    return (
      <span>
        <img src={imgCheckYes} />
      </span>
    )
  }
}

DmcpDetail.propTypes = {
  user: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired
}

export default DmcpDetail
