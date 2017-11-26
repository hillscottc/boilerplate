import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, FormGroup, ControlLabel } from 'react-bootstrap'

class NotSearched extends Component {
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
    const {label, sortClick, style} = this.props

    return (
      <div>
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
        </FormGroup>
      </div>
    )
  }
}

NotSearched.propTypes = {
  label: PropTypes.string,
  style: PropTypes.object,
  sortClick: PropTypes.func
}

export default NotSearched
