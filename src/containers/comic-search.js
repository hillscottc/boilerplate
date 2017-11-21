/* eslint-disable */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Table, ButtonToolbar, Panel } from 'react-bootstrap'
import ReactPaginate from 'react-paginate'
import Loader from 'react-loader'
import { getMultiSelected, resetMultiSelect, getQueryString, sortByLabel } from '../utils'
import SubscribeModal from '../components/subscribe-modal'
import ComicTableBody from '../components/comic-table-body'
import SearchControlBoolean from '../components/search-controls/boolean'
import SearchControlTextBox from '../components/search-controls/text-box'
import SearchControlMulti from '../components/search-controls/multi'
import SearchControlSelectBasic from '../components/search-controls/select-basic'
import SearchControlDateRange from '../components/search-controls/date-range'
import { Labels } from '../components/search-controls/labels'
import { getSubscriptions, remSubscription, addSubscription } from '../models/subscription-model'
import { searchComic } from '../models/comic-model'
import { getCountryOpts } from '../models/country-model'
import { getPublisherOpts } from '../models/pubisher-model'
import { getPropertyOpts } from '../models/property-model'
import { getPropCatOpts } from '../models/propCat-model'
import { getFranchiseOpts } from '../models/franchise-model'
import { getFormatOpts } from '../models/format-model'

const PER_PAGE = 50

// Replaces old DPW code from /global_titles_library/comics_-_magazines/searchResultsIssuesComics.asp
class ComicSearch extends Component {
  constructor (props) {
    super(props)
    this.state = {
      catProps: [],
      comics: [],
      countries: [],
      currentPage: 0,
      dcs: '',
      dmcp: '',
      dmcpName: '',
      focusedInput: null,
      formats: [],
      franchises: [],
      loaded: true,
      modalTitleId: '',
      msgBody: '',
      offset: 0,
      optComicType: '--',
      optDpwSelected: '--',
      optMagName: '',
      optRRSelected: '--',
      optSubsSelected: '--',
      pageCount: 1,
      properties: [],
      publishers: [],
      refNum: '',
      shelfEndDate: null,
      shelfStartDate: null,
      showSubscribeModal: false,
      sources: [{value: 'Adaptation', label: 'Adaptation'}, {value: 'Original', label: 'Original'}, {value: 'Pickup', label: 'Pickup'}],
      subscriptions: [],
      title: '',
      titleCode: ''
    }
  }

  componentDidMount () {
    this.setState({msgBody: 'Loading...'})

    this.getSearchControlData().then(() => {
      console.log('SearchControls rendered.')
      this.setState({msgBody: ''})
    })
      .catch((e) => {
        this.setState({msgBody: 'Problem fetching search control data, ' + e})
      })
  }

  // Load the data for the search column headings
  async getSearchControlData () {
    await getCountryOpts().then((options) => {
      this.setState({countries: options})
      console.log(`Got ${options.length} countries.`)
    })

    await getPublisherOpts().then((options) => {
      console.log(`Got ${options.length} publishers.`)
      this.setState({publishers: options})
    })

    await getPropertyOpts().then((options) => {
      console.log(`Got ${options.length} properties.`)
      this.setState({properties: options})
    })

    await getPropCatOpts().then((options) => {
      console.log(`Got ${options.length} property-categories.`)
      this.setState({catProps: options})
    })

    await getFranchiseOpts().then((options) => {
      console.log(`Got ${options.length} franchises.`)
      this.setState({franchises: options})
    })

    await getFormatOpts().then((options) => {
      console.log(`Got ${options.length} category/formats.`)
      this.setState({formats: options})
    })

    await getSubscriptions(this.props.user.contactId).then((items) => {
      console.log(`Got ${items.length} subscriptions for contactId ${this.props.user.contactId}.`)
      this.setState({subscriptions: items})
    })
  }

  // Are any of the search options selected?
  canReset = () => {
    const { optSubsSelected, optDpwSelected, optRRSelected, refNum, countries, publishers,
      properties, catProps, franchises, title, shelfStartDate, shelfEndDate,
      dmcpName, sources, optMagName, optComicType, dmcp, dcs } = this.state

    return (
      optSubsSelected !== '--' ||
      optDpwSelected !== '--' ||
      optRRSelected !== '--' ||
      refNum ||
      getMultiSelected(countries).length > 0 ||
      getMultiSelected(publishers).length > 0 ||
      getMultiSelected(properties).length > 0 ||
      getMultiSelected(catProps).length > 0 ||
      getMultiSelected(franchises).length > 0 ||
      optMagName ||
      optComicType !== '--' ||
      title ||
      dmcpName ||
      getMultiSelected(sources).length > 0 ||
      (dmcp !== '' && dmcp !== '--') ||
      (dcs !== '' && dcs !== '--') ||
      shelfStartDate !== null ||
      shelfEndDate !== null
    )
  }

  // Reset the search options
  resetOptions = () => {
    this.setState({optSubsSelected: '--'})
    this.setState({optDpwSelected: '--'})
    this.setState({optRRSelected: '--'})
    this.setState({refNum: ''})
    this.setState({countries: resetMultiSelect(this.state.countries)})
    this.setState({publishers: resetMultiSelect(this.state.publishers)})
    this.setState({properties: resetMultiSelect(this.state.properties)})
    this.setState({catProps: resetMultiSelect(this.state.catProps)})
    this.setState({franchises: resetMultiSelect(this.state.franchises)})
    this.setState({optMagName: ''})
    this.setState({optComicType: '--'})
    this.setState({title: ''})
    this.setState({dmcpName: ''})
    this.setState({sources: resetMultiSelect(this.state.sources)})
    this.setState({dmcp: ''})
    this.setState({dcs: ''})
    this.setState({shelfStartDate: null})
    this.setState({shelfEndDate: null})
  }

  onFocusChange = (focusedInput) => {
    this.setState({ focusedInput })
  }

  onDatesChange = ({ startDate, endDate }) => {
    this.setState({
      shelfStartDate: startDate,
      shelfEndDate: endDate
    })
  }

  dmcpFilenameSet = (e) => {
    this.setState({ dmcpName: e.target.value })
  }

  dcsSet = (e) => {
    this.setState({ dcs: e.target.value })
  }

  dmcpSet = (e) => {
    this.setState({ dmcp: e.target.value })
  }

  sourceChoose = (e) => {
    const { sources } = this.state
    let clickedOpt = e[0]
    // Find matching item in state, update it to the selected option
    let foundIndex = sources.findIndex((x) => x.value === clickedOpt.value)
    sources[foundIndex].selected = clickedOpt.selected
    this.setState({sources})
  }

  titleChoose = (e) => {
    this.setState({ title: e.target.value })
  }

  selectDpw = (e) => {
    this.setState({optDpwSelected: e.target.value})
  }

  selectRR = (e) => {
    this.setState({optRRSelected: e.target.value})
  }

  selectRefNum = (e) => {
    this.setState({ refNum: e.target.value })
  }

  selectCountry = (e) => {
    const {countries} = this.state
    let clickedOpt = e[0]
    // Find matching item in state, update it to the selected option
    let foundIndex = countries.findIndex((x) => x.value === clickedOpt.value)
    countries[foundIndex].selected = clickedOpt.selected
    this.setState({countries})
  }

  selectPublisher = (e) => {
    const {publishers} = this.state
    let clickedOpt = e[0]
    // Find matching item in state, update it to the selected option
    let foundIndex = publishers.findIndex((x) => x.value === clickedOpt.value)
    publishers[foundIndex].selected = clickedOpt.selected
    this.setState({publishers})
  }

  selectProperty = (e) => {
    const {properties} = this.state
    let clickedOpt = e[0]
    // Find matching item in state, update it to the selected option
    let foundIndex = properties.findIndex((x) => x.value === clickedOpt.value)
    properties[foundIndex].selected = clickedOpt.selected
    this.setState({properties})
  }

  selectCatProp = (e) => {
    const {catProps} = this.state
    let clickedOpt = e[0]
    // Find matching item in state, update it to the selected option
    let foundIndex = catProps.findIndex((x) => x.value === clickedOpt.value)
    catProps[foundIndex].selected = clickedOpt.selected
    this.setState({catProps})
  }

  selectFranchise = (e) => {
    const {franchises} = this.state
    let clickedOpt = e[0]
    // Find matching item in state, update it to the selected option
    let foundIndex = franchises.findIndex((x) => x.value === clickedOpt.value)
    franchises[foundIndex].selected = clickedOpt.selected
    this.setState({franchises})
  };

  selectFormat = (e) => {
    const {formats} = this.state
    let clickedOpt = e[0]
    let foundIndex = formats.findIndex((x) => x.value === clickedOpt.value)
    formats[foundIndex].selected = clickedOpt.selected
    this.setState({formats})
  }

  selectSubscribed = (e) => {
    this.setState({optSubsSelected: e.target.value})
  }

  openSubscribeModal = (titleId, e) => {
    this.setState({ modalTitleId: titleId })
    this.setState({ showSubscribeModal: true })
  }

  closeSubscribeModal = (e) => {
    this.setState({ showSubscribeModal: false })
  }

  clickSubscribe = (subscriptionType, titleId, checked) => {
    console.log(`Clicked ${subscriptionType}, ${checked}`)

    const contactId = this.props.user.contactId

    if (checked) {
      console.log(`Add subs : ${titleId}, ${subscriptionType} ?`)
      addSubscription(contactId, titleId, subscriptionType).then((data) => {
        console.log('Add subs response: ' + JSON.stringify(data))
        console.log('Getting new subs from db, then updating state.')
        getSubscriptions(contactId).then((items) => {
          this.setState({subscriptions: items})
        })
      })
    } else {
      console.log(`Rem subs : ${titleId}, ${subscriptionType} ?`)
      remSubscription(contactId, titleId, subscriptionType).then((data) => {
        console.log('Remove subs response: ' + JSON.stringify(data))
        console.log('Getting new subs from db, then updating state.')
        getSubscriptions(contactId).then((items) => {
          this.setState({subscriptions: items})
        })
      })
    }
  }

  getFormData = () => {
    const { optMagName, optComicType } = this.state
    const formData = this.state
    formData.contactId = this.props.user.contactId
    if (optMagName) formData.magName = optMagName
    if (optComicType) formData.type = optComicType
    formData.limit = PER_PAGE
    return formData
  };

  searchComicClick = () => {
    this.logPost('some data')

    this.setState({ offset: 0, currentPage: 0 }, () => {
      const qs = getQueryString(this.getFormData())

      this.setState({msgBody: 'Searching records...'})

      searchComic(qs).then(({page, comics}) => {
        this.setState({comics, pageCount: page.pageCount})
        this.setState({msgBody: `${comics.length} records retrieved.`})
      })
        .catch((error) => {
          console.error('Sorry, server error: ' + error)
          this.setState({comics: [], pageCount: 0})
        })
    })
  }

  sortClick = (sortVal, order) => {
    const sorted = sortByLabel(this.state.comics, sortVal, order)
    if (sorted) {
      this.setState({ comics: sorted })
    }
  }

  selectMagName = (e) => {
    this.setState({ optMagName: e.target.value })
  }

  selectComicType = (e) => {
    this.setState({ optComicType: e.target.value })
  }

  // Is user subscribed to this titleId?
  isSubscribedTitle = (titleId) => {
    let subs = this.state.subscriptions.filter(x => x.titleId === titleId)
    return subs.length > 0
  }

  handlePageClick = (data) => {
    let selected = data.selected
    let offset = Math.ceil(selected * PER_PAGE)

    this.setState({ offset }, () => {
      const qs = getQueryString(this.getFormData())
      this.setState({msgBody: 'Fetching page...'})

      searchComic(qs).then(({page, comics}) => {
        this.setState({comics, pageCount: page.pageCount, currentPage: selected})
        this.setState({msgBody: ''})
      })
    })
  }

  logPost = (data) => {
    console.log('Post to log: ' + JSON.stringify({
      user: this.props.user.contactId,
      data: data,
      url: window.location.href
    }))
  }

  render () {
    // Bound functions
    const { searchComicClick, selectDpw, selectRR, titleChoose,
      selectCountry, selectPublisher, selectProperty, selectCatProp,
      selectFranchise, selectRefNum, openSubscribeModal, closeSubscribeModal,
      selectSubscribed, clickSubscribe, selectMagName, selectComicType,
      dmcpFilenameSet, dmcpSet, sourceChoose, isSubscribedTitle, canReset, resetOptions,
      dcsSet, onDatesChange, onFocusChange, handlePageClick, sortClick
    } = this

    // State values
    const { loaded, comics, title, refNum,
      countries, publishers, properties, catProps, franchises, optDpwSelected, optRRSelected,
      showSubscribeModal, modalTitleId, subscriptions,
      optMagName, optSubsSelected, optComicType, dmcpName, sources,
      dmcp, dcs, shelfStartDate, shelfEndDate, msgBody, focusedInput,
      pageCount, currentPage
    } = this.state

    const user = this.props.user

    return (
      <div className='ComicSearch'>

        <ButtonToolbar className={'affix'}>
          <div style={{display: 'inline', float: 'left'}}>
            <Button onClick={searchComicClick} bsStyle='success' bsSize='small' style={{width: '300px'}}>Query Records</Button>
            <Button onClick={resetOptions} bsStyle='warning' bsSize='small' style={{width: '300px'}}
              disabled={!canReset()}>Reset Search Options</Button>
          </div>
          <Panel bsStyle='info' style={{float: 'right', marginLeft: '10px'}}>{ msgBody }</Panel>
        </ButtonToolbar>

        <div style={{clear: 'both'}} />

        <br /><br /><br />

        <Loader loaded={loaded}>
          <div className='ComicTable'>

            <SubscribeModal
              closeSubscribeModal={closeSubscribeModal}
              showSubscribeModal={showSubscribeModal}
              modalTitleId={modalTitleId}
              subscriptions={subscriptions}
              clickSubscribe={clickSubscribe}
            />

            <Table striped bordered condensed hover responsive style={{'borderBottom': 'none', 'borderLeft': 'none'}}>
              <thead>
                <tr>
                  <th>
                    <SearchControlBoolean
                      select={selectSubscribed}
                      selectVal={optSubsSelected}
                      label={Labels.subscribe}
                      style={{width: '65px'}}
                    />
                  </th>
                  <th>
                    <SearchControlBoolean
                      select={selectDpw}
                      selectVal={optDpwSelected}
                      label={Labels.dpwOnly}
                      style={{width: '75px'}}
                      sortClick={sortClick}
                    />
                  </th>
                  <th>
                    <SearchControlBoolean
                      select={selectRR}
                      selectVal={optRRSelected}
                      label={Labels.rr}
                      style={{width: '60px'}}
                      sortClick={sortClick}
                    />
                  </th>
                  <th>
                    <SearchControlTextBox
                      txtSet={selectRefNum}
                      txt={refNum}
                      label={Labels.disRefNum}
                      style={{width: '105px'}}
                      sortClick={sortClick}
                    />
                  </th>
                  <th>
                    <SearchControlMulti
                      selectItem={selectCountry}
                      items={countries}
                      label={Labels.country}
                      enableFiltering
                      sortClick={sortClick}
                    />
                  </th>
                  <th>
                    <SearchControlMulti
                      selectItem={selectPublisher}
                      items={publishers}
                      label={Labels.publisher}
                      enableFiltering
                      sortClick={sortClick}
                    />
                  </th>
                  <th>
                    <SearchControlMulti
                      selectItem={selectProperty}
                      items={properties}
                      label={Labels.property}
                      enableFiltering
                      sortClick={sortClick}
                    />
                  </th>
                  <th>
                    <SearchControlMulti
                      selectItem={selectCatProp}
                      items={catProps}
                      label={Labels.catProps}
                      enableFiltering
                      sortClick={sortClick}
                    />
                  </th>
                  <th>
                    <SearchControlMulti
                      selectItem={selectFranchise}
                      items={franchises}
                      label={Labels.franchise}
                      enableFiltering
                      sortClick={sortClick}
                    />
                  </th>
                  <th>
                    Category
                  </th>
                  <th>
                    <SearchControlTextBox
                      txtSet={selectMagName}
                      txt={optMagName}
                      label={Labels.magazineName}
                      style={{width: '200px'}}
                      sortClick={sortClick}
                    />
                  </th>
                  <th>
                    <SearchControlSelectBasic
                      selectItem={selectComicType}
                      currentItem={optComicType}
                      label={Labels.magazineType}
                      items={[
                        {value: '--', label: '--'},
                        {value: 'Issue', label: 'Issue'},
                        {value: 'Comic', label: 'Comic'},
                        {value: 'Magazine', label: 'Magazine'}
                      ]}
                      sortClick={sortClick}
                    />
                  </th>
                  <th>
                    <SearchControlTextBox
                      txtSet={titleChoose}
                      txt={title}
                      label={Labels.title}
                      style={{width: '200px'}}
                      sortClick={sortClick}
                    />
                  </th>
                  <th>
                    <SearchControlTextBox
                      txtSet={dmcpFilenameSet}
                      txt={dmcpName}
                      label={Labels.dmcpFilename}
                      style={{width: '98px'}}
                      sortClick={sortClick}
                    />
                  </th>
                  <th>
                    <SearchControlMulti
                      selectItem={sourceChoose}
                      items={sources}
                      label={Labels.source}
                      style={{width: '125px'}}
                      sortClick={sortClick}
                    />
                  </th>
                  <th>
                    <SearchControlBoolean
                      select={dmcpSet}
                      selectVal={dmcp}
                      label={Labels.dmcp}
                      style={{width: '60px'}}
                      sortClick={sortClick}
                    />
                  </th>
                  <th>
                    <SearchControlBoolean
                      select={dcsSet}
                      selectVal={dcs}
                      label={Labels.dcs}
                      style={{width: '60px'}}
                      sortClick={sortClick}
                    />
                  </th>
                  <th>
                     {/* <SearchControlDateRange onDatesChange={onDatesChange} onFocusChange={onFocusChange} focusedInput={focusedInput} startDate={shelfStartDate} endDate={shelfEndDate} label={Labels.onShelf} style={{width: '400px'}} sortClick={sortClick}/> */}
                  </th>
                </tr>
              </thead>
              <ComicTableBody {...{ user, comics, openSubscribeModal, isSubscribedTitle }} />

              {/* Need a spacer here for long menus to show. :( */}
              {comics.length < 5 &&
              <tfoot>
                <tr><td style={{'borderStyle': 'none'}}><div style={{minHeight: '175px'}}>&nbsp;</div></td></tr>
              </tfoot>
              }

            </Table>
          </div>
        </Loader>

        {comics.length > 4 &&
        <ReactPaginate previousLabel={'previous'}
          nextLabel={'next'}
          breakLabel={<a href=''>...</a>}
          breakClassName={'break-me'}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={'pagination'}
          subContainerClassName={'pages pagination'}
          activeClassName={'active'}
          forcePage={currentPage} />
        }
      </div>
    )
  }
}

ComicSearch.propTypes = {
  user: PropTypes.object.isRequired
}

export default ComicSearch
