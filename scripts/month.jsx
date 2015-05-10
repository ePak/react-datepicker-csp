import React from 'react';
import Immutable from 'immutable';
import moment from 'moment';
require('moment-range');
import Day from './day';
import csp from 'js-csp';
import _ from 'lodash';

export default class Month extends React.Component {

  render() {
    console.log("Month.render()");
    var range = Month.getDisplayRange(this.props.year, this.props.month);
    var selectedRange = moment.range(this.props.selections.startDate, this.props.selections.endDate);
    var eventChan = this.props.eventChan;
    var dates = [];
    /*
    range.by('days', date => {
      var className = selectedRange.contains(date) ? "selected" : "";
      days.push(<Day 
        key={date.format('YYYY-MM-DD')}
        date={date}
        className={className}
        eventChan={eventChan} />);
    });
    */
    range.by('days', date => dates.push(date));
    var weeks = _.chain(dates).chunk(7).map(wk => {
      var days = _.map(wk, date => {
        var className = selectedRange.contains(date) ? "selected" : "";
        return (<Day 
          key={date.format('YYYY-MM-DD')}
          date={date}
          className={className}
          eventChan={eventChan} />);
      });
      return (<div className="week" key={wk[0].isoWeek()}>{days}</div>);
    }).value();

    return (
      <div className="month">
        {weeks}
      </div>
    );
  }

  /*
  componentWillReceiveProps(nextProps) {
    if ((nextProps.year != this.props.year) ||
        (nextProps.month != this.props.month)) {
      this.setState({ 
        year: nextProps.year,
        month: nextProps.month,
        range: Month.getRange(nextProps.year, nextProps.month)
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return ((nextProps.year != this.props.year) ||
            (nextProps.month != this.props.month));
  }
  */

  static getDisplayRange(year, month) {
    const startDate = moment({year: year, month: month}).startOf('month').startOf('isoWeek');
    const endDate = moment({year: year, month: month}).endOf('month').endOf('isoWeek');
    return moment().range(startDate, endDate);
  }
}

Month.propTypes = {
  year: React.PropTypes.number.isRequired,
  month: React.PropTypes.number.isRequired,
  eventChan: React.PropTypes.object.isRequired,
  selection: React.PropTypes.object
};
