import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'

class SearchControlTextBox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sortOrder: 'asc'
    };
  }

  sortOrderSet = () => {
    const sortOrder = this.state.sortOrder
    this.props.sortClick(this.props.label, sortOrder)
    let newOrder = ''
    if (sortOrder === '' || sortOrder === 'desc' ) {
      newOrder = 'asc'
    } else {
      newOrder = 'desc'
    }
    this.setState({ sortOrder: newOrder })
  }

  render () {
    const {label, sortClick, style, txt, txtSet} = this.props

    return (
      <FormGroup style={style}>
        { sortClick &&
          <ControlLabel>
            <Button bsStyle='link' style={{margin: 0, padding: 0}} onClick={this.sortOrderSet} >{label}
            </Button>
          </ControlLabel>
        }
        { ! sortClick &&
          <ControlLabel>{label}</ControlLabel>
        }
        <FormControl type='text' value={txt} onChange={txtSet} />
      </FormGroup>
    )
  }
}

SearchControlTextBox.propTypes = {
  txtSet: PropTypes.func.isRequired,
  txt: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  style: PropTypes.object,
  sortClick: PropTypes.func
}

export default SearchControlTextBox
