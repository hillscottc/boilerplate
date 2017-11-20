import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, FormGroup, ControlLabel } from 'react-bootstrap'
import { DateRangePicker} from 'react-dates';


class SearchControlDateRange extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sortOrder: "asc"
    };
  }


  sortOrderSet  = () => {
    const sortOrder = this.state.sortOrder;
    this.props.sortClick(this.props.label, sortOrder);
    let newOrder = "";
    if (sortOrder === "" || sortOrder === "desc" ) {
      newOrder = "asc"
    } else {
      newOrder = "desc"
    }
    this.setState({ sortOrder: newOrder });
  };


  render () {
    const {startDate, endDate, onDatesChange, focusedInput, onFocusChange, label, style, sortClick} = this.props;
    return (
      <FormGroup style={style}>
        { sortClick &&
        <ControlLabel>
          <Button bsStyle="link" style={{margin: 0, padding: 0}}
                  onClick={this.sortOrderSet} >{label}
          </Button>
        </ControlLabel>
        }
        { ! sortClick &&
        <ControlLabel>{label}</ControlLabel>
        }
        <br/>
        <DateRangePicker
          startDate={startDate} // momentPropTypes.momentObj or null,
          endDate={endDate} // momentPropTypes.momentObj or null,
          onDatesChange={({ startDate, endDate }) => onDatesChange({ startDate, endDate })}
          focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
          onFocusChange={onFocusChange}
          showClearDates={true}
          isOutsideRange={() => false}   // enables all past dates
        />
      </FormGroup>
    )
  }
}


SearchControlDateRange.propTypes = {
  onDatesChange: PropTypes.func.isRequired,
  onFocusChange: PropTypes.func.isRequired,
  startDate: PropTypes.object,
  endDate: PropTypes.object,
  focusedInput: PropTypes.string,
  label: PropTypes.string.isRequired,
  style: PropTypes.object,
  sortClick: PropTypes.func,
};

export default SearchControlDateRange;
