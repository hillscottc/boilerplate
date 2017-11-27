import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Table, ButtonToolbar, Panel } from 'react-bootstrap'
import ReactPaginate from 'react-paginate'
import Loader from 'react-loader'
import { searchBook } from '../models/book-model'
import { getMultiSelected, resetMultiSelect, getQueryString, sortByLabel } from '../utils'
import SearchControlBoolean from '../components/search-controls/boolean'
import SearchControlTextBox from '../components/search-controls/text-box'
import SearchControlMulti from '../components/search-controls/multi'
// import SearchControlDateRange from '../components/search-controls/date-range'
import NotSearched from '../components/search-controls/not-searched'
import SubscribeModal from '../components/subscribe-modal'
import BookTableBody from '../components/book-table-body'
import { Labels } from '../components/search-controls/labels'
import { getSubscriptions, remSubscription, addSubscription } from '../models/subscription-model'
import { getCountryOpts } from '../models/country-model'
import { getPublisherOpts } from '../models/pubisher-model'
import { getPropertyOpts } from '../models/property-model'
import { getPropCatOpts } from '../models/propCat-model'
import { getFranchiseOpts } from '../models/franchise-model'
import { getFormatOpts } from '../models/format-model'
import { getSeriesOpts } from '../models/series-model'
import { getEBookOpts } from '../models/ebook-model'

const PER_PAGE = 50

// Replaces old DPW code from /global_titles_library/retail_books/searchResults.asp
class BookSearch extends Component {
  constructor (props) {
    super(props)
    this.state = {
      books: [],
      catProps: [],
      countries: [],
      currentPage: 0,
      dcs: '',
      dmcp: '',
      dmcpName: '',
      ebookFormats: [],
      focusedInput: null,
      formats: [],
      franchises: [],
      hrpdf: '',
      isbn: '',
      loaded: true,
      modalTitleId: '',
      msgBody: '',
      offset: 0,
      optDpwSelected: '--',
      optRRSelected: '--',
      optSubsSelected: '--',
      pageCount: 1,
      properties: [],
      publishers: [],
      refNum: '',
      series: [],
      seriesCode: '',
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
    }).catch((e) => {
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

    await getSeriesOpts().then((options) => {
      console.log(`Got ${options.length} series options.`)
      this.setState({series: options})
    })

    await getEBookOpts().then((options) => {
      console.log(`Got ${options.length} ebook options.`)
      this.setState({ebookFormats: options})
    })

    await getSubscriptions(this.props.user.contactId).then((items) => {
      console.log(`Got ${items.length} subscriptions for contactId ${this.props.user.contactId}.`)
      this.setState({subscriptions: items})
    })
  }

  // Are any of the search options selected?
  canReset = () => {
    const { optSubsSelected, optDpwSelected, optRRSelected, refNum, countries, publishers,
      properties, catProps, franchises, formats, titleCode, title, isbn, series,
      seriesCode, dmcpName, sources, ebookFormats, dmcp, hrpdf, dcs,
      shelfStartDate, shelfEndDate} = this.state
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
      getMultiSelected(formats).length > 0 ||
      titleCode ||
      title ||
      isbn ||
      seriesCode ||
      getMultiSelected(series).length > 0 ||
      getMultiSelected(ebookFormats).length > 0 ||
      dmcpName ||
      getMultiSelected(sources).length > 0 ||
      (dmcp !== '' && dmcp !== '--') ||
      (hrpdf !== '' && hrpdf !== '--') ||
      (dcs !== '' && dcs !== '--') ||
      shelfStartDate !== null ||
      shelfEndDate !== null
    )
  }

  onFocusChange = (focusedInput) => {
    this.setState({focusedInput})
  }

  onDatesChange = ({ startDate, endDate }) => {
    this.setState({
      shelfStartDate: startDate,
      shelfEndDate: endDate
    })
  }

  dmcpFilenameSet = (e) => {
    this.setState({dmcpName: e.target.value})
  }

  dcsSet = (e) => {
    this.setState({dcs: e.target.value})
  }

  dmcpSet = (e) => {
    this.setState({dmcp: e.target.value})
  }

  hrpdfSet = (e) => {
    this.setState({hrpdf: e.target.value})
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
    this.setState({formats: resetMultiSelect(this.state.formats)})
    this.setState({titleCode: ''})
    this.setState({title: ''})
    this.setState({isbn: ''})
    this.setState({seriesCode: ''})
    this.setState({series: resetMultiSelect(this.state.series)})
    this.setState({ebookFormats: resetMultiSelect(this.state.ebookFormats)})
    this.setState({dmcpName: ''})
    this.setState({sources: resetMultiSelect(this.state.sources)})
    this.setState({dmcp: ''})
    this.setState({hrpdf: ''})
    this.setState({dcs: ''})
    this.setState({shelfStartDate: null})
    this.setState({shelfEndDate: null})
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
    this.setState({title: e.target.value})
  }

  selectDpw = (e) => {
    this.setState({optDpwSelected: e.target.value})
  }

  selectRR = (e) => {
    this.setState({optRRSelected: e.target.value})
  }

  selectRefNum = (e) => {
    this.setState({refNum: e.target.value})
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
  }

  selectFormat = (e) => {
    const {formats} = this.state
    let clickedOpt = e[0]
    let foundIndex = formats.findIndex((x) => x.value === clickedOpt.value)
    formats[foundIndex].selected = clickedOpt.selected
    this.setState({formats})
  }

  selectTitleCode = (e) => {
    this.setState({titleCode: e.target.value})
  }

  selectIsbn = (e) => {
    this.setState({isbn: e.target.value})
  }

  selectSeriesCode = (e) => {
    this.setState({seriesCode: e.target.value})
  }

  selectSeries = (e) => {
    const {series} = this.state
    let clickedOpt = e[0]
    let foundIndex = series.findIndex((x) => x.value === clickedOpt.value)
    series[foundIndex].selected = clickedOpt.selected
    this.setState({series})
  }

  selectEBook = (e) => {
    const {ebookFormats} = this.state
    let clickedOpt = e[0]
    let foundIndex = ebookFormats.findIndex((x) => x.value === clickedOpt.value)
    ebookFormats[foundIndex].selected = clickedOpt.selected
    this.setState({ebookFormats})
  }

  selectSubscribed = (e) => {
    this.setState({optSubsSelected: e.target.value})
  }

  openSubscribeModal = (titleId, e) => {
    this.setState({ modalTitleId: titleId })
    this.setState({ showSubscribeModal: true })
  }

  closeSubscribeModal = () => {
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
    const formData = this.state
    formData.contactId = this.props.user.contactId
    // formData.offset = this.state.offset
    formData.limit = PER_PAGE
    return formData
  }

  searchBookClick = () => {
    this.setState({offset: 0, currentPage: 0}, () => {
      const qs = getQueryString(this.getFormData())

      this.setState({msgBody: 'Searching records...'})

      searchBook(qs).then(({page, books}) => {
        this.setState({books, pageCount: page.pageCount})
        this.setState({msgBody: `${books.length} records retrieved.`})
      }).catch((error) => {
        console.error('Sorry, server error: ' + error)
        this.setState({books: [], pageCount: 0})
      })
    })
  }

  // Is user subscribed to this titleId?
  isSubscribed = (titleId) => {
    let subs = this.state.subscriptions.filter(x => x.titleId === titleId)
    return subs.length > 0
  }

  handlePageClick = (data) => {
    let selected = data.selected
    let offset = Math.ceil(selected * PER_PAGE)

    this.setState({ offset }, () => {
      const qs = getQueryString(this.getFormData())
      this.setState({msgBody: 'Fetching records...'})

      searchBook(qs).then(({page, books}) => {
        this.setState({books, pageCount: page.pageCount, currentPage: selected})
        this.setState({msgBody: ''})
      })
    })
  }

  sortClick = (sortVal, order) => {
    const sorted = sortByLabel(this.state.books, sortVal, order)
    if (sorted) {
      this.setState({books: sorted})
    }
  }

  render () {
    // Bound functions
    const { canReset, clickSubscribe, closeSubscribeModal, dcsSet,
      dmcpFilenameSet, dmcpSet, handlePageClick, hrpdfSet,
      isSubscribed,
      // onDatesChange, onFocusChange,
      openSubscribeModal,
      resetOptions, searchBookClick, selectCatProp,
      selectCountry, selectDpw, selectEBook, selectFormat, selectFranchise,
      selectIsbn, selectProperty, selectPublisher, selectRefNum, selectRR,
      selectSeries, selectSeriesCode, selectSubscribed, selectTitleCode,
      sourceChoose, titleChoose, sortClick
    } = this

    // State values
    const {pageCount, books, catProps, countries, currentPage, dcs,
      dmcp, dmcpName, ebookFormats, formats, franchises,
      hrpdf, isbn, loaded, modalTitleId, msgBody,
      optDpwSelected, optRRSelected, optSubsSelected, properties,
      publishers, refNum, series, seriesCode,
      // focusedInput, shelfEndDate, shelfStartDate,
      showSubscribeModal, sources, subscriptions,
      title, titleCode
    } = this.state

    const user = this.props.user

    return (
      <div className='BookSearch'>

        <ButtonToolbar className={'affix'}>
          <div style={{display: 'inline', float: 'left'}}>
            <Button onClick={searchBookClick} bsStyle='success' bsSize='small' style={{width: '300px'}}>Search</Button>
            <Button onClick={resetOptions} bsStyle='warning' bsSize='small' style={{width: '300px'}}
              disabled={!canReset()}>Reset Search Options</Button>
          </div>
          <Panel bsStyle='info' style={{float: 'right', marginLeft: '10px'}}>{ msgBody }</Panel>
        </ButtonToolbar>

        <div style={{clear: 'both'}} />

        <br /><br /><br />

        <Loader loaded={loaded}>
          <div className='BookTable'>

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
                    <SearchControlMulti
                      selectItem={selectFormat}
                      items={formats}
                      label={'Category'}
                      enableFiltering
                    />
                  </th>
                  <th>
                    <SearchControlTextBox
                      txtSet={selectTitleCode}
                      txt={titleCode}
                      label={Labels.titleCode}
                      style={{width: '75px'}}
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
                      txtSet={selectIsbn}
                      txt={isbn}
                      label={Labels.isbn}
                      style={{width: '120px'}}
                      sortClick={sortClick}
                    />
                  </th>
                  <th>
                    <SearchControlTextBox
                      txtSet={selectSeriesCode}
                      txt={seriesCode}
                      label={Labels.seriesCode}
                      style={{width: '80px'}}
                      sortClick={sortClick}
                    />
                  </th>
                  <th>
                    <SearchControlMulti
                      selectItem={selectSeries}
                      items={series}
                      label={Labels.series}
                      enableFiltering
                      sortClick={sortClick}
                    />
                  </th>
                  <th>
                    <NotSearched
                      label={Labels.art}
                      sortClick={sortClick}
                    />
                  </th>
                  <th>
                    <SearchControlMulti
                      selectItem={selectEBook}
                      items={ebookFormats}
                      label={Labels.ebook}
                      enableFiltering
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
                      select={hrpdfSet}
                      selectVal={hrpdf}
                      label={'HR PDF'}
                      style={{width: '60px'}}
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
                    {/* <SearchControlDateRange onDatesChange={onDatesChange} onFocusChange={onFocusChange} focusedInput={focusedInput} startDate={shelfStartDate} endDate={shelfEndDate} label={'On Shelf'} style={{width: '400px'}} sortClick={sortClick} /> */}
                  </th>
                </tr>
              </thead>
              <BookTableBody {...{ user, books, openSubscribeModal, isSubscribed }} />

              {/* Need a spacer here for long menus to show. :( */}
              {books.length < 5 &&
              <tfoot>
                <tr><td style={{'borderStyle': 'none'}}><div style={{minHeight: '175px'}}>&nbsp;</div></td></tr>
              </tfoot>
              }
            </Table>
          </div>
        </Loader>

        {books.length > 4 &&
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

BookSearch.propTypes = {
  user: PropTypes.object.isRequired
}

export default BookSearch
