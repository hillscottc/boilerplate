import React from 'react'
import PropTypes from 'prop-types'
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import DmcpDetail from './title-details/dmcp'
import * as imgFeed from '../assets/feed.png'
import * as imgFeedGrey from '../assets/feed_grayscale.png'
import * as imgCheckRed from '../assets/check_red.gif'
import * as imgCheckOrange from '../assets/check_orange.gif'
import * as imgCheckYes from '../assets/img_check_yes.gif'

const ComicTableBody = ({ user, comics, openSubscribeModal, isSubscribedTitle }) => {
  const tooltip = ({tipText}) => ( // eslint-disable-line react/prop-types
    <Tooltip id='tooltip'><strong>{tipText}</strong></Tooltip>
  )

  // This odd logic comes straight from searchResultsIssuesComics.asp
  const readLink = (titleId) => {
    let page
    if (titleId >= 800000) {
      page = 'issueRead.asp'
    } else if (titleId <= 100000) {
      page = 'MagazineRead.asp'
    } else {
      page = 'titleRead.asp'
    }
    return `/global_titles_library/comics_-_magazines/${page}?ID=${titleId}`
  }

  return (
    <tbody>
      {comics.map((item) =>
        <tr key={item.titleId} >
          <td style={{textAlign: 'center'}}>
            <Button onClick={(e) => openSubscribeModal(item.titleId, e)}>
              <img src={isSubscribedTitle(item.titleId) ? imgFeed : imgFeedGrey} />
            </Button>
          </td>
          <td style={{textAlign: 'center'}}>
            {item.dpwOnly &&
            <img src={imgCheckOrange} />
            }
          </td>
          <td style={{textAlign: 'center'}}>
            {item.rightsRestricted &&
            <OverlayTrigger placement='right' overlay={tooltip({tipText: item.rightsRestricted })}>
              <img src={imgCheckRed} />
            </OverlayTrigger>
            }
          </td>
          <td>{item.disRefNum}</td>
          <td>{item.country}</td>
          <td>{item.publisherName}</td>
          <td>{item.propertyName}</td>
          <td>{item.category}</td>
          <td>{item.franchise}</td>
          <td>{item.format}</td>
          <td>{item.magazineName}</td>
          <td>{item.type}</td>
          <td><a target='_blank' href={readLink(item.titleId)}>{item.title}</a></td>
          <td>{item.dmcpFilename}</td>
          <td>{item.source}</td>
          <td style={{textAlign: 'center'}}>
            {/* DMC-P */}
            <DmcpDetail {...{user, item}} />
          </td>
          <td>
            {/* DCS */}
            {item.dcs &&
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

ComicTableBody.propTypes = {
  comics: PropTypes.arrayOf(PropTypes.shape({
    titleId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    magazineName: PropTypes.string.isRequired,
    dpwOnly: PropTypes.bool.isRequired,
    disRefNum: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    publisherId: PropTypes.string.isRequired,
    publisherName: PropTypes.string.isRequired,
    propertyId: PropTypes.string.isRequired,
    propertyName: PropTypes.string.isRequired,
    franchise: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    rightsRestricted: PropTypes.string.isRequired,
    format: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    propCatId: PropTypes.string.isRequired,
    dmcpFilename: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
    mamExists: PropTypes.string,
    mamExistsArchive: PropTypes.string,
    dcs: PropTypes.bool,
    // releaseDate: momentPropTypes.momentObj, //cuzz fails when null :(
    releaseDate: PropTypes.object,
    pdlAssetId: PropTypes.string
  })).isRequired,
  openSubscribeModal: PropTypes.func.isRequired,
  isSubscribedTitle: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

export default ComicTableBody
