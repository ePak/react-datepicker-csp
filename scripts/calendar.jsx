import React from 'react';
//require('babel-core/polyfill');
import Month from './month';
import moment from 'moment';
import csp from 'js-csp';

export default class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment("2015-5-3"),
      endDate: moment("2015-5-6")
    };

  }

  render() {
    console.log('Calendar.render()');
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
        if (event.action === "selectDate") {
          cal._selectDateHandler(event.date);
        } else if (event.action === "mouseOver") {
          cal._mouseOverDateHandler(event.date);
        }
      }
    });
  }

  _selectDateHandler(date) {
    //if (this.state.startDate && this.state.endDate) {
    if (!this.state.inProgress) {
      this.setState({
        inProgress: 1,
        startDate: date,
        endDate: null
      });
    }
    if (this.state.inProgress) {
      this.setState({
        inProgress: true,
        startDate: date,
        endDate: null
      });
    } else if (this.state.startDate) {
      if (date.isAfter(this.state.startDate) {
        this.setState({ endDate: date });
      } else {
        this.setState({
          startDate: date,
          endDate: this.state.startDate
        });
      }
    } else {
      this.setState({ startDate: date });
    }
  }

  _mouseOverDateHandler(date) {

  }

  _getNewRange(date) {
    if (this.state.startDate && this.state.endDate) {
      return {
        startDate: date,
        endDate: null
      };
    } else if (!this.state.startDate && !this.state.endDate) {
      return { startDate: date };
    } else {
      return {
        startDate: this.state.startDate || date,
        endDate: this.state.endDate || date
      };
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


