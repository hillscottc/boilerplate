import React from 'react'
import PropTypes from 'prop-types'
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import DmcpDetail from './title-details/dmcp'
import * as imgFeed from '../assets/feed.png'
import * as imgFeedGrey from '../assets/feed_grayscale.png'
import * as imgCheckRed from '../assets/check_red.gif'
import * as imgCheckOrange from '../assets/check_orange.gif'
import * as imgCheckYes from '../assets/img_check_yes.gif'

const BookTableBody = ({ user, books, openSubscribeModal, isSubscribed }) => {
  const tooltip = ({ tipText }) => ( // eslint-disable-line react/prop-types
    <Tooltip id='tooltip'><strong>{ tipText }</strong></Tooltip>
  )

  return (
    <tbody>
      {books.map((item) =>
        <tr key={item.titleId} >
          <td style={{textAlign: 'center'}}>
            <Button onClick={(e) => openSubscribeModal(item.titleId, e)}>
              <img src={isSubscribed(item.titleId) ? imgFeed : imgFeedGrey} />
            </Button>
          </td>
          <td style={{textAlign: 'center'}}>
            {item.dpwOnly &&
              <img src={imgCheckOrange} />
            }
          </td>
          <td style={{textAlign: 'center'}}>
            {item.rightsRestricted &&
              <OverlayTrigger placement='right' overlay={tooltip({ tipText: item.rightsRestricted })}>
                <img src={imgCheckRed} />
              </OverlayTrigger>
            }
          </td>
          <td>{item.disRefNum}</td>
          <td>{item.country}</td>
          <td>{item.publisherName}</td>
          <td>{item.propertyName}</td>
          <td>{item.propertyCategory}</td>
          <td>{item.franchise}</td>
          <td>{item.formatName}</td>
          <td>{item.titleCode}</td>
          <td><a target='_blank' href={`/global_titles_library/retail_books/titleRead.asp?Back=true&ID=${item.titleId}`}>{item.title}</a></td>
          <td>{item.isbn}</td>
          <td>{item.seriesCode}</td>
          <td>{item.seriesName}</td>
          <td>{item.artworkPages}</td>
          <td>{item.ebookFormat}</td>
          <td>{item.dmcpFilename}</td>
          <td>{item.source}</td>
          <td style={{textAlign: 'center'}}>
            {/* DMC-P */}
            <DmcpDetail {...{user, item}} />
          </td>
          <td style={{textAlign: 'center'}}>
            {item.hiResPdf === '1' &&
              <img src={imgCheckYes} />
            }
          </td>
          <td>
            {/* DCS */}
            {item.dcsHold && item.dcs &&
              <img src={imgCheckRed} />
            }
            {!item.dcsHold && item.dcs &&
              <img src={imgCheckYes} />
            }
          </td>
          <td>
            {item.releaseDate.isValid() &&
            <span>{item.releaseDate.format('MM/DD/YYYY')}</span>
            }
          </td>
        </tr>
      )}
    </tbody>
  )
}

BookTableBody.propTypes = {
  books: PropTypes.arrayOf(PropTypes.shape({
    artworkPages: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    dcs: PropTypes.bool,
    dcsHold: PropTypes.bool,
    disRefNum: PropTypes.string.isRequired,
    dmcpFilename: PropTypes.string.isRequired,
    dpwOnly: PropTypes.bool.isRequired,
    ebookFormat: PropTypes.string.isRequired,
    ebookTypeId: PropTypes.string.isRequired,
    formatId: PropTypes.string.isRequired,
    formatName: PropTypes.string.isRequired,
    franchise: PropTypes.string.isRequired,
    hiResPdf: PropTypes.string,
    isbn: PropTypes.string.isRequired,
    mamExists: PropTypes.string.isRequired,
    mamExistsArchive: PropTypes.string.isRequired,
    propCatId: PropTypes.string.isRequired,
    propertyCategory: PropTypes.string.isRequired,
    propertyId: PropTypes.string.isRequired,
    propertyName: PropTypes.string.isRequired,
    propertyShortName: PropTypes.string.isRequired,
    publisherId: PropTypes.string.isRequired,
    publisherName: PropTypes.string.isRequired,
    releaseDate: PropTypes.object,
    // releaseDate: momentPropTypes.momentObj, //cuz fails when null :(
    rightsRestricted: PropTypes.string.isRequired,
    seriesCode: PropTypes.string.isRequired,
    seriesId: PropTypes.string.isRequired,
    seriesName: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    titleCode: PropTypes.string.isRequired,
    titleId: PropTypes.string.isRequired,
    pdlAssetId: PropTypes.string
  })).isRequired,
  openSubscribeModal: PropTypes.func.isRequired,
  isSubscribed: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

export default BookTableBody
