import React from 'react';
import Month from './month';
import moment from 'moment';
import csp from 'js-csp';

export default class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: moment({year: this.props.year, month: this.props.month - 1}),
      selected: {
        inProgress: 0,
        startDate: null,
        endDate: null
      }
    };

  }

  render() {
    //console.log('Calendar.render()');
    return (
      <div className="calendar">
        <Month
          date={this.state.date}
          eventChan={this.state.chan}
          selected={this.state.selected}/>
        <Month
          date={this.state.date.clone().add(1, 'months')}
          eventChan={this.state.chan}
          selected={this.state.selected}/>
      </div>
    );
  }

  componentWillMount() {
    var cal = this;
    var ch = csp.chan();
    cal.setState({chan: ch});
    csp.go(function*() {
      while (true) {
        var event = yield csp.take(ch);
        if (event === csp.CLOSED) {
          return;
        }
        switch(event.action) {
          case "selectDate":
            cal._selectDateHandler(event.date);
            break;
          case "mouseOver":
            cal._mouseOverDateHandler(event.date);
            break;
          case "changeMonth":
            cal._changeMonthHandler(event.num);
          default:
        }
      }
    });
  }

  _selectDateHandler(date) {
    let newSelected = null;
    if (!this.state.selected.inProgress) {
      newSelected = {
        inProgress: 1,
        startDate: date,
        endDate: date
      };
    } else if (this.state.selected.inProgress > 0) {
      newSelected = {
        inProgress: 0,
        endDate: date
      };
    } else {
      newSelected = {
        inProgress: 0,
        startDate: date
      };
    }
    this.setState({ selected: _.extend({}, this.state.selected, newSelected)});
  }

  _mouseOverDateHandler(date) {
    let newSelected = null;
    if (!this.state.selected.inProgress) {
      return;
    } else if (this.state.selected.inProgress > 0) {
      if (date.isBefore(this.state.selected.startDate)) {
        newSelected = {
          inProgress: -1,
          startDate: date,
          endDate: this.state.selected.startDate
        };
      } else {
        newSelected = { endDate: date };
      }
    } else {
      if (date.isAfter(this.state.selected.endDate)) {
        newSelected = {
          inProgress: 1,
          startDate: this.state.selected.endDate,
          endDate: date
        };
      } else {
        newSelected = { startDate: date };
      }
    }
    this.setState({ selected: _.extend({}, this.state.selected, newSelected)});
  }

  _changeMonthHandler(num) {
    this.setState({ date: this.state.date.clone().add(num, 'months') });
  }

  componentWillUnmount() {
    this.state.chan.close();
  }
}

Calendar.propTypes = {
  year: React.PropTypes.number,
  month: React.PropTypes.number
};

Calendar.defaultProps = {
  year: moment().year(),
  month: moment().month() + 1
};


