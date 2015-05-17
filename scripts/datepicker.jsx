import React from 'react';
import Calendar from './calendar';
import csp from 'js-csp';

export default class DatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: {
        startDate: null,
        endDate: null
      }
    };
  }

  render() {
    let date = moment({ year: this.props.year, month: this.props.month - 1 });
    let startDate = this.state.selected.startDate;
    let endDate = this.state.selected.endDate;
    let formatDate = (date) => date ? date.format("YYYY-MM-DD") : "";
    let inputs; 
    if (this.props.options.range) {
      inputs = [
        <input ref="input-startdate" value={formatDate(startDate)} readOnly />,
        <span>to</span>,
        <input ref="input-enddate" value={formatDate(endDate)} readOnly />
      ];
    } else {
      inputs = (<input ref="input-date" value={ formatDate(startDate) } readOnly /> );
    };
      
    return (
      <div className="datepicker">
        <div className="datepicker-inputs">
          { inputs }
        </div>
        <Calendar 
          date={date}
          eventChan={this.state.chan}
          options={this.props.options} />
      </div>
    );
  }

  componentWillMount() {
    var picker = this;
    var ch = csp.chan();
    picker.setState({chan: ch});
    csp.go(function*() {
      while (true) {
        var event = yield csp.take(ch);
        if (event === csp.CLOSED) {
          return;
        }
        switch(event.action) {
          case "selectDate":
            picker._updateSelectedDate(event.selected); 
            break;
          default:
        }
      }
    });
  }

  _updateSelectedDate(selected) {
    let newDates = {
      startDate: null,
      endDate: null
    };
    if (selected.inProgress >= 0) 
      newDates.startDate = selected.startDate.clone()
    if (selected.inProgress <= 0) 
      newDates.endDate = selected.endDate.clone()

    this.setState({ selected: newDates });
  }

  componentWillUnmount() {
    this.state.chan.close();
  }

}

DatePicker.propTypes = {
  year: React.PropTypes.number,
  month: React.PropTypes.number,
  options: React.PropTypes.object
};

DatePicker.defaultProps = {
  year: moment().year(),
  month: moment().month() + 1,
  options: { range: false }
};
