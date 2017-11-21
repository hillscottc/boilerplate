import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'

const BoolOptList = [
  {value: '--', label: '--'},
  {value: '1', label: 'Y'},
  {value: '0', label: 'N'},
]

class SearchControlBoolean extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortOrder: "asc"
    }
  }

  sortOrderSet = () => {
    const sortOrder = this.state.sortOrder;
    this.props.sortClick(this.props.label, sortOrder)
    let newOrder = '';
    if (sortOrder === '' || sortOrder === 'desc') {
      newOrder = 'asc'
    } else {
      newOrder = 'desc'
    }
    this.setState({ sortOrder: newOrder })
  }

  render () {
    const {select, selectVal, label, sortClick, style} = this.props;
    return (
      <div>
        <FormGroup style={style}>
          { sortClick &&
            <ControlLabel>
              <Button bsStyle='link' style={{margin: 0, padding: 0}}
                onClick={this.sortOrderSet} >{label}
              </Button>
            </ControlLabel>
          }
          { !sortClick &&
            <ControlLabel>{label}</ControlLabel>
          }
          <FormControl componentClass='select' onChange={(e) => select(e)} value={selectVal} >
            {BoolOptList.map((item) =>
              <option key={item.value} value={item.value}>{item.label}</option>
            )}
          </FormControl>
        </FormGroup>
      </div>
    )
  }
}

SearchControlBoolean.propTypes = {
  select: PropTypes.func.isRequired,
  selectVal: PropTypes.string.isRequired,
  label: PropTypes.string,
  style: PropTypes.object,
  sortClick: PropTypes.func
}

export default SearchControlBoolean
