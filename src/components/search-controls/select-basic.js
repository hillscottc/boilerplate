import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap'

class SearchControlSelectBasic extends Component {
  constructor (props) {
    super(props)
    this.state = {
      sortOrder: 'asc'
    }
  }

  sortOrderSet = () => {
    const sortOrder = this.state.sortOrder
    this.props.sortClick(this.props.label, sortOrder)
    let newOrder = ''
    if (sortOrder === '' || sortOrder === 'desc') {
      newOrder = 'asc'
    } else {
      newOrder = 'desc'
    }
    this.setState({ sortOrder: newOrder })
  }

  render () {
    const {selectItem, currentItem, items, label, sortClick} = this.props
    return (
      <FormGroup>
        { sortClick &&
        <ControlLabel>
          <Button bsStyle='link' style={{margin: 0, padding: 0}} onClick={this.sortOrderSet} >{label}
          </Button>
        </ControlLabel>
        }
        { !sortClick &&
        <ControlLabel>{label}</ControlLabel>
        }
        <FormControl componentClass='select' onChange={(e) => selectItem(e)} value={currentItem} >
          {items.map((item) =>
            <option key={item.value} value={item.value}>{item.label}</option>
          )}
        </FormControl>
      </FormGroup>
    )
  }
}

SearchControlSelectBasic.propTypes = {
  selectItem: PropTypes.func.isRequired,
  currentItem: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  })).isRequired,
  label: PropTypes.string.isRequired,
  sortClick: PropTypes.func
}

export default SearchControlSelectBasic
