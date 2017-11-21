import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormGroup, ControlLabel, Button } from 'react-bootstrap'
import Multiselect from 'react-bootstrap-multiselect'

class SearchControlMulti extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sortOrder: 'asc'
    }
  }

  sortOrderSet = () => {
    const sortOrder = this.state.sortOrder;
    this.props.sortClick(this.props.label, sortOrder);
    let newOrder = ''
    if (sortOrder === '' || sortOrder === 'desc') {
      newOrder = 'asc'
    } else {
      newOrder = 'desc'
    }
    this.setState({ sortOrder: newOrder })
  }

  render () {
    const {items, selectItem, label, style, enableFiltering, sortClick} = this.props;
    return (
      <FormGroup style={style}>
        { sortClick &&
        <ControlLabel>
          <Button bsStyle='link' style={{margin: 0, padding: 0}} onClick={this.sortOrderSet} >{label}
          </Button>
        </ControlLabel>
        }
        { !sortClick &&
        <ControlLabel>{label}</ControlLabel>
        }
        <br />
        <Multiselect data={items}
          onChange={(e) => selectItem(e)}
          enableFiltering={enableFiltering}
          enableCaseInsensitiveFiltering
          multiple
          maxHeight={200}
          numberDisplayed={1} />
      </FormGroup>
    )
  }
}

SearchControlMulti.propTypes = {
  selectItem: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  label: PropTypes.string.isRequired,
  style: PropTypes.object,
  enableFiltering: PropTypes.bool,
  sortClick: PropTypes.func
}

export default SearchControlMulti
