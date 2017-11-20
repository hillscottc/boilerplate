import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { Button, ButtonToolbar, Panel } from 'react-bootstrap'

// Replaces old DPW code from /global_titles_library/comics_-_magazines/searchResultsIssuesComics.asp
class ComicSearch extends Component {
  constructor (props) {
    super(props)
    this.state = {
      msgBody: ''
    }
  }

  // Are any of the search options selected?
  canReset = () => {
    console.log('Not checking the options.')
    return true
  }

  // Reset the search options
  resetOptions = () => {
    console.log('Reset me!!')
  }

  render () {
    // Bound functions
    const { searchComicClick, canReset, resetOptions } = this

    // State values
    const { msgBody } = this.state

    return (
      <div className='ComicSearch'>

        <ButtonToolbar className={'affix'}>
          <div style={{display: 'inline', float: 'left'}}>
            <Button onClick={searchComicClick} bsStyle='success' bsSize='small' style={{width: '300px'}}>Query Records</Button>
            <Button onClick={resetOptions}
              bsStyle='warning' bsSize='small' style={{width: '300px'}}
              disabled={!canReset()}>Reset Search Options</Button>
          </div>
          <Panel bsStyle='info' style={{float: 'right', marginLeft: '10px'}}>{ msgBody }</Panel>
        </ButtonToolbar>

        <div style={{clear: 'both'}} />
        <br /><br /><br />
      </div>
    )
  }
}

ComicSearch.propTypes = {
  // user: PropTypes.object.isRequired
}

export default ComicSearch
