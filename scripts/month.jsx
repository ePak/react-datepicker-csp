import React from 'react';
import Immutable from 'immutable';
import moment from 'moment';
require('moment-range');
import Day from './day';
import csp from 'js-csp';
import _ from 'lodash';
import classNames from 'classnames';

export default class Month extends React.Component {
  static dayOfWeekHeader() {
    //let weekday = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];
    let weekday = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
    return (
      <div className="weekday-header">
        { weekday.map((name) => (
          <span className="weekday" key={name}>
            <span className="text">
              { name }
            </span>
          </span>) ) }
      </div>
    );
  }


  render() {
    //console.log("Month.render()");
    const range = Month.getDisplayRange(this.props.date);
    const selectedRange = moment.range(this.props.selected.startDate, this.props.selected.endDate);

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
          <div className="month-backward glyphicon glyphicon-chevron-left"
               onClick={this._monthClickHandler.bind(this, -1)}></div>
          <div className="month-caption">
            {this.props.date.format("MMMM YYYY")}
          </div>
          <div className="month-forward glyphicon glyphicon-chevron-right"
               onClick={this._monthClickHandler.bind(this, 1)}></div>
        </div>
        { Month.dayOfWeekHeader() }
        {weeks}
      </div>
    );
  }

  _monthClickHandler(num, event) {
    event.preventDefault();
    event.stopPropagation();
    csp.putAsync(this.props.eventChan, {action: "changeMonth", num: num});
  }

  static getDisplayRange(date) {
    const startDate = date.clone().startOf('month').startOf('isoWeek');
    const endDate = date.clone().endOf('month').endOf('isoWeek');
    return moment().range(startDate, endDate);
  }
}

Month.propTypes = {
  date: React.PropTypes.object.isRequired,
  eventChan: React.PropTypes.object.isRequired,
  selected: React.PropTypes.object.isRequired
};
