import React from 'react';
import Immutable from 'immutable';
import moment from 'moment';
require('moment-range');
import Day from './day';
import csp from 'js-csp';
import _ from 'lodash';
import classNames from 'classnames';

export default class Month extends React.Component {

  render() {
    //console.log("Month.render()");
    const range = Month.getDisplayRange(this.props.date);
    const selectedRange = moment.range(this.props.selections.startDate, this.props.selections.endDate);

    var dates = [];
    range.by('days', date => dates.push(date));

    const weeks = _.chain(dates).chunk(7).map((wk, wkIndex) => {
      const days = _.map(wk, (day, dayIndex) => {
        const className = classNames({
          selected: selectedRange.contains(day),
          day_shoulder: Math.abs(day.date() - (wkIndex * 7 + dayIndex)) > 6
        });
        return (<Day 
          key={day.format('YYYY-MM-DD')}
          date={day}
          className={className}
          eventChan={this.props.eventChan} />);
      });
      return (<div className="week" key={wk[0].isoWeek()}>{days}</div>);
    }).value();

    return (
      <div className="month">
        <div className="month-header">
          <div className="month-backward glyphicon glyphicon-chevron-left"></div>
          <div className="month-caption">
            {this.props.date.format("MMMM YYYY")}
          </div>
          <div className="month-forward glyphicon glyphicon-chevron-right"></div>
        </div>
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

  static getDisplayRange(date) {
    const startDate = date.clone().startOf('month').startOf('isoWeek');
    const endDate = date.clone().endOf('month').endOf('isoWeek');
    return moment().range(startDate, endDate);
  }
}

Month.propTypes = {
  date: React.PropTypes.object.isRequired,
  eventChan: React.PropTypes.object.isRequired,
  selection: React.PropTypes.object
};
