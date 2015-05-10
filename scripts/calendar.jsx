import React from 'react';
//require('babel-core/polyfill');
import Month from './month';
import moment from 'moment';
import csp from 'js-csp';

export default class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inProgress: 0,
      startDate: null,
      endDate: null
    };

  }

  render() {
    //console.log('Calendar.render()');
    return (
      <Month 
        year={this.props.year} 
        month={this.props.month - 1}
        eventChan={this.state.chan}
        selections={this.state}/>
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
          default:
        }
      }
    });
  }

  _selectDateHandler(date) {
    if (!this.state.inProgress) {
      this.setState({
        inProgress: 1,
        startDate: date,
        endDate: date
      });
    } else if (this.state.inProgress > 0) {
      this.setState({
        inProgress: 0,
        endDate: date
      });
    } else {
      this.setState({
        inProgress: 0,
        startDate: date
      });
    }
  }

  _mouseOverDateHandler(date) {
    if (!this.state.inProgress) {
      return;
    } else if (this.state.inProgress > 0) {
      if (date.isBefore(this.state.startDate)) {
        this.setState({
          inProgress: -1,
          startDate: date,
          endDate: this.state.startDate
        });
      } else {
        this.setState({ endDate: date });
      }
    } else {
      if (date.isAfter(this.state.endDate)) {
        this.setState({
          inProgress: 1,
          startDate: this.state.endDate,
          endDate: date
        });
      } else {
        this.setState({ startDate: date });
      }
    }
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


